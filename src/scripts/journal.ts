import { sitePath } from '../lib/url';
import { writeName } from './WriteName';
import { initTide } from './TideTransition';
initTide();
writeName();
const hero = document.querySelector<HTMLElement>('.hero');
const menu = document.querySelector<HTMLDetailsElement>('#site-index');
const summary = menu?.querySelector('summary');
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
const heading = document.querySelector<HTMLElement>('.running-section');
const progress = document.querySelector<HTMLElement>('.reading-progress');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const nameStage = document.querySelector<HTMLElement>('.name-stage');
const nameZones = document.querySelectorAll<HTMLButtonElement>('.name-zone');
function showPhoto(name?: string) {
  if (!nameStage) return;
  nameStage.dataset.active = name || '';
  if (hero) hero.dataset.photo = name || '';
  nameZones.forEach(zone => zone.setAttribute('aria-pressed', String(zone.dataset.portrait === name)));
}
nameZones.forEach(zone => {
  zone.addEventListener('pointerenter', event => { if(event.pointerType==='mouse') showPhoto(zone.dataset.portrait); });
  zone.addEventListener('pointerleave', event => { if(event.pointerType==='mouse') showPhoto(); });
  zone.addEventListener('focus', () => showPhoto(zone.dataset.portrait));
  zone.addEventListener('blur', () => showPhoto());
  zone.addEventListener('click', event => { if((event as PointerEvent).pointerType==='touch') showPhoto(zone.dataset.portrait); });
});
document.addEventListener('pointerdown', event => {
  if (!(event.target instanceof Element) || !event.target.closest('.name-stage')) showPhoto();
});
document.addEventListener('keydown', event => { if(event.key==='Escape') showPhoto(); });

function keepSection() {
  const hash = location.hash || '';
  document.querySelectorAll<HTMLAnchorElement>('[data-language]').forEach(a => { a.href = sitePath(`/${a.dataset.language}/${hash}`); });
}
keepSection(); window.addEventListener('hashchange', keepSection);

let scheduled = false;
function onScroll() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    const total = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
    let current: HTMLElement | undefined;
    for (const section of sections) { if (section.getBoundingClientRect().top <= innerHeight * .42) current = section; }
    if (heading) heading.textContent = current ? `§ ${sections.indexOf(current)} / ${current.dataset.section}` : 'ENGINEER & GUITARIST';
    document.querySelectorAll<HTMLAnchorElement>('[data-language]').forEach(a => {a.href = sitePath(`/${a.dataset.language}/${current ? '#' + current.id : ''}`);});
  });
}
window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

menu?.addEventListener('toggle', () => {
  document.body.classList.toggle('index-open', menu.open);
  for (const el of document.querySelectorAll<HTMLElement>('main, footer')) el.inert = menu.open;
  summary?.setAttribute('aria-expanded', String(menu.open));
});
menu?.querySelectorAll<HTMLAnchorElement>('.index-panel a').forEach(link => link.addEventListener('click', () => {
  menu.open = false;
  const target = document.querySelector<HTMLElement>(link.hash);
  // Wait until the native details toggle removes inert before focusing the destination.
  requestAnimationFrame(() => { if (target) {target.inert = false; target.tabIndex = -1; target.focus({ preventScroll:true });} });
}));
document.addEventListener('keydown', event => {
  if (!menu?.open) return;
  if (event.key === 'Escape') { menu.open = false; summary?.focus(); }
  if (event.key === 'Tab') {
    const controls = Array.from(menu.querySelectorAll<HTMLElement>('summary, a[href]'));
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
});

// Native details preserve readable, useful project notes without JavaScript.
function openProjectHash() {
  const id = location.hash.slice(1);
  if (!id.startsWith('project-')) return;
  const detail = document.getElementById(id);
  if (detail instanceof HTMLDetailsElement) detail.open = true;
}
document.querySelectorAll<HTMLAnchorElement>('a[href^="#project-"]').forEach(a => a.addEventListener('click', () => {
  const detail = document.getElementById(a.hash.slice(1));
  if (detail instanceof HTMLDetailsElement) detail.open = true;
}));
window.addEventListener('hashchange', openProjectHash); openProjectHash();

const copy = document.querySelector<HTMLButtonElement>('#copy-email');
if (copy) {
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    const status = document.querySelector<HTMLElement>('#copy-status');
    try { await navigator.clipboard.writeText(copy.dataset.email || ''); if (status) status.textContent = copy.dataset.success || 'Copied'; }
    catch { if (status) status.textContent = copy.dataset.error || 'Please select and copy the email.'; }
  });
}

// Animate the original ink photograph after the initial page paint on both pointer types.
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
if (hero && !reduced.matches) {
  window.setTimeout(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('#ink-canvas');
    if (canvas && !reduced.matches) import('./InkShader').then(({ initInk }) => initInk(canvas, hero)).catch(() => {});
  }, finePointer.matches ? 650 : 1400);
}
// Ease desktop wheel input without taking ownership of touch or keyboard scrolling.
if (hero && !reduced.matches && finePointer.matches) {
  window.setTimeout(async () => {
    if (matchMedia('(pointer:fine)').matches) {
      const { default: Lenis } = await import('lenis');
      const lenis = new Lenis({ autoRaf: true, duration:.85, anchors:true, smoothWheel:true });
      const stopForPreference = () => { if (reduced.matches) lenis.destroy(); };
      reduced.addEventListener('change', stopForPreference);
      menu?.addEventListener('toggle', () => { if (menu.open) lenis.stop(); else lenis.start(); });
      window.addEventListener('pagehide', () => lenis.destroy(), { once:true });
    }
  }, 900);
}

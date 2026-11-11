/** Light and a small liquid refraction follow the pointer across the lettering. */
export function initNameCurrent() {
  const stage = document.querySelector<HTMLElement>('.name-stage');
  const trigger = stage?.querySelector<HTMLButtonElement>('.name-ink-trigger');
  const displacement = document.querySelector('#name-displacement');
  if (!stage || !trigger || !displacement) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = false, frame = 0, amount = 0, last = 0, phase = 0;
  let x = .5, y = .5, targetX = .5, targetY = .5;
  function paint(now: number) {
    frame = 0;
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    phase += dt;
    const ease = 1 - Math.exp(-dt * 10);
    amount += ((active ? 1 : 0) - amount) * ease;
    x += (targetX - x) * ease; y += (targetY - y) * ease;
    displacement!.setAttribute('scale', (amount * (7 + Math.sin(phase * 1.2) * 2)).toFixed(2));
    stage!.style.setProperty('--name-x', `${(x * 100).toFixed(2)}%`);
    stage!.style.setProperty('--name-y', `${(y * 100).toFixed(2)}%`);
    if (active || amount > .005) frame = requestAnimationFrame(paint);
    else displacement!.setAttribute('scale', '0');
  }
  function setActive(value: boolean) {
    active = value && !reduced.matches;
    stage!.dataset.inkActive = String(active);
    trigger!.setAttribute('aria-pressed', String(active));
    if (!frame) { last = performance.now(); frame = requestAnimationFrame(paint); }
  }
  trigger.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') setActive(true);
  });
  trigger.addEventListener('pointermove', event => {
    const box = stage.getBoundingClientRect();
    targetX = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
    targetY = Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
  });
  trigger.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') setActive(false);
  });
  trigger.addEventListener('focus', () => { if (trigger.matches(':focus-visible')) setActive(true); });
  trigger.addEventListener('blur', () => setActive(false));
  trigger.addEventListener('click', event => {
    if ((event as PointerEvent).pointerType === 'touch') setActive(!active);
  });
  document.addEventListener('pointerdown', event => {
    if (!(event.target instanceof Node) || !stage.contains(event.target)) setActive(false);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setActive(false); });
  const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) setActive(false); });
  observer.observe(stage);
  function preferenceChanged() {
    trigger!.hidden = reduced.matches;
    if (reduced.matches) {
      setActive(false); cancelAnimationFrame(frame); frame = 0; amount = 0;
      displacement!.setAttribute('scale', '0');
    }
  }
  reduced.addEventListener('change', preferenceChanged);
  document.addEventListener('visibilitychange', () => { if (document.hidden) setActive(false); });
  preferenceChanged();
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame); observer.disconnect();
    reduced.removeEventListener('change', preferenceChanged);
  }, { once: true });
}

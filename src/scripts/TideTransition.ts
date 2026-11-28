/** A reversible scroll shot. Native scrolling owns the timeline, never a wheel trap. */
export function initTide() {
  const sequence = document.querySelector<HTMLElement>('.opening-sequence');
  const hero = sequence?.querySelector<HTMLElement>('.hero');
  if (!sequence || !hero) return;
  const displacement = document.querySelector('#tide-displacement');
  const controls = hero.querySelectorAll<HTMLElement>('.hero-center, .hero-bottom');
  const touch = matchMedia('(pointer: coarse)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let current = 0;
  let target = 0;
  let origin = 0;
  let distance = 1;
  let leadDistance = 1;
  const tailStart = .44;
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const smooth = (a: number, b: number, n: number) => {
    const p = clamp((n - a) / (b - a));
    return p * p * (3 - 2 * p);
  };
  function paint() {
    frame = 0;
    current += (target - current) * (touch.matches ? 1 : .14);
    if (Math.abs(target - current) < .2) current = target;
    const lead = clamp(current / leadDistance);
    // Keep the first two crests on their original scroll clock. Stretch the third.
    const split = leadDistance * tailStart;
    const tide = current <= split
      ? lead
      : tailStart + (1 - tailStart) * clamp((current - split) / Math.max(1, distance - split));
    const retreat = smooth(.02, .57, lead);
    const edges = smooth(0, .25, lead);
    const caption = smooth(.42, .64, tide) * (1 - smooth(.83, .99, tide));
    hero!.style.setProperty('--tide', tide.toFixed(5));
    hero!.style.setProperty('--retreat', retreat.toFixed(5));
    hero!.style.setProperty('--edge-fade', (1 - edges).toFixed(5));
    hero!.style.setProperty('--caption', caption.toFixed(5));
    hero!.style.setProperty('--aperture', (Math.sin(tide * Math.PI) * .075).toFixed(5));
    hero!.dataset.tideProgress = tide.toFixed(4);
    hero!.dataset.leadTideProgress = lead.toFixed(4);
    if (touch.matches) {
      hero!.style.setProperty('--first-crest', `${118 - 136 * smooth(.02, .94, lead)}%`);
      hero!.style.setProperty('--second-crest', `${118 - 136 * smooth(.26, .98, lead)}%`);
      hero!.style.setProperty('--third-crest', `${122 - 124 * smooth(tailStart, 1, tide)}%`);
    }
    if (!touch.matches) displacement?.setAttribute('scale', (Math.sin(retreat * Math.PI) * 42).toFixed(2));
    // Faded controls should not intercept a click on the incoming article.
    controls.forEach(el => {
      el.inert = lead > .58;
    });
    if (current !== target) frame = requestAnimationFrame(paint);
  }
  function update() {
    target = reduced.matches ? 0 : Math.max(0, Math.min(distance, scrollY - origin));
    if (!frame) frame = requestAnimationFrame(paint);
  }
  function measure() {
    sequence!.classList.toggle('tide-enabled', !reduced.matches);
    if (reduced.matches) current = 0;
    origin = sequence!.getBoundingClientRect().top + scrollY;
    distance = Math.max(1, sequence!.offsetHeight - hero!.offsetHeight);
    const style = getComputedStyle(sequence!);
    const base = parseFloat(style.getPropertyValue('--tide-base'));
    const extra = parseFloat(style.getPropertyValue('--tide-tail'));
    const tail = reduced.matches ? 0 : sequence!.offsetHeight * extra / (base + extra);
    leadDistance = Math.max(1, distance - tail);
    update();
  }
  const resizer = new ResizeObserver(measure);
  resizer.observe(sequence);
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  reduced.addEventListener('change', measure);
  // Bring keyboard-focused controls back into the visible beginning of the shot.
  hero.addEventListener('focusin', () => {
    if (target / leadDistance > .58) window.scrollTo({ top: origin, behavior: 'instant' });
  });
  measure();
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    resizer.disconnect();
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', measure);
    reduced.removeEventListener('change', measure);
  }, { once: true });
}

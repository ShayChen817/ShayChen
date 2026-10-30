/** A reversible scroll shot. Native scrolling owns the timeline, never a wheel trap. */
export function initTide() {
  const sequence = document.querySelector<HTMLElement>('.opening-sequence');
  const hero = sequence?.querySelector<HTMLElement>('.hero');
  if (!sequence || !hero) return;
  const displacement = document.querySelector('#tide-displacement');
  const controls = hero.querySelectorAll<HTMLElement>('.hero-center, .hero-bottom');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let current = 0;
  let target = 0;
  let origin = 0;
  let distance = 1;
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const smooth = (a: number, b: number, n: number) => {
    const p = clamp((n - a) / (b - a));
    return p * p * (3 - 2 * p);
  };
  function paint() {
    frame = 0;
    current += (target - current) * .14;
    if (Math.abs(target - current) < .0002) current = target;
    const retreat = smooth(.02, .57, current);
    const edges = smooth(0, .25, current);
    const caption = smooth(.42, .64, current) * (1 - smooth(.78, .98, current));
    hero!.style.setProperty('--tide', current.toFixed(5));
    hero!.style.setProperty('--retreat', retreat.toFixed(5));
    hero!.style.setProperty('--edge-fade', (1 - edges).toFixed(5));
    hero!.style.setProperty('--caption', caption.toFixed(5));
    hero!.style.setProperty('--aperture', (Math.sin(current * Math.PI) * .075).toFixed(5));
    hero!.dataset.tideProgress = current.toFixed(4);
    displacement?.setAttribute('scale', (Math.sin(retreat * Math.PI) * 42).toFixed(2));
    // Faded controls should not intercept a click on the incoming article.
    controls.forEach(el => {
      el.inert = current > .58;
    });
    if (current !== target) frame = requestAnimationFrame(paint);
  }
  function update() {
    target = reduced.matches ? 0 : clamp((scrollY - origin) / distance);
    if (!frame) frame = requestAnimationFrame(paint);
  }
  function measure() {
    sequence!.classList.toggle('tide-enabled', !reduced.matches);
    if (reduced.matches) current = 0;
    origin = sequence!.getBoundingClientRect().top + scrollY;
    distance = Math.max(1, sequence!.offsetHeight - hero!.offsetHeight);
    update();
  }
  const resizer = new ResizeObserver(measure);
  resizer.observe(sequence);
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  reduced.addEventListener('change', measure);
  // Bring keyboard-focused controls back into the visible beginning of the shot.
  hero.addEventListener('focusin', () => {
    if (target > .58) window.scrollTo({ top: origin, behavior: 'instant' });
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

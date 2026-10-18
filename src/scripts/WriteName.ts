/** Reveal the pressure-shaped ink along individual hand-plotted pen trajectories. */
export function writeName() {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const svg=document.querySelector<SVGSVGElement>('.hero-wordmark svg');
  if(!svg || reduced.matches || (location.hash && location.hash!=='#top')){document.documentElement.classList.remove('will-write');return;}
  const ns='http://www.w3.org/2000/svg';
  const paths:[string,number,number][]=[
    ['M465 150C350 180 95 263 185 305C242 329 470 264 417 354C350 450 100 470 36 585',94,360],
    ['M583 210Q525 325 478 438',76,160],['M700 171C640 276 562 419 588 515',72,200],
    ['M415 367C510 331 657 274 795 273',63,170],['M701 417L832 216',75,150],
    ['M832 216C818 315 802 410 849 429',72,160],['M637 377L902 310',60,120],
    ['M915 256C880 364 906 382 1068 190',72,180],['M1068 192C1020 360 967 524 720 611',76,290],
    ['M1443 178C1310 166 1100 378 1164 467C1210 510 1340 435 1412 395',90,330],
    ['M1465 269L1407 439',66,140],['M1590 180C1550 280 1475 422 1505 509',72,210],
    ['M1360 363C1420 356 1580 280 1685 285',65,150],['M1668 258L1785 210',64,100],
    ['M1693 266L1599 437',74,150],['M1634 351L1747 298',65,100],['M1598 437L1768 365',74,140],
    ['M1728 524L1860 245Q1867 384 1934 431C1980 261 2052 154 2132 118',77,360]
  ];
  const defs=document.createElementNS(ns,'defs');
  const mask=document.createElementNS(ns,'mask');mask.id='name-writing';mask.setAttribute('maskUnits','userSpaceOnUse');mask.setAttribute('x','0');mask.setAttribute('y','0');mask.setAttribute('width','2119');mask.setAttribute('height','521');
  const strokes=document.createElementNS(ns,'g');strokes.setAttribute('transform','translate(-26 -107)');mask.append(strokes);defs.append(mask);
  const ink=document.createElementNS(ns,'g');Array.from(svg.children).filter(el=>el.tagName!=='title'&&el.tagName!=='defs').forEach(el=>ink.append(el));
  svg.append(defs,ink);ink.setAttribute('mask','url(#name-writing)');svg.dataset.writing='true';
  let delay=80;const animations:Animation[]=[];
  paths.forEach(([d,width,duration])=>{
    const p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.setAttribute('fill','none');p.setAttribute('stroke','white');p.setAttribute('stroke-width',String(width));p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');strokes.append(p);
    const length=p.getTotalLength();p.style.strokeDasharray=String(length);p.style.strokeDashoffset=String(length);
    animations.push(p.animate([{strokeDashoffset:length},{strokeDashoffset:0}],{duration,delay,easing:'cubic-bezier(.3,.1,.4,1)',fill:'forwards'}));delay+=duration*.78;
  });
  document.documentElement.classList.remove('will-write');
  const finish=()=>{ink.removeAttribute('mask');svg.dataset.writing='false';defs.remove();animations.forEach(a=>a.cancel());};
  Promise.all(animations.map(a=>a.finished)).then(finish).catch(finish);
  reduced.addEventListener('change',()=>{if(reduced.matches)finish();},{once:true});
}

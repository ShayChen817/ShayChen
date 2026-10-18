import sharp from 'sharp';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brand = join(root, 'public/assets/brand');
const images = join(root, 'public/assets/img');
await mkdir(brand, {recursive:true});
await mkdir(images, {recursive:true});
// Preserve the approved calligraphy and portrait. Re-trace explicitly with the trace scripts.
const wordmark = await readFile(join(brand, 'wordmark.svg'));
const portrait = await readFile(join(root,'art-source/portrait-cutout.png'));
// A geometric icon boundary removes residual extraction flecks outside the paper disk.
const portraitIcon = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1254" height="1254" viewBox="0 0 1254 1254"><defs><clipPath id="disk"><circle cx="624" cy="617" r="555"/></clipPath></defs><image width="1254" height="1254" clip-path="url(#disk)" href="data:image/png;base64,${portrait.toString('base64')}"/></svg>`);
for(const size of [128,256]) await sharp(portraitIcon).resize(size,size).webp({quality:95}).toFile(join(brand,`portrait-cutout-${size}.webp`));
for (const size of [16,32,180,512]) await sharp(portraitIcon).resize(size,size).png().toFile(join(brand, `portrait-cutout-${size}.png`));
const portraitPng=await sharp(portraitIcon).resize(256,256).png().toBuffer();
await writeFile(join(brand,'portrait-cutout.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><image width="256" height="256" href="data:image/png;base64,${portraitPng.toString('base64')}"/></svg>`);
// Only deterministic photo resizing, crop and colour. Withdrawn images are excluded.
if (!process.argv.includes('--brand-only')) for (const [name,file] of [['portrait','defalut-pic.jpg'],['nice','chill-pic.jpg'],['band','乐队pic.jpg']]) {
  for (const width of [640,1280,1920]) {
    let pipeline = sharp(join(root,'..',file)).rotate().resize(width,Math.round(width*1.25),{fit:'cover',position:'centre'});
    if (name==='portrait') pipeline=pipeline.linear(.97,3);
    if (name==='nice') pipeline=pipeline.modulate({saturation:.85,brightness:.96});
    if (name==='band') pipeline=pipeline.modulate({saturation:.88,brightness:.96});
    await Promise.all([
      pipeline.clone().avif({quality:48,effort:4}).toFile(join(images,`${name}-${width}.avif`)),
      pipeline.clone().webp({quality:80}).toFile(join(images,`${name}-${width}.webp`)),
      pipeline.clone().jpeg({quality:82,mozjpeg:true}).toFile(join(images,`${name}-${width}.jpg`))
    ]);
  }
}
const hero = join(root,'art-source/hero-ink-final.png');
await sharp(hero).webp({quality:94,effort:6}).toFile(join(brand,'ink-photo.webp'));
const meta=await sharp(hero).metadata();
const mobileWidth=Math.round(meta.height*9/16);
await sharp(hero).extract({left:Math.round((meta.width-mobileWidth)*.66),top:0,width:mobileWidth,height:meta.height}).webp({quality:92,effort:6}).toFile(join(brand,'ink-photo-mobile.webp'));
const wordmarkPng = await sharp(wordmark).resize(1030).png().toBuffer();
for (const locale of ['en','zh']) {
  const role = locale==='en' ? 'ENGINEER · GUITARIST' : '工程师 · 吉他手';
  const text = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><text x="85" y="85" fill="#A39E93" font-family="monospace" font-size="15" letter-spacing="3">A JOURNAL PRINTED IN INK</text><text x="85" y="470" fill="#E6E1D6" font-family="Microsoft YaHei,monospace" font-size="21">${role}</text><text x="85" y="550" fill="#A39E93" font-family="Microsoft YaHei,monospace" font-size="14">LEUVEN, BELGIUM · SHAY CHEN / 陈乐涵</text></svg>`;
  await sharp(hero).resize(1200,630).composite([{input:wordmarkPng,left:85,top:165},{input:Buffer.from(text),left:0,top:0}]).jpeg({quality:88}).toFile(join(brand,`og-${locale}.jpg`));
}
await copyFile(join(root,'../ShayChen_CV.pdf'), join(root,'public/assets/ShayChen_CV.pdf'));
console.log('Prepared portrait brand icons, ink backgrounds, share images and latest CV; photo variants regenerated unless --brand-only.');

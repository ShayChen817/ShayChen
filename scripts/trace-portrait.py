"""Convert the generated black line portrait into a compact cream SVG brand mark."""
from pathlib import Path
from PIL import Image, ImageOps
import re, vtracer

root=Path(__file__).resolve().parent.parent
source=root/'art-source/portrait-mark.png'
bitmap=Image.open(source).convert('L').point(lambda p: 255 if p>155 else 0)
box=ImageOps.invert(bitmap).getbbox()
x0,y0,x1,y1=box
bitmap=bitmap.crop((max(0,x0-24),max(0,y0-24),min(bitmap.width,x1+24),min(bitmap.height,y1+24)))
binary=root/'art-source/portrait-mark-binary.png'
bitmap.save(binary)
traced=root/'art-source/portrait-mark-traced.svg'
vtracer.convert_image_to_svg_py(str(binary),str(traced),colormode='binary',mode='spline',filter_speckle=12,corner_threshold=70,length_threshold=4,path_precision=1)
svg=re.sub(r'<\?xml[^>]+>','',traced.read_text())
svg=svg.replace('fill="#000000"','fill="#E6E1D6"')
side=max(bitmap.size)+40
x=(side-bitmap.width)/2
y=(side-bitmap.height)/2
body=re.sub(r'^.*?<svg[^>]*>','',svg,flags=re.S).rsplit('</svg>',1)[0]
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side} {side}"><title>Shay Chen portrait</title><g transform="translate({x:g} {y:g})">{body}</g></svg>'
(root/'public/assets/brand/portrait-mark.svg').write_text(svg,encoding='utf-8')
print(f'Portrait SVG: {len(svg):,} bytes; square viewBox {side}')

"""Trace the approved brush lettering into a transparent, cream SVG."""
from pathlib import Path
from PIL import Image, ImageOps
import re, vtracer
root=Path(__file__).resolve().parent.parent
source=root/'art-source/wordmark-calligraphy.png'
im=Image.open(source).convert('L')
im=im.point(lambda p: 255 if p>165 else 0)
box=ImageOps.invert(im).getbbox()
x0,y0,x1,y1=box
im=im.crop((max(0,x0-12),max(0,y0-12),min(im.width,x1+12),min(im.height,y1+12)))
temp=root/'art-source/wordmark-binary.png'
im.save(temp)
raw=root/'art-source/wordmark-traced.svg'
vtracer.convert_image_to_svg_py(str(temp),str(raw),colormode='binary',mode='spline',filter_speckle=5,corner_threshold=75,length_threshold=3.5,path_precision=2)
svg=raw.read_text()
svg=re.sub(r'<\?xml[^>]+>','',svg)
svg=svg.replace('fill="#000000"','fill="#E6E1D6"')
svg=re.sub(r'<svg[^>]*>',f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {im.width} {im.height}" role="img" aria-labelledby="wordmark-title"><title id="wordmark-title">SHAY CHEN — expressive brush calligraphy</title>',svg,count=1)
(root/'public/assets/brand/wordmark.svg').write_text(svg)
(root/'src/assets/wordmark.svg').write_text(svg)
print(f'Traced {im.width} × {im.height}; SVG {len(svg):,} bytes')

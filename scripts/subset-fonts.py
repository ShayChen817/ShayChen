"""Subset locally installed Fontsource CJK shards to this site's actual copy."""
import pathlib, re
from fontTools import subset
from fontTools.ttLib import TTFont

root = pathlib.Path(__file__).resolve().parent.parent
target = root / 'public' / 'assets' / 'brand' / 'fonts'
target.mkdir(parents=True, exist_ok=True)
text = ''.join(p.read_text(encoding='utf-8') for p in (root/'src').rglob('*') if p.suffix in ('.ts','.astro'))
codepoints = {ord(c) for c in text}
css = []
for package, family in [('noto-serif-sc','Noto Serif SC'),('lxgw-wenkai','LXGW WenKai')]:
    folder = root/'node_modules'/'@fontsource'/package
    sheet = folder / '400.css'
    if package == 'lxgw-wenkai':
        folder = root/'node_modules'/'lxgw-wenkai-webfont'
        sheet = folder/'lxgwwenkai-regular.css'
    if not sheet.exists(): sheet = folder/'500.css'
    if not sheet.exists(): sheet = folder/'index.css'
    if not sheet.exists():
        print('Missing font package CSS:', package)
        continue
    raw = sheet.read_text(encoding='utf-8')
    for block in re.findall(r'@font-face\s*\{(.*?)\}',raw,re.S):
        match = re.search(r'url\([\"\']?([^\"\')]+\.woff2)[\"\']?\)',block)
        if not match: continue
        source = folder/match.group(1).strip('\"\'')
        dest = target/source.name
        font = TTFont(source)
        available = set().union(*(set(table.cmap) for table in font['cmap'].tables))
        used = available & codepoints
        if not used: font.close();continue
        cached = False
        if dest.exists():
            existing = TTFont(dest)
            cached = used.issubset(set(existing.getBestCmap()))
            existing.close()
        if not cached:
            # The source WenKai includes large legacy AAT shaping tables.
            # Horizontal display text here needs none of these layout tables.
            if package == 'lxgw-wenkai':
                for tag in ['morx','feat','prop','bsln','BASE','FFTM','GSUB','GPOS','GDEF']:
                    if tag in font: del font[tag]
            options = subset.Options()
            options.flavor = 'woff2'
            options.layout_features = []
            options.layout_closure = False
            sub = subset.Subsetter(options=options)
            sub.populate(unicodes=used)
            sub.subset(font)
            font.save(dest)
        font.close()
        ranges = ','.join(f'U+{c:X}' for c in sorted(used))
        css.append(f"@font-face{{font-family:'{family}';font-style:normal;font-weight:400;font-display:swap;src:url('./fonts/{dest.name}') format('woff2');unicode-range:{ranges};}}")
    print(f'Prepared {family}', flush=True)
(target.parent/'zh-fonts.css').write_text('\n'.join(css),encoding='utf-8')
print(f'Subset {len(css)} shards: {sum(p.stat().st_size for p in target.glob("*.woff2")):,} bytes')

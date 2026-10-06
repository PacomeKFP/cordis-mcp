"""Package one private plugin, without source code, credentials or dependencies."""
import json
import zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
plugin=root/'plugins'/'cordis'
manifest=json.loads((plugin/'plugin.json').read_text(encoding='utf8'))
assert manifest['name']=='cordis'
assert len(manifest['extensions']['com.openai']['interface']['shortDescription'])<=30
output=root/'dist'/'cordis-plugin.zip';output.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as archive:
    for source in sorted(plugin.rglob('*')):
        if source.is_file():archive.write(source,Path('cordis')/source.relative_to(plugin))
print(output)

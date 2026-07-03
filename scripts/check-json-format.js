const fs = require('fs');
const files = [
  'kausal-konzessivsatze.md', 'kausal-konzessivsatze.en.md',
  'temporal-lokal-angaben.md', 'temporal-lokal-angaben.en.md',
  'wortstellung-erweitert.md', 'wortstellung-erweitert.en.md'
];
for (const f of files) {
  const c = fs.readFileSync('docs/grammatik/' + f, 'utf8');
  const re = /data-answers='(\[.*?\])'/g;
  let idx = 0;
  const matches = [];
  let m;
  while ((m = re.exec(c)) !== null) {
    matches.push({ index: m.index, json: m[1] });
  }
  console.log('\n' + f + ' (' + matches.length + ' data-answers):');
  for (const match of matches) {
    console.log('  ' + match.json.substring(0, 60) + (match.json.length > 60 ? '...' : ''));
  }
}

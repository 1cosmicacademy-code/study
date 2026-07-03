const fs = require('fs');
const c = fs.readFileSync('docs/grammatik/reflexive-verben.md', 'utf8');
const re = /data-answers='(\[[\s\S]*?\])'/g;
let m;
while ((m = re.exec(c)) !== null) {
  console.log(m[1]);
  console.log('---');
}

const http = require('http');
const BASE = {hostname:'127.0.0.1',port:10086};

function cmd(action, args) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({action, args, session:'netlify-auth-temp'});
    const req = http.request({...BASE, path:'/command', method:'POST', headers:{'Content-Type':'application/json', 'Content-Length':Buffer.byteLength(data)}}, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        const parsed = JSON.parse(body);
        if (parsed.error) return reject(new Error(parsed.error.message));
        resolve(parsed.data);
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Navigating to signup...');
  await cmd('navigate', {url: 'https://app.netlify.com/signup'});
  await new Promise(r => setTimeout(r, 4000));

  console.log('Clicking GitHub button...');
  const result = await cmd('evaluate', {code: "(()=>{const btns=document.querySelectorAll('button');for(const b of btns){if(b.textContent.includes('GitHub')){b.click();return 'clicked: '+b.textContent;}}return 'not found';})()"});
  console.log('Result:', result?.value);

  await new Promise(r => setTimeout(r, 5000));

  const url = await cmd('evaluate', {code: 'window.location.href'});
  console.log('URL:', url?.value);

  const btns = await cmd('evaluate', {code: "(()=>{const b=document.querySelectorAll('button');return Array.from(b).map(x=>x.textContent).join(' | ');})()"});
  console.log('Buttons:', btns?.value);

  const auth = await cmd('evaluate', {code: "(()=>{const btns=document.querySelectorAll('button');for(const b of btns){if(b.textContent.includes('Authorize')){b.click();return 'clicked: '+b.textContent;}}return 'none';})()"});
  console.log('Authorize:', auth?.value);

  await new Promise(r => setTimeout(r, 5000));

  const final = await cmd('evaluate', {code: 'window.location.href + \" | \" + document.title'});
  console.log('Final:', final?.value);
}

main().catch(console.error);

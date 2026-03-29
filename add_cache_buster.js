const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const v = '?v=' + Date.now();
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/src="(js\/.*?\.js)(?:\?v=\d+)?"/g, 'src="$1' + v + '"');
  c = c.replace(/href="(css\/styles\.css)(?:\?v=\d+)?"/g, 'href="$1' + v + '"');
  fs.writeFileSync(f, c);
});
console.log('Added cache buster to', files.length, 'files');

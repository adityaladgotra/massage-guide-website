import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const out = path.join(root, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
// Copy the editable checkout-config.js directly so the source and deployed build
// always use the same checkout URL. No .env file is required.
for (const name of ['index.html', 'styles.css', 'script.js', 'checkout-config.js', 'live-config.js', 'live-tracker.js']) {
  fs.copyFileSync(path.join(root, name), path.join(out, name));
}
fs.cpSync(path.join(root, 'images'), path.join(out, 'images'), { recursive: true });
fs.cpSync(path.join(root,'live'),path.join(out,'live'),{recursive:true});
console.log('Build completed:', out);
console.log('Checkout URL is read from checkout-config.js');

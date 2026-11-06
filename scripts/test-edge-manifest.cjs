'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const validate=require('./validate-edge-manifest.cjs');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../edge-extension/manifest.json'),'utf8'));
validate(manifest);
for(const directive of ['object-src','worker-src','script-src']){
 const bad=structuredClone(manifest);
 bad.content_security_policy.extension_pages=manifest.content_security_policy.extension_pages.replace(directive+" 'self'",directive+" 'self' blob:");
 assert.throws(()=>validate(bad),new RegExp(directive));
}
const original=structuredClone(manifest);original.content_security_policy.extension_pages="script-src 'self'; worker-src 'self'; object-src 'self' blob:; frame-src 'self' blob:; connect-src 'self' https://spotigetta.github.io";
assert.throws(()=>validate(original),/object-src/,'The exact reported installation failure must be rejected before packaging');
const missingBlob=structuredClone(manifest);missingBlob.content_security_policy.extension_pages=manifest.content_security_policy.extension_pages.replace('connect-src \'self\' blob:','connect-src \'self\'');
assert.throws(()=>validate(missingBlob),/connect-src/);
assert(!JSON.stringify(manifest.permissions).includes('tabs'));
console.log('PASS Edge Manifest V3: reported object-src blob regression rejected, packaged scripts/workers restricted, local PDF fetch allowed; no added permissions.');

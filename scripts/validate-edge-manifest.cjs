'use strict';
function validateManifest(manifest){
 if(manifest.manifest_version!==3||!manifest.side_panel?.default_path)throw Error('La extensión necesita manifest v3 y panel lateral');
 const policy=manifest.content_security_policy?.extension_pages;
 if(typeof policy!=='string')throw Error('Falta la política de seguridad de las páginas de extensión');
 const directives=new Map();
 for(const statement of policy.split(';')){const [name,...sources]=statement.trim().split(/\s+/);if(!name)continue;if(directives.has(name))throw Error('Directiva CSP repetida: '+name);directives.set(name,sources)}
 for(const name of ['script-src','worker-src','object-src']){
  const sources=directives.get(name);
  if(!sources?.length||sources.some(value=>!['\'self\'','\'none\''].includes(value)))throw Error('CSP incompatible con Manifest V3 en '+name+': se permite únicamente self o none');
 }
 if(!directives.get('connect-src')?.includes('blob:'))throw Error('El lector PDF necesita poder leer sus URL blob mediante connect-src');
 return manifest;
}
module.exports=validateManifest;
if(require.main===module){const fs=require('node:fs'),path=require('node:path');validateManifest(JSON.parse(fs.readFileSync(path.join(__dirname,'../edge-extension/manifest.json'),'utf8')));console.log('Manifest V3: directivas de ejecución restringidas y lectura de PDF blob permitida.');}

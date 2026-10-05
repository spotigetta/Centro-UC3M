'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const source=path.join(root,'src');
const data=path.join(root,'data','state.json');
const out=path.join(root,'dist');
if(path.relative(root,out)!=='dist')throw Error('Destino de compilación fuera del repositorio');
const checkOnly=process.argv.includes('--check');
const compatRoot=process.argv.includes('--compat-root');
const noMaterial=process.argv.includes('--without-material');
const required=['index.html','app.js','styles.css','sw.js','shared/academic-core.js','shared/overview.js'];
for(const file of required)if(!fs.statSync(path.join(source,file)).isFile())throw Error('Falta src/'+file);
const state=JSON.parse(fs.readFileSync(data,'utf8'));
if(state.version!==3||!Array.isArray(state.subjects)||!Array.isArray(state.files))throw Error('data/state.json no tiene el formato esperado');
let materialBytes=0,materialCount=0;
const published=[];
for(const entry of state.files){
  if(entry.localOnly)continue;
  const relative=String(entry.path||'').replace(/\\/g,'/');
  const file=path.resolve(root,'material',relative);
  const materialRoot=path.resolve(root,'material')+path.sep;
  if(!relative||relative.startsWith('/')||relative.split('/').includes('..')||!file.startsWith(materialRoot))throw Error('Ruta de material inválida: '+relative);
  const stat=fs.lstatSync(file);
  if(!stat.isFile())throw Error('El material no es un archivo normal: '+relative);
  materialBytes+=stat.size;materialCount++;
  published.push({relative,file});
}
if(materialBytes>1000*1024*1024)throw Error('El material supera 1 GiB; revisa el tamaño del sitio antes de publicarlo');
const hash=crypto.createHash('sha256');
for(const file of ['app.js','styles.css','index.html','shared/academic-core.js','shared/overview.js'])hash.update(fs.readFileSync(path.join(source,file)));
hash.update(fs.readFileSync(data));
const buildId=hash.digest('hex').slice(0,12);
if(checkOnly){console.log(`Build comprobado: ${state.subjects.length} asignaturas, ${materialCount} archivos, ${(materialBytes/1024/1024).toFixed(1)} MiB, versión ${buildId}.`);process.exit(0)}
if(compatRoot){
  for(const file of ['index.html','app.js','styles.css'])fs.copyFileSync(path.join(source,file),path.join(root,file));
  fs.mkdirSync(path.join(root,'shared'),{recursive:true});
  for(const file of ['academic-core.js','overview.js'])fs.copyFileSync(path.join(source,'shared',file),path.join(root,'shared',file));
  fs.writeFileSync(path.join(root,'sw.js'),fs.readFileSync(path.join(source,'sw.js'),'utf8').replaceAll('__UC3M_BUILD__',buildId));
  console.log(`Raíz compatible actualizada: versión ${buildId}.`);
  process.exit(0);
}
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
function copyTree(from,to){for(const item of fs.readdirSync(from,{withFileTypes:true})){const src=path.join(from,item.name),dst=path.join(to,item.name);if(item.isDirectory()){fs.mkdirSync(dst,{recursive:true});copyTree(src,dst)}else if(item.isFile())fs.copyFileSync(src,dst);else throw Error('Enlace o archivo especial no permitido: '+src)}}
copyTree(source,out);
for(const file of ['manifest.webmanifest','icon.svg','logo-uc3m.png','.nojekyll'])fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.mkdirSync(path.join(out,'data'),{recursive:true});
fs.copyFileSync(data,path.join(out,'data','state.json'));
const worker=path.join(out,'sw.js');
fs.writeFileSync(worker,fs.readFileSync(worker,'utf8').replaceAll('__UC3M_BUILD__',buildId));
if(!noMaterial)for(const {relative,file} of published){const target=path.join(out,'material',relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target)}
console.log(`Centro UC3M compilado en dist/: ${state.subjects.length} asignaturas, ${noMaterial?0:materialCount} archivos, versión ${buildId}.`);

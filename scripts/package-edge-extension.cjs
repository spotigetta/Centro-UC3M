'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'..'),source=path.join(root,'edge-extension');
const table=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0});
function crc32(data){let n=0xffffffff;for(const byte of data)n=table[(n^byte)&255]^(n>>>8);return(n^0xffffffff)>>>0}
function packageExtension(write=true){
  const manifest=JSON.parse(fs.readFileSync(path.join(source,'manifest.json'),'utf8'));
  if(manifest.manifest_version!==3||!manifest.side_panel?.default_path)throw Error('La extensión necesita manifest v3 y panel lateral');
  const entries=[];
  function walk(dir,prefix=''){
    for(const item of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))){
      const name=prefix+item.name,full=path.join(dir,item.name);
      if(item.isSymbolicLink())throw Error('No se empaquetan enlaces: '+name);
      if(item.isDirectory())walk(full,name+'/');
      else if(item.isFile()&&!item.name.startsWith('.'))entries.push({name,data:fs.readFileSync(full)});
    }
  }
  walk(source);
  if(entries.length>65535)throw Error('Demasiados archivos para el ZIP');
  const parts=[],central=[];let offset=0;
  for(const {name,data}of entries){
    const filename=Buffer.from(name,'utf8'),compressed=zlib.deflateRawSync(data),crc=crc32(data);
    const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6);local.writeUInt16LE(8,8);local.writeUInt16LE(33,12);local.writeUInt32LE(crc,14);local.writeUInt32LE(compressed.length,18);local.writeUInt32LE(data.length,22);local.writeUInt16LE(filename.length,26);
    const record=Buffer.alloc(46);record.writeUInt32LE(0x02014b50);record.writeUInt16LE(20,4);record.writeUInt16LE(20,6);record.writeUInt16LE(0x800,8);record.writeUInt16LE(8,10);record.writeUInt16LE(33,14);record.writeUInt32LE(crc,16);record.writeUInt32LE(compressed.length,20);record.writeUInt32LE(data.length,24);record.writeUInt16LE(filename.length,28);record.writeUInt32LE(offset,42);
    parts.push(local,filename,compressed);central.push(record,filename);offset+=local.length+filename.length+compressed.length;
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  const archive=Buffer.concat([...parts,directory,end]);
  if(write)fs.writeFileSync(path.join(root,'edge-extension.zip'),archive);
  return {archive,files:entries.length,version:manifest.version};
}
module.exports=packageExtension;
if(require.main===module){const result=packageExtension();console.log(`Extensión Edge empaquetada: ${result.files} archivos, ${(result.archive.length/1024/1024).toFixed(1)} MiB, versión ${result.version}.`)}

'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const repo=path.resolve(__dirname,'..');
const vault=path.resolve(repo,'../..');
const source=path.join(vault,'.obsidian','Centro-UC3M-Obsidian','Herramientas','build-mobile.cjs');
if(!fs.existsSync(source)){
  console.error('No se encuentra el generador local del Centro UC3M. Abre este repositorio dentro de la bóveda MÁSTER.');
  process.exit(1);
}
execFileSync(process.execPath,[source],{cwd:vault,stdio:'inherit'});
execFileSync(process.execPath,[path.join(repo,'scripts','build.cjs'),'--check'],{cwd:repo,stdio:'inherit'});
execFileSync('git',['add','-A','--','data/state.json','Panel UC3M.md','material','index.html','app.js','styles.css','sw.js','shared'],{cwd:repo,stdio:'inherit'});

'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const repo=path.resolve(__dirname,'..');
const dist=path.join(repo,'dist');
const worktree=path.join(repo,'.pages-worktree');
const branch='gh-pages';
const push=process.argv.includes('--push');
const git=(args,cwd=repo,options={})=>execFileSync('git',args,{cwd,encoding:'utf8',stdio:options.capture?'pipe':'inherit'}).trim();
const exists=args=>{try{git(args,repo,{capture:true});return true}catch{return false}};
if(path.relative(repo,worktree)!=='.pages-worktree')throw Error('Directorio de publicación fuera del repositorio');
git(['rev-parse','--show-toplevel'],repo,{capture:true});
execFileSync(process.execPath,[path.join(repo,'scripts','build.cjs')],{cwd:repo,stdio:'inherit'});
if(fs.existsSync(worktree)&&!fs.existsSync(path.join(worktree,'.git')))throw Error('.pages-worktree existe pero no es un worktree de Git');
if(!fs.existsSync(worktree)){
  if(exists(['show-ref','--verify','--quiet','refs/heads/'+branch]))git(['worktree','add',worktree,branch]);
  else if(exists(['show-ref','--verify','--quiet','refs/remotes/origin/'+branch]))git(['worktree','add','-b',branch,worktree,'origin/'+branch]);
  else git(['worktree','add','--orphan','-b',branch,worktree]);
}
const resolved=fs.realpathSync(worktree),expected=path.resolve(worktree);
if(resolved.toLowerCase()!==expected.toLowerCase())throw Error('El worktree de publicación no coincide con el destino esperado');
git(['rm','-r','--ignore-unmatch','.'],worktree);
for(const item of fs.readdirSync(worktree,{withFileTypes:true})){
  if(item.name==='.git')continue;
  fs.rmSync(path.join(worktree,item.name),{recursive:true,force:true});
}
function copyTree(from,to){for(const item of fs.readdirSync(from,{withFileTypes:true})){const source=path.join(from,item.name),target=path.join(to,item.name);if(item.isDirectory()){fs.mkdirSync(target,{recursive:true});copyTree(source,target)}else if(item.isFile())fs.copyFileSync(source,target);else throw Error('No se publican enlaces: '+source)}}
copyTree(dist,worktree);
git(['add','-A'],worktree);
const changes=git(['status','--porcelain'],worktree,{capture:true});
if(changes)git(['commit','-m','Publicar Centro UC3M'],worktree);
else console.log('La rama gh-pages ya contiene esta compilación.');
if(push)git(['push','-u','origin',branch],worktree);
else console.log('Publicación preparada en gh-pages. Ejecuta: git -C .pages-worktree push -u origin gh-pages');

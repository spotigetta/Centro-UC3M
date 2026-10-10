'use strict';
const assert=require('node:assert/strict');
const {buildUC3MWeekPlan,formatUC3MWeekPlan}=require('../src/shared/week-plan.js');
const state={subjects:[{id:'course',name:'Curso'}],groups:{},dataset:{events:[
  {id:'theory',subject:'course',date:'2026-10-12',kind:'Teoría',title:'Clase normal'},
  {id:'practice',subject:'course',date:'2026-10-13',kind:'Práctica',title:'Laboratorio',room:'A-12'},
  {id:'group',subject:'course',date:'2026-10-14',kind:'Prueba',title:'Prueba G1, G2',tentative:true},
  {id:'later',subject:'course',date:'2026-10-26',kind:'Examen',title:'Parcial'},
  {id:'outside',subject:'course',date:'2026-11-05',kind:'Examen',title:'Fuera de plazo'}
],courses:{}},cards:[{id:'task',title:'Entregar trabajo',checked:false,meta:{area:'Curso',due:'2026-10-15'}}],projects:[{id:'project',name:'Proyecto abierto',status:'En curso'}]};
const plan=buildUC3MWeekPlan(state,new Date('2026-10-11T18:00:00+02:00'));
assert.equal(plan.weekStart,'2026-10-12');assert.equal(plan.weekEnd,'2026-10-18');assert.equal(plan.horizon,'2026-11-01');
assert.deepEqual(plan.thisWeek.map(x=>x.id),['practice']);assert.deepEqual(plan.nextWeeks.map(x=>x.id),['later']);assert.deepEqual(plan.needsReview.map(x=>x.id),['group']);
assert.equal(plan.tasks.length,1);assert.equal(plan.projects.length,1);
const text=formatUC3MWeekPlan(plan);assert.match(text,/POR CONFIRMAR/);assert.doesNotMatch(text,/Clase normal|Fuera de plazo/);
console.log('Plan semanal: domingo, horizonte, teoría y grupos verificados.');

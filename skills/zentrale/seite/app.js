/* Daten: daten/projekte.json (Liste), daten/<id>.json (schreibt nur Claude), eingaben/<id>.json (schreibt nur diese Seite: Urteile, Reihenfolge, Ideen). */
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ls=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(k)||"null");localStorage.setItem(k,JSON.stringify(v))}catch{return null}};
const ss=(k,v)=>{try{if(v===undefined)return JSON.parse(sessionStorage.getItem(k)||"null");if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,JSON.stringify(v))}catch{return null}};
const mem=ls("pz-ui")||{};
const ui={p:mem.p,v:mem.v||"jetzt",open:new Set(),abf:"offen",msOpen:new Set()};
const saveUi=()=>ls("pz-ui",{p:ui.p,v:ui.v});
let PROJ=[];const C={};   // C[id]={d,e,sha}
const KIND={"Idee":["think","Idee"],"Spec läuft":["run","Brainstorm"],"Spec fertig":["build","bereit"],"Gebaut":["idle","gebaut"]};
const CH={up:'<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 8l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',dn:'<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',grip:'<svg viewBox="0 0 14 18" aria-hidden="true"><g fill="currentColor"><circle cx="4" cy="4" r="1.4"/><circle cx="10" cy="4" r="1.4"/><circle cx="4" cy="9" r="1.4"/><circle cx="10" cy="9" r="1.4"/><circle cx="4" cy="14" r="1.4"/><circle cx="10" cy="14" r="1.4"/></g></svg>'};
const ABHOLEN="Hole die Urteile und Ideen aus der Projektzentrale ab und arbeite sie ab.";

async function sha256(t){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
async function load(id){
  if(C[id])return C[id];
  const d=await fetch(`daten/${id}.json`).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()});
  let txt=null;try{const r=await fetch(`eingaben/${id}.json`);if(r.ok)txt=await r.text()}catch{}
  let e={};try{e=txt?JSON.parse(txt):{}}catch{}
  const c=C[id]={d,e,sha:txt?await sha256(txt):null};
  const pend=ss("pz-pend-"+id);if(pend){c.e=pend;queueSave(id)}
  c.e.urteile=c.e.urteile||{};c.e.reihenfolge=c.e.reihenfolge||{};c.e.ideen=c.e.ideen||[];
  return c;
}
// Speichern: nur die Eingaben-Datei dieses Projekts, gebündelt nach einer kurzen Pause
let saveT=null,readOnly=false;
function status(t,err){const s=$("save");s.textContent=t;s.classList.toggle("err",!!err)}
function queueSave(id){if(readOnly)return;ss("pz-pend-"+id,C[id].e);status("Ungespeichert …");clearTimeout(saveT);saveT=setTimeout(()=>doSave(id,0),1200)}
async function doSave(id,tries){
  const a=await window.claude?.use?.("artifact");
  if(!a){status("Speichern hier nicht möglich",true);return}
  const path=`eingaben/${id}.json`,c=C[id];
  c.e.geaendert=new Date().toISOString();
  status("Speichert …");
  try{const r=await a.publish({[path]:{content:JSON.stringify(c.e,null,1),contentType:"application/json",ifMatch:c.sha}});
    if(r.shas&&r.shas[path])c.sha=r.shas[path];ss("pz-pend-"+id,null);status("Gespeichert")}
  catch(err){const code=err&&err.code;
    if(code==="conflict"&&tries<2){const p=(err.paths||[]).find(x=>x.path===path);if(p){c.sha=p.actual??null;return doSave(id,tries+1)}status("Neuer Stand wird geladen …");return}
    if(code==="not_writer"||code==="not_granted"||code==="capability_disabled"){readOnly=true;ss("pz-pend-"+id,null);status("Nur lesen",true);return}
    status("Speichern fehlgeschlagen, wird beim nächsten Klick erneut versucht",true)}
}

// --- abgeleitete Zustände ---
// Zurückgeholt: e.zurueck[nr]=zeit; bis Claude es abholt, steht ein Prüfpunkt unter „Zurückgeholt“
const zPending=(c,nr)=>{const z=c.e.zurueck&&c.e.zurueck[nr];if(!z)return false;const ab=c.d.abgeholt&&c.d.abgeholt["z:"+nr];return !(ab&&ab>=z)};
function AB(c=cur()){const extra=Object.keys(c.e.zurueck||{}).filter(nr=>zPending(c,nr)).map(nr=>{const x=c.d.vorhaben.find(v=>v.nr===nr)||{t:"Nr. "+nr};return {id:"z-"+nr,gruppe:"Zurückgeholt",t:x.t,aus:nr,stufe:"ansehen",zurueck:nr}});return extra.concat(c.d.abnahme)}
const cur=()=>C[ui.p];
const P=()=>PROJ.find(p=>p.id===ui.p);
function urteilOf(a,c=cur()){const u=c.e.urteile[a.id];if(!u)return null;const ab=c.d.abgeholt&&c.d.abgeholt[a.id];return ab&&ab>=u.zeit?null:u}
function abState(a,c=cur()){if(a.selbst)return "selbst";const u=urteilOf(a,c);if(u)return u.v;return a.stufe==="beheben"?"claude":"offen"}
const abDone=id=>{const a=AB().find(x=>x.id===id);return !a||abState(a)==="ok"};
const vDone=nr=>{const x=cur().d.vorhaben.find(v=>v.nr===nr);return !x||x.s==="Gebaut"};
const blockersV=x=>(x.wartet||[]).filter(n=>!vDone(n));
const blockersA=a=>(a.wartet||[]).filter(id=>!abDone(id));
const openAbOf=nr=>AB().filter(a=>a.aus===nr&&!a.selbst&&abState(a)!=="ok");
const archived=x=>x.s==="Gebaut"&&!openAbOf(x.nr).length;
const pendingCount=()=>{const c=cur();return Object.keys(c.e.urteile).filter(id=>{const a=AB(c).find(x=>x.id===id);return a&&urteilOf(a)}).length+ideas().length};
function ideas(){const c=cur();return c.e.ideen.filter(i=>!(c.d.ideen_abgeholt||[]).includes(i.id))}
function vorhaben(){const c=cur();const first=(c.d.meilensteine[0]||{}).id||"—";
  return c.d.vorhaben.concat(ideas().map(i=>({nr:i.id,m:first,t:i.text,s:"Idee",mine:true,info:"Von dir eingetragen. Claude gibt beim nächsten Abholen Nummer, Bereich und Meilenstein.",cmd:"/brainstorm "+i.text.slice(0,70)})))}
function ordered(kind,list){const o=cur().e.reihenfolge[kind]||[];const k=kind==="ab"?"id":"nr";
  return list.map((x,i)=>[x,o.indexOf(x[k]),i]).sort((a,b)=>(a[1]<0?1e6+a[2]:a[1])-(b[1]<0?1e6+b[2]:b[1])).map(z=>z[0])}
const msIdx=m=>{const i=cur().d.meilensteine.findIndex(x=>x.id===m);return i<0?99:i};
const waitsYou=id=>{const c=C[id];return c?AB(c).filter(a=>abState(a,c)==="offen").length:0};

// --- Darstellung ---
function renderTop(){
  const p=P(),c=cur();
  document.documentElement.style.setProperty("--accent",p.farbe);
  $("stamp").textContent=(c.d.beispiel?"Beispieldaten · ":"")+"Stand "+new Date(c.d.stand).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
  $("projects").innerHTML=PROJ.map(x=>{const n=waitsYou(x.id);return `<button class="proj" style="--pc:${esc(x.farbe)}" data-p="${x.id}" aria-pressed="${ui.p===x.id}"><i></i>${esc(x.name)}${n?`<span class="n" title="wartet auf dich">${n}</span>`:""}</button>`}).join("");
  const run=c.d.vorhaben.filter(x=>x.aktiv);
  $("running").hidden=!run.length;
  $("running").innerHTML=run.map(x=>`<button class="run" type="button" data-jump="${esc(x.nr)}"><i></i>${esc(x.kurz||x.t)}<small>${esc(x.aktiv.art)} · ${esc(x.aktiv.seit)}</small></button>`).join("");
  const V=[["jetzt","Jetzt"],["abnahme","Abnahme",waitsYou(ui.p)],["meilensteine","Meilensteine"],["alles","Alles"]];
  $("views").innerHTML=V.map(([k,n,cnt])=>`<button class="view" role="tab" data-v="${k}" aria-selected="${ui.v===k}">${n}${cnt?`<small>${cnt}</small>`:""}</button>`).join("");
  $("fab").hidden=false;
}
const cmdBox=c=>c?`<div class="cmd"><code>${esc(c)}</code><button type="button" data-copy="${esc(c)}">Kopieren</button></div>`:"";
const waitLinks=(ids,kind)=>ids.length?`<div class="waits">wartet auf ${ids.map(i=>{const c=cur();const t=kind==="ab"?(AB(c).find(a=>a.id===i)||{}).t:"Nr. "+i;return `<button type="button" data-${kind==="ab"?"goab":"jump"}="${esc(i)}">${esc(t||i)}</button>`}).join(", ")}</div>`:"";
function itemHtml(x,canMove){
  const k=KIND[x.s]||["idle",""],bl=blockersV(x),b=cur().d.bereiche[x.b];
  return `<div class="item${x.aktiv?" active":""}${bl.length?" blocked":""}${ui.open.has(x.nr)?" open":""}" data-id="${esc(x.nr)}" data-list="v">
    ${canMove?`<span class="grip" aria-label="Ziehen zum Sortieren">${CH.grip}</span>`:"<span></span>"}
    <div class="body" data-open="${esc(x.nr)}">
      <span class="tt">${esc(x.t)}</span>
      <div class="meta">${x.aktiv?`<span class="tag k-run">${esc(x.aktiv.art)} läuft · seit ${esc(x.aktiv.seit)}</span>`:`<span class="tag k-${k[0]}">${k[1]}</span>`}${x.groesse?`<span class="tag">${esc(x.groesse)}</span>`:""}${x.mine?`<span class="mine">neu von dir</span>`:`<span>Nr. ${esc(x.nr)}${b?" · "+esc(b):""}</span>`}</div>
      <div class="det">${x.info?`<p>${esc(x.info)}</p>`:""}${bl.length?"":cmdBox(x.cmd)}</div>
    </div>
    ${canMove?`<div class="move"><button type="button" data-mv="v|${esc(x.nr)}|-1" aria-label="Nach oben">${CH.up}</button><button type="button" data-mv="v|${esc(x.nr)}|1" aria-label="Nach unten">${CH.dn}</button></div>`:"<span></span>"}
    ${bl.length?`<span></span><div style="padding:0 8px 10px 6px">${waitLinks(bl,"v")}</div><span></span>`:""}
  </div>`;
}
function grouped(list,name,canMove){
  const c=cur();const ms=[...new Set(list.map(x=>x.m))].sort((a,b)=>msIdx(a)-msIdx(b));
  return ms.map(m=>{const mm=c.d.meilensteine.find(x=>x.id===m);const g=ordered("v",list.filter(x=>x.m===m));const free=g.filter(x=>!blockersV(x).length),bl=g.filter(x=>blockersV(x).length);
    return `<div class="gh">${esc(mm?mm.id+" · "+mm.name:"ohne Meilenstein")}</div><div class="list">${free.concat(bl).map(x=>itemHtml(x,canMove)).join("")}</div>`}).join("");
}
function block(name,title,dot,list,hint){
  return `<section><div class="sh"><span class="dot d-${dot}"></span><h2>${title}</h2><span class="c">${list.filter(x=>!blockersV(x).length).length}</span>${hint?`<span class="hint">${hint}</span>`:""}</div>${list.length?grouped(list,name,true):`<div class="empty">Nichts offen.</div>`}</section>`;
}
function banner(){const n=pendingCount();if(!n)return "";return `<div class="banner"><b>${n} ${n===1?"Eingabe wartet":"Eingaben warten"} auf Claude</b><span>Jede Session in diesem Projekt holt sie beim Start ab. Sofort geht es mit diesem Aufruf:</span>${cmdBox(ABHOLEN)}</div>`}
function renderJetzt(){
  const c=cur(),vs=vorhaben();
  const v=c.d.vorschlag,va=v&&AB(c).find(a=>a.id===v.ab);
  const next=va&&abState(va)==="offen"?`<div class="next"><span class="lbl">Als Nächstes</span><span class="t">${esc(va.t)}</span><span class="why">${esc(v.warum)}</span><button class="btn" type="button" data-goab="${esc(va.id)}">Zur Abnahme</button></div>`:"";
  const ab=ordered("ab",AB(c).filter(a=>abState(a)==="offen"));
  const you=`<section><div class="sh"><span class="dot d-you"></span><h2>Wartet auf dich</h2><span class="c">${ab.length}</span></div><div class="list">${ab.length?ab.map(a=>{const bl=blockersA(a);return `<div class="item${bl.length?" blocked":""}"><span></span><div class="body" data-goab="${esc(a.id)}"><span class="tt">${esc(a.t)}</span><div class="meta"><span class="tag k-you">${a.stufe==="nachpruefen"?"nachprüfen":"ansehen"}</span><span>${esc(a.gruppe)}</span></div>${waitLinks(bl,"ab")}</div><span></span></div>`}).join(""):`<div class="empty">Gerade nichts für dich.</div>`}</div></section>`;
  const done=c.d.vorhaben.filter(archived).filter(x=>x.fertig).sort((a,b)=>b.fertig.localeCompare(a.fertig)).slice(0,6);
  const recent=done.length?`<section><div class="sh"><span class="dot d-idle"></span><h2>Zuletzt fertig</h2></div><div class="recent">${done.map(x=>`<button type="button" data-jump="${esc(x.nr)}">${esc(x.kurz||x.t)}<small>${new Date(x.fertig).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})}</small></button>`).join("")}</div></section>`:"";
  $("main").innerHTML=banner()+next+`<div class="cols"><div class="stack">${you}${recent}</div>
  <div class="stack">${block("bauen","Claude kann bauen","build",vs.filter(x=>x.s==="Spec fertig"),"ziehen oder Pfeile")}${block("denken","Zum Brainstormen","think",vs.filter(x=>x.s==="Idee"||x.s==="Spec läuft"),"ziehen oder Pfeile")}</div></div>`;
}
const AF=[["offen","Offen"],["talk","Besprechen"],["fix","Ändern"],["ok","Passt"],["claude","Bei Claude"]];
function abCard(a){
  const c=cur(),u=c.e.urteile[a.id]&&urteilOf(a)?c.e.urteile[a.id]:{},st=abState(a),bl=blockersA(a);
  const stage=a.stufe==="nachpruefen"?3:a.stufe==="beheben"?2:1;
  const pips=`<div class="pips">${[1,2,3].map(i=>`<b class="${i<stage?"on":i===stage?"now":""}"></b>`).join("")}<span>${["Ansehen","Claude behebt","Nachprüfen"][stage-1]} · aus Nr. ${esc(a.aus)}</span></div>`;
  const vt={ok:"passt",talk:"besprechen",fix:"ändern"}[u.v];
  const prompt=u.v&&u.v!=="ok"?(u.v==="fix"?`Nacharbeit aus der Abnahme „${a.t}“: `:`Lass uns über die Abnahme „${a.t}“ sprechen: `)+(u.note||"…"):"";
  return `<div class="ab${ui.open.has(a.id)?" open":""}${bl.length?" blocked":""}" id="ab-${esc(a.id)}" data-id="${esc(a.id)}" data-list="ab"><span class="grip" aria-label="Ziehen zum Sortieren">${CH.grip}</span><div class="in">
    <div class="abhead" data-open="${esc(a.id)}"><span class="tt">${esc(a.t)}</span>${pips}${vt?`<div class="meta"><span class="tag k-${u.v==="ok"?"build":u.v==="talk"?"run":"think"}">${vt}</span>${u.note?`<span>${esc(u.note.slice(0,70))}</span>`:""}</div>`:""}</div>
    ${waitLinks(bl,"ab")}
    <div class="abbody">
    ${a.zurueck?`<div class="fixed"><b>Von dir zurückgeholt.</b> Claude legt beim Abholen die Prüfschritte an. <button class="btn" type="button" data-unback="${esc(a.zurueck)}" style="margin-top:6px">Doch nicht, wieder ins Archiv</button></div>`:""}
    ${a.behoben?`<div class="fixed"><b>${stage===2?"In Arbeit":"Behoben"}:</b> ${esc(a.behoben)}</div>`:""}
    ${a.schritte?`<div class="steps">${a.schritte.map((s,i)=>`<span class="n">${i+1}</span><div>${esc(s[0])}<div class="e">${esc(s[1])}</div></div>`).join("")}</div>`:""}
    ${st==="ok"?`<button type="button" class="btn" data-vab="${esc(a.id)}|ok">Zurück auf „Offen“</button>`:st==="claude"||bl.length?"":`<div class="verdict"><button type="button" class="v-ok" data-vab="${esc(a.id)}|ok" aria-pressed="${u.v==="ok"}">Passt</button><button type="button" class="v-talk" data-vab="${esc(a.id)}|talk" aria-pressed="${u.v==="talk"}">Besprechen</button><button type="button" class="v-fix" data-vab="${esc(a.id)}|fix" aria-pressed="${u.v==="fix"}">Ändern</button></div>`}
    ${u.v&&u.v!=="ok"?`<textarea id="note-${esc(a.id)}" data-note="${esc(a.id)}" placeholder="${u.v==="fix"?"Was soll anders werden?":"Worüber willst du sprechen?"}">${esc(u.note||"")}</textarea>${cmdBox(prompt)}<span class="saved">Claude holt das beim nächsten Start im Projekt selbst ab. Mit dem Aufruf startest du sofort.</span>`:""}
  </div></div></div>`;
}
function renderAbnahme(){
  const c=cur(),mine=AB(c).filter(a=>!a.selbst),self=AB(c).filter(a=>a.selbst);
  const list=ordered("ab",mine.filter(a=>abState(a)===ui.abf));
  const groups=[...new Set(list.map(a=>a.gruppe))];
  $("main").innerHTML=banner()+`<div class="abfilter">${AF.map(([k,n])=>{const cnt=mine.filter(a=>abState(a)===k).length;return k==="claude"&&!cnt?"":`<button class="chip" type="button" data-abf="${k}" aria-pressed="${ui.abf===k}">${n} ${cnt}</button>`}).join("")}</div>
  ${list.length?groups.map(g=>{const gl=list.filter(a=>a.gruppe===g);const free=gl.filter(a=>!blockersA(a).length),bl=gl.filter(a=>blockersA(a).length);return `<div class="gh">${esc(g)}</div><div class="list" style="gap:10px">${free.concat(bl).map(abCard).join("")}</div>`}).join(""):`<div class="empty">Keine Punkte in dieser Auswahl.</div>`}
  ${self.length?`<details class="self"><summary>Prüft Claude selbst (${self.length})</summary><ul>${self.map(a=>`<li>${esc(a.t)}: ${esc(a.selbst)}</li>`).join("")}</ul></details>`:""}`;
}
const arcRow=x=>`<div class="row" data-id="${esc(x.nr)}"><span class="nr">${esc(x.nr)}</span><span>${esc(x.t)}${x.fertig?` <small style="color:var(--muted)">${new Date(x.fertig).toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})}</small>`:""}</span><button class="btn" type="button" data-back="${esc(x.nr)}" style="padding:3px 9px;font-size:12.5px">Zurückholen</button></div>`;
function rowHtml(x){const k=KIND[x.s]||["idle",""];const oa=openAbOf(x.nr).length;return `<button type="button" class="row" data-jump="${esc(x.nr)}"><span class="nr">${esc(x.mine?"neu":x.nr)}</span><span>${esc(x.t)}</span><span class="tag ${x.aktiv?"k-run":oa?"k-you":blockersV(x).length?"":"k-"+k[0]}">${x.aktiv?"läuft":oa?"Abnahme":blockersV(x).length?"wartet":k[1]}</span></button>`}
function renderMs(){
  const c=cur(),vs=vorhaben();
  $("main").innerHTML=`<div class="legend"><span><i class="dot d-idle"></i>gebaut</span><span><i class="dot d-build"></i>bereit</span><span><i class="dot d-run"></i>Brainstorm</span><span><i class="dot d-think"></i>Idee</span></div><div class="list" style="gap:8px">${
  c.d.meilensteine.map(m=>{const g=vs.filter(x=>x.m===m.id);const cnt=s=>g.filter(x=>x.s===s).length;const n=g.length||1;
  return `<div class="ms${ui.msOpen.has(m.id)?" open":""}"><button type="button" data-ms="${esc(m.id)}"><span class="mt">${esc(m.id)} · ${esc(m.name)}</span><span class="mp">${cnt("Gebaut")} von ${g.length} gebaut</span>
    <span class="bar"><i style="width:${cnt("Gebaut")/n*100}%;background:var(--idle)"></i><i style="width:${cnt("Spec fertig")/n*100}%;background:var(--build)"></i><i style="width:${cnt("Spec läuft")/n*100}%;background:var(--run)"></i><i style="width:${cnt("Idee")/n*100}%;background:var(--think)"></i></span></button>
    <div class="rows">${ordered("v",g.filter(x=>!archived(x))).map(rowHtml).join("")}${g.filter(archived).length?`<details class="archive" style="margin-top:6px"><summary>${g.filter(archived).length} fertig</summary>${g.filter(archived).map(arcRow).join("")}</details>`:""}</div></div>`}).join("")}</div>`;
}
function renderAlles(){
  const c=cur(),g={};vorhaben().forEach(x=>{const b=c.d.bereiche[x.b]||"ohne Bereich";(g[b]=g[b]||[]).push(x)});
  const th=(c.d.themen||[]).length?`<section><div class="sh"><span class="dot d-idle"></span><h2>Offene Themen</h2><span class="c">${c.d.themen.length}</span></div><div class="list">${c.d.themen.map(t=>`<div class="empty" style="border-style:solid;color:var(--fg)">${esc(t)}</div>`).join("")}</div></section>`:"";
  $("main").innerHTML=th+Object.entries(g).map(([b,l])=>{const open=l.filter(x=>!archived(x)),arc=l.filter(archived);return `<section><div class="sh"><h2>${esc(b)}</h2><span class="c">${open.length}</span></div><div class="list">${open.map(x=>itemHtml(x,false)).join("")}${arc.length?`<details class="archive"${arc.some(x=>ui.open.has(x.nr))?" open":""}><summary>${arc.length} fertig</summary>${arc.map(arcRow).join("")}</details>`:""}</div></section>`}).join("");
}
function render(){if(!cur())return;renderTop();({jetzt:renderJetzt,abnahme:renderAbnahme,meilensteine:renderMs,alles:renderAlles})[ui.v]()}

// --- Reihenfolge ---
function setOrder(kind,groupIds){const c=cur();const all=kind==="ab"?ordered("ab",AB(c)).map(a=>a.id):ordered("v",vorhaben()).map(x=>x.nr);
  const pos=groupIds.map(id=>all.indexOf(id)).sort((a,b)=>a-b);pos.forEach((p,i)=>all[p]=groupIds[i]);c.e.reihenfolge[kind]=all;queueSave(ui.p);render();toast("Reihenfolge geändert")}
function step(kind,id,dir){const el=document.querySelector(`[data-id="${CSS.escape(id)}"][data-list="${kind}"]`);const sib=dir<0?el.previousElementSibling:el.nextElementSibling;if(!sib||!sib.dataset.id)return;
  const ids=[...el.parentElement.children].map(x=>x.dataset.id).filter(Boolean);const i=ids.indexOf(id),j=ids.indexOf(sib.dataset.id);[ids[i],ids[j]]=[ids[j],ids[i]];setOrder(kind,ids)}
let drag=null,scrollT=null;
document.addEventListener("pointerdown",e=>{const g=e.target.closest(".grip");if(!g)return;const el=g.parentElement;e.preventDefault();
  const r=el.getBoundingClientRect();const ph=document.createElement("div");ph.className="ph";ph.style.height=r.height+"px";el.parentElement.insertBefore(ph,el);
  Object.assign(el.style,{left:r.left+"px",top:r.top+"px",width:r.width+"px"});el.classList.add("drag");document.body.classList.add("dragging");
  drag={el,ph,kind:el.dataset.list,box:el.parentElement,dy:e.clientY-r.top,y:e.clientY}});
function dragAt(y){const {el,ph,box,dy}=drag;el.style.top=(y-dy)+"px";
  for(const s of [...box.children].filter(c=>c!==el&&c!==ph&&c.dataset.id)){const r=s.getBoundingClientRect();if(y>r.top&&y<r.bottom){box.insertBefore(ph,y<r.top+r.height/2?s:s.nextSibling);break}}}
document.addEventListener("pointermove",e=>{if(!drag)return;drag.y=e.clientY;dragAt(e.clientY);clearInterval(scrollT);
  if(e.clientY<90||e.clientY>innerHeight-90){const v=e.clientY<90?-8:8;scrollT=setInterval(()=>{scrollBy(0,v);dragAt(drag.y)},16)}});
function drop(){if(!drag)return;clearInterval(scrollT);const {el,ph,kind,box}=drag;drag=null;box.insertBefore(el,ph);ph.remove();el.classList.remove("drag");el.removeAttribute("style");document.body.classList.remove("dragging");
  setOrder(kind,[...box.children].map(c=>c.dataset.id).filter(Boolean))}
document.addEventListener("pointerup",drop);document.addEventListener("pointercancel",drop);

// --- Springen ---
function land(el){if(!el)return;el.scrollIntoView({block:"center"});el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash")}
function goAb(id){const a=AB().find(x=>x.id===id);if(!a)return;ui.v="abnahme";ui.abf=abState(a)==="selbst"?"offen":abState(a);ui.open.add(id);saveUi();render();land(document.getElementById("ab-"+id))}
function jumpTo(nr){const x=vorhaben().find(v=>v.nr===nr);if(!x)return;const oa=openAbOf(nr)[0];if(oa)return goAb(oa.id);
  ui.v=x.s==="Gebaut"?"alles":"jetzt";ui.open.add(nr);saveUi();render();land(document.querySelector(`[data-id="${CSS.escape(nr)}"]`))}

function toast(t){const e=$("toast");e.textContent=t;e.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>e.hidden=true,1600)}
async function selectProject(id){ui.p=id;ui.abf="offen";saveUi();if(!C[id]){$("main").innerHTML='<div class="loading">Lädt …</div>';try{await load(id)}catch{$("main").innerHTML='<div class="empty">Die Daten dieses Projekts sind gerade nicht erreichbar.</div>';return}}render()}
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-back],[data-unback],[data-p],[data-v],[data-jump],[data-goab],[data-open],[data-copy],[data-mv],[data-vab],[data-abf],[data-ms]");if(!t||!cur())return;const d=t.dataset;
  if(d.back){const c=cur();c.e.zurueck=c.e.zurueck||{};c.e.zurueck[d.back]=new Date().toISOString();queueSave(ui.p);goAb("z-"+d.back);toast("Zurückgeholt")}
  else if(d.unback){const c=cur();delete c.e.zurueck[d.unback];delete c.e.urteile["z-"+d.unback];queueSave(ui.p);render();toast("Wieder im Archiv")}
  else if(d.p)selectProject(d.p);
  else if(d.v){ui.v=d.v;saveUi();render();scrollTo(0,0)}
  else if(d.copy){const ok=()=>{t.textContent="Kopiert";setTimeout(()=>t.textContent="Kopieren",1500)};try{navigator.clipboard.writeText(d.copy).then(ok,()=>{const r=document.createRange();r.selectNodeContents(t.previousElementSibling);getSelection().removeAllRanges();getSelection().addRange(r);t.textContent="Markiert"})}catch{}}
  else if(d.mv){const[k,id,dir]=d.mv.split("|");step(k,id,+dir)}
  else if(d.jump)jumpTo(d.jump);
  else if(d.goab)goAb(d.goab);
  else if(d.vab){const[id,v]=d.vab.split("|");const c=cur(),u=urteilOf(AB(c).find(a=>a.id===id))&&c.e.urteile[id];
    if(u&&u.v===v)delete c.e.urteile[id];else c.e.urteile[id]={v,note:u?u.note||"":"",zeit:new Date().toISOString()};
    queueSave(ui.p);
    if(v==="ok"&&c.e.urteile[id]){// Durchlauf: nächste offene Karte öffnen
      const ids=[...document.querySelectorAll(".ab[data-id]")].map(x=>x.dataset.id);const i=ids.indexOf(id);ui.open.delete(id);
      const nx=ids.slice(i+1).concat(ids.slice(0,i)).find(x=>{const a=AB(c).find(y=>y.id===x);return abState(a)==="offen"&&!blockersA(a).length});
      if(nx)ui.open.add(nx);render();toast("Abgenommen");if(nx)land(document.getElementById("ab-"+nx))}
    else{ui.open.add(id);render();toast(c.e.urteile[id]?"Gemerkt":"Wieder offen")}}
  else if(d.abf){ui.abf=d.abf;render()}
  else if(d.ms){ui.msOpen.has(d.ms)?ui.msOpen.delete(d.ms):ui.msOpen.add(d.ms);render()}
  else if(d.open){ui.open.has(d.open)?ui.open.delete(d.open):ui.open.add(d.open);render()}
});
document.addEventListener("input",e=>{const id=e.target.dataset.note;const c=cur();if(!id||!c.e.urteile[id])return;c.e.urteile[id].note=e.target.value;c.e.urteile[id].zeit=new Date().toISOString();queueSave(ui.p)});
$("fab").onclick=()=>{$("sheetH").textContent="Neue Idee für "+P().name;$("sheet").hidden=false;$("ideaText").focus()};
$("ideaCancel").onclick=()=>{$("sheet").hidden=true};
$("ideaSave").onclick=()=>{const txt=$("ideaText").value.trim();if(!txt){$("ideaText").focus();return}
  const c=cur(),id="idee-"+Date.now();c.e.ideen.push({id,text:txt,zeit:new Date().toISOString()});
  const o=c.e.reihenfolge.v||ordered("v",vorhaben()).map(x=>x.nr);c.e.reihenfolge.v=[id,...o.filter(x=>x!==id)];
  queueSave(ui.p);$("ideaText").value="";$("sheet").hidden=true;ui.v="jetzt";saveUi();render();toast("Idee eingetragen")};

(async()=>{
  try{PROJ=await fetch("daten/projekte.json").then(r=>r.json())}catch{$("main").innerHTML='<div class="empty">Die Projektliste ist gerade nicht erreichbar.</div>';return}
  if(!PROJ.some(p=>p.id===ui.p))ui.p=PROJ[0].id;
  await Promise.all(PROJ.map(p=>load(p.id).catch(()=>null)));
  selectProject(ui.p);
})();

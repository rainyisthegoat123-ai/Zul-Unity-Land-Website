const F={
 projects:{label:"Projects",one:"project",f:[["year","Year","num"],["name","Title"],["desc","Description","area"],["link","Link (optional)"],["code","Code or text (optional)","code"]]},
 scripts:{label:"Scripts",one:"script",f:[["name","Title"],["desc","Description","area"],["link","Link (optional)"],["code","Code or text (optional)","code"]]},
 packages:{label:"Unity Packages",one:"package",f:[["name","Title"],["desc","Description","area"],["link","Download link (optional)"],["code","Code or text (optional)","code"]]}
};
let pw=sessionStorage.getItem("zpw")||"",D=null,sec="projects",ed=-1;
const $=s=>document.querySelector(s);
const title=it=>it.name||it.version||"(untitled)";
async function api(b){try{const r=await fetch("/api/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.assign({password:pw},b))});return await r.json();}catch(e){return{error:"Could not reach the server"};}}
async function load(){let d=null;try{const r=await fetch("/api/content",{cache:"no-store"});d=(await r.json()).data;}catch(e){}
 D=d||JSON.parse(JSON.stringify(SITE));for(const k in F){if(!Array.isArray(D[k]))D[k]=[];D[k].forEach(it=>{if(!it.link&&it.file)it.link=it.file;});}}
async function save(){const s=$("#status");s.textContent="Saving...";const r=await api({action:"save",data:D});s.textContent=r.ok?"Saved. It is live on the site.":(r.error||"Save failed");return !!r.ok;}
async function login(p){pw=p;const r=await api({action:"check"});
 if(r.ok){sessionStorage.setItem("zpw",pw);await load();$("#login").hidden=true;$("#panel").hidden=false;draw();}
 else{sessionStorage.removeItem("zpw");$("#msg").textContent=r.error||"Wrong password";}}
function draw(){
 const S=F[sec];
 $("#tabs").innerHTML=Object.keys(F).map(k=>`<button data-k="${k}" aria-pressed="${k===sec}">${F[k].label}</button>`).join("");
 $("#tabs").querySelectorAll("button").forEach(b=>b.onclick=()=>{sec=b.dataset.k;ed=-1;draw();});
 $("#list").innerHTML=D[sec].length?D[sec].map((it,i)=>`<div class="item row"><span><b>${esc(title(it))}</b> <span class="empty">${esc(it.year||it.date||"")}</span></span><span><button class="btn" data-e="${i}">Edit</button> <button class="btn" data-d="${i}">Delete</button></span></div>`).join(""):`<p class="empty">Nothing in ${S.label} yet.</p>`;
 $("#list").querySelectorAll("[data-e]").forEach(b=>b.onclick=()=>{ed=+b.dataset.e;draw();$("#ftitle").scrollIntoView();});
 $("#list").querySelectorAll("[data-d]").forEach(b=>b.onclick=async()=>{const i=+b.dataset.d;
  if(confirm('Delete "'+title(D[sec][i])+'"?')){D[sec].splice(i,1);ed=-1;await save();draw();}});
 const cur=ed>=0?D[sec][ed]:{year:2023,notes:[],date:new Date().toISOString().slice(0,10)};
 $("#ftitle").textContent=(ed>=0?"Edit ":"Add new ")+S.one;
 $("#form").innerHTML=S.f.map(([k,l,t])=>{
  const v=cur[k]==null?"":(t==="lines"?cur[k].join("\n"):cur[k]);
  const inp=(t==="area"||t==="lines"||t==="code")?`<textarea id="f_${k}" rows="${t==="code"?10:3}">${esc(v)}</textarea>`:`<input id="f_${k}" ${t==="num"?'type="number" min="2000" max="2100"':""} value="${esc(v)}">`;
  return `<label>${l}${inp}</label>`;}).join("")+`<button class="btn" id="saveit">${ed>=0?"Save changes":"Add"}</button>`+(ed>=0?` <button class="btn" id="cancel">Cancel</button>`:"");
 $("#saveit").onclick=async()=>{const o={};
  S.f.forEach(([k,l,t])=>{const v=$("#f_"+k).value;o[k]=t==="lines"?v.split("\n").map(x=>x.trim()).filter(Boolean):t==="num"?(Number(v)||2023):v.trim();});
  if(!(o.name||o.version)){$("#status").textContent="Please fill in the title.";return;}
  if(ed>=0)D[sec][ed]=o;else D[sec].unshift(o);ed=-1;await save();draw();};
 if(ed>=0)$("#cancel").onclick=()=>{ed=-1;draw();};
}
$("#go").onclick=()=>login($("#pw").value);
$("#pw").onkeydown=e=>{if(e.key==="Enter")login(e.target.value);};
if(pw)login(pw);

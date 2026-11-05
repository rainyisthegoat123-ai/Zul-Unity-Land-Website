const pages=[["index.html","Home"],["projects.html","Projects"],["scripts.html","Scripts"],["packages.html","Unity Packages"]];
const here=location.pathname.split("/").pop()||"index.html";
document.querySelector("header").innerHTML=
 `<a class="logo" href="index.html">Zul <span>Unity Land</span></a><nav>`+
 pages.map(([h,n])=>`<a href="${h}"${h===here?' aria-current="page"':""}>${n}</a>`).join("")+`</nav>`;
document.querySelector("footer").textContent="© "+new Date().getFullYear()+" Zul Unity Land";
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const safe=u=>/^\s*(javascript|data|vbscript):/i.test(u||"")?"#":esc(u||"#");
async function loadSite(){
 let S=SITE;
 try{const r=await fetch("/api/content",{cache:"no-store"});
  if(r.ok){const j=await r.json();if(j&&j.data)S=Object.assign({},SITE,j.data);}}catch(e){}
 return S;
}
const card=(it,label)=>{const l=it.link||it.file;
 return `<div class="item"><h3>${esc(it.name)}</h3>${it.desc?`<p>${esc(it.desc)}</p>`:""}${it.code?`<pre>${esc(it.code)}</pre><button class="btn" data-code>Copy</button> `:""}${l&&l!=="#"?`<a class="btn" href="${safe(l)}" target="_blank" rel="noopener">${label}</a>`:""}</div>`;};
function wireCopy(root){
 root.querySelectorAll("button[data-code]").forEach(b=>b.onclick=async()=>{
  try{await navigator.clipboard.writeText(b.parentElement.querySelector("pre").textContent);b.textContent="Copied";}catch(e){b.textContent="Copy failed";}
  setTimeout(()=>b.textContent="Copy",1500);});
}
const el=document.getElementById("content");
if(el)loadSite().then(S=>{
 const page=document.body.dataset.page;
 const none=`<p class="empty">Nothing here yet.</p>`;
 const grid=(list,label,one)=>list.length?`<div class="grid"${one?' style="grid-template-columns:1fr"':""}>`+list.map(i=>card(i,label)).join("")+`</div>`:none;
 if(page==="projects"){
  const all=S.projects||[];
  const years=[...new Set([2021,2022,2023,...all.map(p=>Number(p.year))])].filter(Boolean).sort().map(String);
  const show=y=>{
   el.querySelectorAll(".tabs button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.y===y));
   const list=all.filter(p=>String(p.year)===y);
   el.querySelector(".out").innerHTML=list.length?grid(list,"Open"):`<p class="empty">No projects for ${esc(y)} yet.</p>`;
   wireCopy(el);history.replaceState(null,"","#"+y);
  };
  el.innerHTML=`<div class="tabs">`+years.map(y=>`<button data-y="${y}">${y}</button>`).join("")+`</div><div class="out"></div>`;
  el.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>show(b.dataset.y));
  const h=location.hash.slice(1);show(years.includes(h)?h:years[years.length-1]);
 }
 if(page==="scripts"){el.innerHTML=grid(S.scripts||[],"Open link",true);wireCopy(el);}
 if(page==="packages"){el.innerHTML=grid(S.packages||[],"Download");wireCopy(el);}
});

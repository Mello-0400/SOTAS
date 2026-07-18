function stockText(v){ return Object.entries(v.sizes).map(([s,q])=>`${s} ×${q}`).join(" • "); }

function createGroupCard(group){
const def = group.variants[0];
const colors = group.variants.map((v,i)=>`
<button class="color-dot ${i===0?'active':''}" data-sku="${v.sku}" data-hex="${v.hex}" style="background:${v.hex}" title="${v.color}"></button>
`).join("");
const sizes = Object.keys(def.sizes).map((s,i)=>`<button class="size-pill ${i===0?'active':''}" data-size="${s}">${s}</button>`).join("");
return `
<div class="product-card" data-group="${group.groupId}" data-category="${group.category}" data-selected-sku="${def.sku}" data-bestseller="${group.bestseller}" data-new="${group.isNew}">
<div class="product-img-wrap"><span class="stock-dot limited"></span><img src="${def.image}" alt="${group.name}"></div>
<h3>${group.name}</h3>
<div class="price-row"><span class="price">R${group.price}</span></div>
<div class="color-row">${colors}<span class="variant-meta" data-role="meta">${def.color} • ${stockText(def)}</span></div>
<div class="sizes" data-role="sizes">${sizes}</div>
<button class="btn-add" onclick="handleAdd(this)">Add to Cart</button>
</div>`;
}

function attachGroupLogic(root){
root.querySelectorAll(".product-card").forEach(card=>{
const groupId = card.dataset.group;
const group = PRODUCT_GROUPS.find(g=>g.groupId===groupId);
// colour click
card.querySelectorAll(".color-dot").forEach(dot=>{
dot.addEventListener("click", ()=>{
const sku = dot.dataset.sku;
const variant = group.variants.find(v=>v.sku===sku);
card.dataset.selectedSku = sku;
card.querySelectorAll(".color-dot").forEach(d=>d.classList.remove("active")); dot.classList.add("active");
card.querySelector("img").src = variant.image;
card.querySelector('[data-role="meta"]').textContent = `${variant.color} • ${stockText(variant)}`;
// rebuild sizes
const sizesWrap = card.querySelector('[data-role="sizes"]');
sizesWrap.innerHTML = Object.keys(variant.sizes).map((s,i)=>`<button class="size-pill ${i===0?'active':''}" data-size="${s}">${s}<small style="opacity:.6;margin-left:2px">×${variant.sizes[s]}</small></button>`).join("");
attachSizePills(sizesWrap);
});
});
attachSizePills(card.querySelector('[data-role="sizes"]'));
});
}
function attachSizePills(wrap){ if(!wrap) return; wrap.querySelectorAll(".size-pill").forEach(p=>{ p.addEventListener("click",()=>{ wrap.querySelectorAll(".size-pill").forEach(x=>x.classList.remove("active")); p.classList.add("active"); }); }); }

function handleAdd(btn){
const card=btn.closest(".product-card");
const sku=card.dataset.selectedSku;
const sizeEl=card.querySelector(".size-pill.active");
const size=sizeEl?sizeEl.dataset.size:null;
addToCart(sku,size);
}

function renderGroups(list, containerId){
const el=document.getElementById(containerId); if(!el) return;
el.innerHTML=list.map(createGroupCard).join(""); attachGroupLogic(el);
}

function openModal(t,h){ const ex=document.querySelector(".sotas-modal"); if(ex) ex.remove(); const d=document.createElement("div"); d.className="sotas-modal"; d.innerHTML=`<div class="sotas-modal-backdrop"></div><div class="sotas-modal-card"><h3>${t}</h3><div>${h}</div><button class="btn-primary" style="margin-top:16px" onclick="this.closest('.sotas-modal').remove()">Close</button></div>`; d.querySelector(".sotas-modal-backdrop").onclick=()=>d.remove(); document.body.appendChild(d); }

function initShop(){
const grid=document.getElementById("shopGrid"); if(!grid) return;
const btns=document.querySelectorAll(".filter-btn");
const apply=(f)=>{
btns.forEach(b=>b.classList.toggle("active",b.dataset.filter===f));
let out=[...PRODUCT_GROUPS];
if(f!=="all"){ if(f==="tshirt") out=out.filter(g=>g.category==="tshirt"); else if(f==="hoodie") out=out.filter(g=>g.category==="hoodie"); else out=out.filter(g=>g.category===f); }
// footer shop filters
if(["new","best","sale","apparel","headwear"].includes(f)){
if(f==="new") out=PRODUCT_GROUPS.filter(g=>g.isNew); if(f==="best") out=PRODUCT_GROUPS.filter(g=>g.bestseller); if(f==="sale") out=PRODUCT_GROUPS; if(f==="apparel") out=PRODUCT_GROUPS.filter(g=>g.category!=="headwear"); if(f==="headwear") out=[];
}
renderGroups(out,"shopGrid");
};
btns.forEach(b=>b.addEventListener("click",()=>apply(b.dataset.filter)));
const params=new URLSearchParams(location.search).get("filter")||localStorage.getItem("sotas_filter")||"all"; apply(params); localStorage.removeItem("sotas_filter");
}

document.addEventListener("DOMContentLoaded",()=>{
if(document.getElementById("featuredGrid")) renderGroups(PRODUCT_GROUPS.filter(g=>g.bestseller).slice(0,4),"featuredGrid");
initShop();
// footer
document.querySelectorAll("[data-shop]").forEach(a=>a.addEventListener("click",e=>{ e.preventDefault(); const v=e.currentTarget.dataset.shop; if(location.pathname.includes("shop.html")){ localStorage.setItem("sotas_filter",v); location.search=`?filter=${v}`; } else location.href=`shop.html?filter=${v}`; }));
document.querySelectorAll("[data-company]").forEach(a=>a.addEventListener("click",e=>{ e.preventDefault(); const v=e.currentTarget.dataset.company; if(v==="story"){ const s=document.querySelector("#story"); if(s) s.scrollIntoView({behavior:"smooth"}); else location.href="index.html#story"; } else if(v==="journal") openModal("Journal","Lookbooks and drops coming soon."); else if(v==="stockists") openModal("Stockists","Online only. Nationwide delivery. WhatsApp +27 72 781 1936"); else if(v==="careers") openModal("Careers","Send portfolio via WhatsApp."); }));
document.querySelectorAll("[data-support]").forEach(a=>a.addEventListener("click",e=>{ e.preventDefault(); const v=e.currentTarget.dataset.support; if(v==="contact") openModal("Contact","WhatsApp: +27 72 781 1936<br>Email: hello@sotas.co.za"); else if(v==="shipping") openModal("Shipping & Returns","Standard R80 (2-5 days), Express R150 (1-2 days), Collection Free. 14 day returns if unworn."); else if(v==="size") openModal("Size Guide","S 92cm, M 98cm, L 104cm, XL 112cm, 2XL 120cm, 3XL 128cm, XXXL 136cm. Oversized fit."); else if(v==="faq") openModal("FAQs","<p><b>Stock shown?</b> Exact units from poster. When gone, it's gone.</p><p><b>Colour?</b> Click dot to see sizes left for that colour.</p>"); }));
});

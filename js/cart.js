const CART_KEY = "sotas_cart_v3";
let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

function saveCart(){ 
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
     renderCartCount(); renderCartItems(); 
    }
function getSubtotal(){ 
    return cart.reduce((s,i)=> s + i.price * i.qty, 0);
    }
function getShippingCost(){ 
    const m=document.getElementById("shipMethod")?.value||"standard";
    if(m==="standard")return 80; if(m==="express")return 150; return 0;
    }
function renderCartCount(){ 
    const c=cart.reduce((s,i)=>s+i.qty,0); 
    document.querySelectorAll("#cartCount").forEach(el=>el.textContent=c); 
    }

function addToCart(sku, size){
    const p = PRODUCTS.find(x=>x.id===sku);
    if(!p) return;
    if(!size){ showToast("Select a size"); return; }
    const maxQty = p.stockMap[size] || 99;
    const idx = cart.findIndex(i=> i.id===sku && i.size===size);
    if(idx>-1){
    if(cart[idx].qty >= maxQty){ showToast(`Only ${maxQty} left in ${p.color} ${size}`); return; }
    cart[idx].qty+=1;
    } else {
    cart.push({ id:p.id, name:p.name, price:p.price, image:p.image, size:size, color:p.color, hex:p.hex, qty:1 });
    }
    openCart(); saveCart(); showToast(`${p.name} ${p.color} (${size}) added`);
    }
function removeFromCart(i){ 
    cart.splice(i,1); saveCart(); 
    }
function updateQty(i,d){ 
    cart[i].qty+=d; if(cart[i].qty<=0) cart.splice(i,1); saveCart(); 
    }

function renderCartItems(){
    const wrap=document.getElementById("cartItems"); const totalEl=document.getElementById("cartTotal");
    if(!wrap||!totalEl) return;
    if(cart.length===0){ wrap.innerHTML=`<div class="cart-empty"><p>Your cart is empty.</p></div>`; totalEl.textContent="R0"; return; }
    wrap.innerHTML=cart.map((it,idx)=>`
    <div class="cart-item">
    <img src="${it.image}" alt="">
    <div>
    <h4>${it.name}</h4>
    <p><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${it.hex};border:1px solid #ddd;vertical-align:middle;margin-right:4px"></span>${it.color} • ${it.size} • R${it.price}</p>
    <div class="qty"><button onclick="updateQty(${idx},-1)">-</button><span>${it.qty}</span><button onclick="updateQty(${idx},1)">+</button></div>
    <button class="remove" onclick="removeFromCart(${idx})">Remove</button>
    </div>
    <strong>R${it.price*it.qty}</strong>
    </div>`).join("");
    totalEl.textContent=`R${getSubtotal()+getShippingCost()}`;
    }

function openCart(){
document.getElementById("cartDrawer")?.classList.add("open");
document.getElementById("overlay")?.classList.add("show");
document.body.style.overflow = "hidden"; // stops background scroll
}
function closeCart(){
document.getElementById("cartDrawer")?.classList.remove("open");
document.getElementById("overlay")?.classList.remove("show");
document.body.style.overflow = ""; // restore
}

function showToast(m){ 
    let t=document.createElement("div"); 
    t.className="sotas-toast"; 
    t.textContent=m; 
    document.body.appendChild(t); 
    setTimeout(()=>t.remove(),2600); 
    }
function initCart(){
renderCartCount(); renderCartItems();
document.getElementById("cartBtn")?.addEventListener("click", openCart);
document.getElementById("closeCart")?.addEventListener("click", closeCart);
document.getElementById("overlay")?.addEventListener("click", closeCart);
document.getElementById("shipMethod")?.addEventListener("change", renderCartItems);
document.getElementById("checkoutForm")?.addEventListener("submit",(e)=>{
e.preventDefault(); if(!cart.length){showToast("Cart empty");return;}
const n=document.getElementById("custName").value, ph=document.getElementById("custPhone").value, em=document.getElementById("custEmail").value,
ad=document.getElementById("shipAddress").value, ci=document.getElementById("shipCity").value, pr=document.getElementById("shipProvince").value, pc=document.getElementById("shipCode").value, me=document.getElementById("shipMethod").value;
let msg=`SOTAS ORDER%0A%0A`; cart.forEach(i=>msg+=`• ${i.name} - ${i.color} (${i.size}) x${i.qty} - R${i.price*i.qty}%0A`);
msg+=`%0ASubtotal R${getSubtotal()}%0AShipping (${me}) R${getShippingCost()}%0ATotal R${getSubtotal()+getShippingCost()}%0A%0ACustomer: ${n}%0APhone: ${ph}%0AEmail: ${em}%0AAddress: ${ad}, ${ci}, ${pr}, ${pc}`;
window.open(`https://wa.me/27727811936?text=${msg}`,"_blank"); cart=[]; saveCart(); e.target.reset(); closeCart();
});
}
document.addEventListener("DOMContentLoaded", initCart);

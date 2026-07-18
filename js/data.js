// SOTAS - Exact remaining stock from poster
const PRODUCT_GROUPS = [
{
groupId:"sweater", name:"SOTAS Sweater", category:"sweater", price:550, bestseller:true, isNew:false,
variants:[
{ sku:"sweater-black", color:"BLACK", hex:"#111111", image:"https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80", sizes:{ "M":1,"L":1,"XL":3 } },
{ sku:"sweater-red", color:"RED", hex:"#C1272D", image:"https://via.placeholder.com/600/C1272D/FFFFFF?text=Sweater+RED", sizes:{ "XL":1 } },
{ sku:"sweater-white", color:"WHITE", hex:"#FFFFFF", image:"https://via.placeholder.com/600/FFFFFF/111111?text=Sweater+WHITE", sizes:{ "XL":1,"XXL":1 } }
]
},
{
groupId:"hoodie-normal", name:"SOTAS Hoodie (Normal)", category:"hoodie", price:550, bestseller:true, isNew:true,
variants:[
{ sku:"hoodie-black", color:"BLACK", hex:"#111111", image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80", sizes:{ "S":1,"L":1,"XL":1,"XXL":1 } },
{ sku:"hoodie-white", color:"WHITE", hex:"#FFFFFF", image:"https://via.placeholder.com/600/FFFFFF/111111?text=Hoodie+WHITE", sizes:{ "XL":1,"XXL":1 } },
{ sku:"hoodie-navy", color:"NAVY BLUE", hex:"#1E2A4A", image:"https://via.placeholder.com/600/1E2A4A/FFFFFF?text=Hoodie+NAVY", sizes:{ "L":1 } }
]
},
{
groupId:"hoodie-double", name:"Double Layer Hoodie", category:"hoodie", price:650, bestseller:true, isNew:true,
variants:[
{ sku:"double-red", color:"RED", hex:"#B91C1C", image:"images/hoodie-double-red.jpg", sizes:{ "M":2,"L":2,"XL":1,"XXL":2 } }
]
},
{
groupId:"jacket", name:"Pull Over Jacket (Vest)", category:"jacket", price:750, bestseller:false, isNew:false,
variants:[
{ sku:"jacket-black", color:"BLACK", hex:"#111111", image:"https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80", sizes:{ "S":1,"M":1,"L":1,"XL":1,"XXL":1 } },
{ sku:"jacket-navy", color:"NAVY BLUE", hex:"#1E2A4A", image:"https://via.placeholder.com/600/1E2A4A/FFFFFF?text=Vest+NAVY", sizes:{ "S":1,"M":1,"L":1,"XL":1,"XXL":1 } }
]
},
{
groupId:"track", name:"SOTAS Track Pants", category:"track", price:480, bestseller:true, isNew:false,
variants:[
{ sku:"track-red", color:"RED", hex:"#C1272D", image:"https://via.placeholder.com/600/C1272D/FFFFFF?text=Track+RED", sizes:{ "M":1,"L":1,"XL":1 } },
{ sku:"track-white", color:"WHITE", hex:"#FFFFFF", image:"https://via.placeholder.com/600/F5F1E9/111111?text=Track+WHITE", sizes:{ "M":1,"L":1,"XL":1 } }
]
},
{
groupId:"tshirt", name:"SOTAS T-Shirt", category:"tshirt", price:280, bestseller:false, isNew:true,
variants:[
{ sku:"tee-red", color:"RED", hex:"#C1272D", image:"https://via.placeholder.com/600/C1272D/FFFFFF?text=Tee+RED", sizes:{ "S":1,"M":1,"L":1,"XL":1,"XXL":1,"XXXL":2 } },
{ sku:"tee-navy", color:"NAVY BLUE", hex:"#1E2A4A", image:"https://via.placeholder.com/600/1E2A4A/FFFFFF?text=Tee+NAVY", sizes:{ "S":1,"M":1,"L":1,"XL":1,"XXL":1,"XXXL":1 } },
{ sku:"tee-yellow", color:"YELLOW", hex:"#EAB308", image:"https://via.placeholder.com/600/EAB308/111111?text=Tee+YELLOW", sizes:{ "S":1,"M":1,"L":1,"XL":1,"XXL":1,"XXXL":1 } },
{ sku:"tee-black", color:"BLACK", hex:"#111111", image:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", sizes:{ "S":1,"XXXL":1 } },
{ sku:"tee-cream", color:"CREAM WHITE", hex:"#E7DCC8", image:"https://via.placeholder.com/600/E7DCC8/111111?text=Tee+CREAM", sizes:{ "S":1,"L":1,"XL":1 } },
{ sku:"tee-white", color:"WHITE", hex:"#FFFFFF", image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", sizes:{ "S":2,"M":1,"L":1,"XL":1,"XXL":1,"XXXL":1 } },
{ sku:"tee-grey", color:"GREY", hex:"#9CA3AF", image:"https://via.placeholder.com/600/9CA3AF/111111?text=Tee+GREY", sizes:{ "L":1,"XL":1,"XXL":1 } }
]
}
];

// Flatten for cart lookup
const PRODUCTS = [];
PRODUCT_GROUPS.forEach(g=>{
g.variants.forEach(v=>{
PRODUCTS.push({
id: v.sku, groupId: g.groupId, name: g.name, category: g.category,
price: g.price, color: v.color, hex: v.hex, image: v.image,
sizes: Object.keys(v.sizes), stockMap: v.sizes,
bestseller: g.bestseller, isNew: g.isNew
});
});
});

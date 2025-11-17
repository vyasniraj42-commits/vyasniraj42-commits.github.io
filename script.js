// footer year
document.getElementById('year').textContent = new Date().getFullYear();

/*
  Data model: list of categories and products.
  You can add/remove categories or products here easily.
  image paths must follow: images/{category}/{file}.jpg
*/
const categories = [
  { key: 'accessories', name: 'Accessories', thumb: 'images/accessories/1.jpg' },
  { key: 'toys', name: 'Toys', thumb: 'images/toys/2.jpg' },
  { key: 'blanket', name: 'Blanket', thumb: 'images/blanket/3.jpg' },
  { key: 'towel', name: 'Towel', thumb: 'images/towel/4.jpg' },
  { key: 'sweater', name: 'Sweater', thumb: 'images/sweater/5.jpg' },
  { key: 'cap', name: 'Cap', thumb: 'images/cap/6.jpg' },
  { key: 'sleeping', name: 'Sleeping', thumb: 'images/sleeping/7.jpg' },
  { key: 'bag', name: 'Bag', thumb: 'images/bag/8.jpg' },
  { key: 'winterset', name: 'Winter Set', thumb: 'images/winterset/9.jpg' },
  { key: 'gift', name: 'Gift', thumb: 'images/gift/10.jpg' }
];

const products = [
  { category: 'accessories', img: 'images/accessories/1.jpg', name:'Baby Musical Rattle', price:'₹ 190', stockText:'In Stock (10 pcs)', status:'in-stock' },
  { category: 'toys', img: 'images/toys/2.jpg', name:'Baby Remote Shape Tether', price:'₹ 65', stockText:'In Stock (12 pcs)', status:'in-stock' },
  { category: 'blanket', img: 'images/blanket/3.jpg', name:'Baby Blanket', price:'₹ 549', stockText:'In Stock (5 pcs)', status:'in-stock' },
  { category: 'towel', img: 'images/towel/4.jpg', name:'Baby Towels 50x100', price:'₹ 299', stockText:'In Stock (8 pcs)', status:'in-stock' },
  { category: 'sweater', img: 'images/sweater/5.jpg', name:'Baby Winter Sweater', price:'₹ 499', stockText:'Out of Stock', status:'out-of-stock' },
  { category: 'cap', img: 'images/cap/6.jpg', name:'Baby Cap', price:'₹ 149', stockText:'In Stock (20 pcs)', status:'in-stock' },
  { category: 'sleeping', img: 'images/sleeping/7.jpg', name:'Baby Sleeping Bag', price:'₹ 799', stockText:'In Stock (3 pcs)', status:'in-stock' },
  { category: 'bag', img: 'images/bag/8.jpg', name:'Premium Mother Bag', price:'₹ 999', stockText:'Out of Stock', status:'out-of-stock' },
  { category: 'winterset', img: 'images/winterset/9.jpg', name:'Baby Winter Set', price:'₹ 899', stockText:'In Stock (4 pcs)', status:'in-stock' },
  { category: 'gift', img: 'images/gift/10.jpg', name:'Baby Gift Combo', price:'₹ 1,199', stockText:'In Stock (2 pcs)', status:'in-stock' }
];

// DOM refs
const folderList = document.getElementById('folderList');
const foldersGrid = document.getElementById('foldersGrid');
const productGrid = document.getElementById('productGrid');
const backBtn = document.getElementById('backBtn');
const pageTitle = document.getElementById('pageTitle');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

// Render folders in sidebar and grid
function renderFolders(){
  folderList.innerHTML = '';
  foldersGrid.innerHTML = '';
  categories.forEach(cat => {
    // count products in category
    const count = products.filter(p=>p.category===cat.key).length;
    // sidebar item
    const li = document.createElement('li');
    li.className = 'folder-item';
    li.dataset.cat = cat.key;
    li.innerHTML = `<div class="folder-icon">📁</div>
                    <div class="folder-meta"><div class="folder-name">${cat.name}</div><div class="folder-count">${count} items</div></div>`;
    li.addEventListener('click', ()=> openFolder(cat.key, cat.name));
    folderList.appendChild(li);

    // folder card in main grid
    const card = document.createElement('div');
    card.className = 'folder-card';
    card.innerHTML = `<div class="thumb"><img src="${cat.thumb}" style="width:100%;height:100%;object-fit:cover;border-radius:8px" alt="${cat.name}"></div>
                      <div class="title">${cat.name}</div>
                      <div class="count">${count} items</div>`;
    card.addEventListener('click', ()=> openFolder(cat.key, cat.name));
    foldersGrid.appendChild(card);
  });
}

// Show products for a category (or all)
function showProductsForCategory(catKey){
  productGrid.innerHTML = '';
  // determine active stock filter
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  let list = products.filter(p => (catKey === 'all' ? true : p.category === catKey));
  if(activeFilter !== 'all'){
    list = list.filter(p => p.status === activeFilter);
  }
  if(list.length === 0){
    productGrid.innerHTML = `<div style="padding:20px;color:#666">No items found in this folder / filter.</div>`;
    return;
  }
  list.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'product-card';
    div.dataset.status = p.status;
    div.dataset.category = p.category;
    div.innerHTML = `<img src="${p.img}" alt="${p.name}" class="product-img">
                     <div class="meta">
                       <h2 class="product-name">${p.name}</h2>
                       <p class="product-price">${p.price}</p>
                       <p class="product-stock ${p.status==='in-stock'?'in-stock':'out-of-stock'}">${p.stockText}</p>
                     </div>
                     <span class="badge">${p.category}</span>`;
    productGrid.appendChild(div);
  });
  attachImageClickHandlers(); // for lightbox
}

// Open folder UI
function openFolder(catKey, catName){
  foldersGrid.style.display = 'none';
  productGrid.style.display = 'grid';
  backBtn.style.display = 'inline-block';
  pageTitle.textContent = catName;
  showProductsForCategory(catKey);
}

// Back to folders
backBtn.addEventListener('click', ()=>{
  productGrid.style.display = 'none';
  foldersGrid.style.display = 'grid';
  backBtn.style.display = 'none';
  pageTitle.textContent = 'ફોલ્ડર્સ';
});

// Filter button handlers (stock)
filterButtons.forEach(btn => {
  btn.addEventListener('click', ()=>{
    filterButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    // if product view visible, refresh list for current folder title
    if(productGrid.style.display !== 'none'){
      const catName = pageTitle.textContent;
      // find category key by name (if not folder page, use 'all')
      const catObj = categories.find(c => c.name === catName);
      const catKey = catObj ? catObj.key : 'all';
      showProductsForCategory(catKey);
    }
  });
});

// INITIAL render
renderFolders();
foldersGrid.style.display = 'grid';

// -------------------- LIGHTBOX (reuse gallery logic) --------------------
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbName = document.getElementById('lbName');
const lbPrice = document.getElementById('lbPrice');
const lbStock = document.getElementById('lbStock');
const lbCounter = document.getElementById('lbCounter');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let currentVisible = [];
let currentIndex = 0;

function attachImageClickHandlers(){
  const imgs = Array.from(document.querySelectorAll('.product-img'));
  imgs.forEach(img=>{
    img.addEventListener('click', (e)=>{
      const card = img.closest('.product-card');
      const cat = card.dataset.category;
      // build visible list based on currently visible product cards
      const visibleCards = Array.from(document.querySelectorAll('.product-card')).filter(c => c.style.display !== 'none');
      currentVisible = visibleCards.map(c=>({
        img: c.querySelector('img').getAttribute('src'),
        name: c.dataset.name || c.querySelector('.product-name').textContent,
        price: c.dataset.price || c.querySelector('.product-price').textContent,
        stock: c.dataset.stock || c.querySelector('.product-stock').textContent,
        status: c.dataset.status,
        category: c.dataset.category
      }));
      const src = img.getAttribute('src');
      currentIndex = currentVisible.findIndex(p => p.img === src);
      if(currentIndex === -1) currentIndex = 0;
      openLightbox();
    });
  });
}

function openLightbox(){
  const p = currentVisible[currentIndex];
  if(!p) return;
  lbImage.src = p.img;
  lbImage.alt = p.name;
  lbName.textContent = p.name;
  lbPrice.textContent = p.price;
  lbStock.textContent = p.stock;
  lbCounter.textContent = `${currentIndex + 1} / ${currentVisible.length}`;
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(){
  lightbox.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
lbPrev.addEventListener('click', ()=>{ if(currentVisible.length===0) return; currentIndex=(currentIndex-1+currentVisible.length)%currentVisible.length; openLightbox(); });
lbNext.addEventListener('click', ()=>{ if(currentVisible.length===0) return; currentIndex=(currentIndex+1)%currentVisible.length; openLightbox(); });
document.addEventListener('keydown',(e)=>{ if(lightbox.getAttribute('aria-hidden')==='false'){ if(e.key==='ArrowLeft') lbPrev.click(); if(e.key==='ArrowRight') lbNext.click(); if(e.key==='Escape') closeLightbox(); } });

// Keep counter correct when DOM changes
new MutationObserver(()=>{
  if(lightbox.getAttribute('aria-hidden')==='false'){
    const src = lbImage.getAttribute('src');
    const visibleCards = Array.from(document.querySelectorAll('.product-card')).filter(c => c.style.display !== 'none');
    currentVisible = visibleCards.map(c=>({ img: c.querySelector('img').getAttribute('src'), name: c.dataset.name || c.querySelector('.product-name').textContent, price: c.dataset.price || c.querySelector('.product-price').textContent, stock: c.dataset.stock || c.querySelector('.product-stock').textContent }));
    const idx = currentVisible.findIndex(p=>p.img===src);
    if(idx!==-1) currentIndex=idx;
    lbCounter.textContent = `${currentIndex + 1} / ${currentVisible.length}`;
  }
}).observe(productGrid, {childList:true, subtree:true, attributes:true});

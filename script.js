// footer year
document.getElementById('year').textContent = new Date().getFullYear();

// helper selectors
const categoryList = document.getElementById('categoryList');
const categoryItems = Array.from(document.querySelectorAll('.cat-item'));
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const productGrid = document.getElementById('productGrid');

function allCards(){ return Array.from(document.querySelectorAll('.product-card')); }

// Category click: filter by category
categoryItems.forEach(item => {
  item.addEventListener('click', () => {
    categoryItems.forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
    const cat = item.dataset.cat;
    applyFilters(); // refresh display
  });
});

// Filter buttons (stock filter)
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
});

// Apply both category + stock filter
function applyFilters() {
  const activeCatItem = document.querySelector('.cat-item.active');
  const cat = activeCatItem ? activeCatItem.dataset.cat : 'all';
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

  allCards().forEach(card => {
    const cardCat = card.dataset.category || '';
    const status = card.dataset.status || '';
    // category match?
    const catMatch = (cat === 'all') || (cardCat === cat);
    // status match?
    const statusMatch = (activeFilter === 'all') || (activeFilter === status);
    card.style.display = (catMatch && statusMatch) ? 'flex' : 'none';
  });
}

// Initialize (show all)
applyFilters();

// LIGHTBOX / GALLERY (category-aware)
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

function productFromCard(card){
  return {
    img: card.querySelector('img').getAttribute('src'),
    name: card.dataset.name || card.querySelector('.product-name').textContent,
    price: card.dataset.price || card.querySelector('.product-price').textContent,
    stock: card.dataset.stock || card.querySelector('.product-stock').textContent,
    status: card.dataset.status,
    category: card.dataset.category || ''
  };
}

// compute visible products considering active category + filter
function computeVisibleProducts(category=null){
  const visibleCards = allCards().filter(c => c.style.display !== 'none');
  let filtered = visibleCards;
  if(category && category !== 'all'){
    filtered = visibleCards.filter(c => (c.dataset.category || '') === category);
    if(filtered.length === 0) filtered = visibleCards;
  }
  return filtered.map(productFromCard);
}

// Delegate click on images
productGrid.addEventListener('click', (e) => {
  const img = e.target.closest('.product-img');
  if(!img) return;
  const card = img.closest('.product-card');
  const cat = card.dataset.category || 'all';
  // build visible list according to current filters and category preference
  const activeCat = document.querySelector('.cat-item.active').dataset.cat || 'all';
  currentVisible = computeVisibleProducts(activeCat === 'all' ? cat : activeCat);
  const src = img.getAttribute('src');
  currentIndex = currentVisible.findIndex(p => p.img === src);
  if(currentIndex === -1) currentIndex = 0;
  openLightbox();
});

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

lbPrev.addEventListener('click', ()=>{
  if(currentVisible.length === 0) return;
  currentIndex = (currentIndex - 1 + currentVisible.length) % currentVisible.length;
  openLightbox();
});
lbNext.addEventListener('click', ()=>{
  if(currentVisible.length === 0) return;
  currentIndex = (currentIndex + 1) % currentVisible.length;
  openLightbox();
});

document.addEventListener('keydown', (e)=>{
  if(lightbox.getAttribute('aria-hidden') === 'false'){
    if(e.key === 'ArrowLeft') lbPrev.click();
    if(e.key === 'ArrowRight') lbNext.click();
    if(e.key === 'Escape') closeLightbox();
  }
});

// observe DOM changes to keep counters correct
new MutationObserver(()=>{
  if(lightbox.getAttribute('aria-hidden') === 'false'){
    const src = lbImage.getAttribute('src');
    const activeCat = document.querySelector('.cat-item.active').dataset.cat || 'all';
    currentVisible = computeVisibleProducts(activeCat);
    const idx = currentVisible.findIndex(p => p.img === src);
    if(idx !== -1) currentIndex = idx;
    lbCounter.textContent = `${currentIndex + 1} / ${currentVisible.length}`;
  }
}).observe(productGrid, {childList:true, subtree:true, attributes:true});

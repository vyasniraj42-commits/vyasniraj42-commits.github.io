// footer year
document.getElementById('year').textContent = new Date().getFullYear();
// FILTER functionality
const buttons = document.querySelectorAll('.filter-btn');
const cards = Array.from(document.querySelectorAll('.product-card'));
buttons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    buttons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(card=>{
      const status = card.dataset.status;
      if(filter === 'all' || filter === status) card.style.display = 'flex';
      else card.style.display = 'none';
    });
  });
});
// LIGHTBOX / GALLERY
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbName = document.getElementById('lbName');
const lbPrice = document.getElementById('lbPrice');
const lbStock = document.getElementById('lbStock');
const lbCounter = document.getElementById('lbCounter');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
let products = cards.map(card => ({
  img: card.querySelector('img').getAttribute('src'),
  name: card.dataset.name || card.querySelector('.product-name').textContent,
  price: card.dataset.price || card.querySelector('.product-price').textContent,
  stock: card.dataset.stock || card.querySelector('.product-stock').textContent,
  status: card.dataset.status
}));
let currentIndex = 0;
// Open lightbox when clicking on image
cards.forEach((card, idx) => {
  const img = card.querySelector('img');
  img.addEventListener('click', () => {
    refreshProducts();
    const visible = productsVisible();
    const src = img.getAttribute('src');
    currentIndex = visible.findIndex(p => p.img === src);
    if(currentIndex === -1) currentIndex = 0;
    openLightbox();
  });
});
function productsVisible() {
  const visibleCards = Array.from(document.querySelectorAll('.product-card')).filter(c => c.style.display !== 'none');
  return visibleCards.map(c => ({
    img: c.querySelector('img').getAttribute('src'),
    name: c.dataset.name || c.querySelector('.product-name').textContent,
    price: c.dataset.price || c.querySelector('.product-price').textContent,
    stock: c.dataset.stock || c.querySelector('.product-stock').textContent,
    status: c.dataset.status
  }));
}
function refreshProducts(){
  products = Array.from(document.querySelectorAll('.product-card')).map(card => ({
    img: card.querySelector('img').getAttribute('src'),
    name: card.dataset.name || card.querySelector('.product-name').textContent,
    price: card.dataset.price || card.querySelector('.product-price').textContent,
    stock: card.dataset.stock || card.querySelector('.product-stock').textContent,
    status: card.dataset.status
  }));
}
function openLightbox(){
  const visible = productsVisible();
  const p = visible[currentIndex];
  if(!p) return;
  lbImage.src = p.img;
  lbImage.alt = p.name;
  lbName.textContent = p.name;
  lbPrice.textContent = p.price;
  lbStock.textContent = p.stock;
  lbCounter.textContent = `${currentIndex + 1} / ${visible.length}`;
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
  const visible = productsVisible();
  if(visible.length === 0) return;
  currentIndex = (currentIndex - 1 + visible.length) % visible.length;
  openLightbox();
});
lbNext.addEventListener('click', ()=>{
  const visible = productsVisible();
  if(visible.length === 0) return;
  currentIndex = (currentIndex + 1) % visible.length;
  openLightbox();
});
document.addEventListener('keydown', (e)=>{
  if(lightbox.getAttribute('aria-hidden') === 'false'){
    if(e.key === 'ArrowLeft') lbPrev.click();
    if(e.key === 'ArrowRight') lbNext.click();
    if(e.key === 'Escape') closeLightbox();
  }
});
new MutationObserver(()=> {
  if(lightbox.getAttribute('aria-hidden') === 'false'){
    const visible = productsVisible();
    const idx = visible.findIndex(p => p.img === lbImage.src || p.img === lbImage.getAttribute('src'));
    if(idx !== -1) currentIndex = idx;
    lbCounter.textContent = `${currentIndex + 1} / ${visible.length}`;
  }
}).observe(document.getElementById('productGrid'), {childList:true, subtree:true, attributes:true});

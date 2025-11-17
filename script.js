// footer year
document.getElementById('year').textContent = new Date().getFullYear();

// FILTER functionality
const buttons = document.querySelectorAll('.filter-btn');
const productGrid = document.getElementById('productGrid');

function allCards() {
  return Array.from(document.querySelectorAll('.product-card'));
}

buttons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    buttons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    allCards().forEach(card=>{
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

let currentVisible = []; // array of product objects currently in the gallery (based on filter+category)
let currentIndex = 0;

// Helper: build product object from a card element
function productFromCard(card) {
  return {
    img: card.querySelector('img').getAttribute('src'),
    name: card.dataset.name || card.querySelector('.product-name').textContent,
    price: card.dataset.price || card.querySelector('.product-price').textContent,
    stock: card.dataset.stock || card.querySelector('.product-stock').textContent,
    status: card.dataset.status,
    category: card.dataset.category || ''
  };
}

// Helper: get visible cards (respecting current filter display) optionally filtered by category
function visibleProductsByCategory(category = null) {
  const visibleCards = allCards().filter(c => c.style.display !== 'none');
  let filtered = visibleCards;
  if(category) {
    filtered = visibleCards.filter(c => (c.dataset.category || '') === category);
    // If none in same category are visible, fall back to all visibleCards
    if(filtered.length === 0) filtered = visibleCards;
  }
  return filtered.map(productFromCard);
}

// Attach click handlers (delegation safe) to images
productGrid.addEventListener('click', (e) => {
  const img = e.target.closest('.product-img');
  if(!img) return;
  const card = img.closest('.product-card');
  if(!card) return;

  const cat = card.dataset.category || null;
  currentVisible = visibleProductsByCategory(cat);
  const src = img.getAttribute('src');
  currentIndex = currentVisible.findIndex(p => p.img === src);
  if(currentIndex === -1) currentIndex = 0;
  openLightbox();
});

// Open and render
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

// Close
function closeLightbox(){
  lightbox.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e)=>{
  if(e.target === lightbox) closeLightbox(); // click outside content closes
});

// Prev / Next
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

// keyboard nav
document.addEventListener('keydown', (e)=>{
  if(lightbox.getAttribute('aria-hidden') === 'false'){
    if(e.key === 'ArrowLeft') lbPrev.click();
    if(e.key === 'ArrowRight') lbNext.click();
    if(e.key === 'Escape') closeLightbox();
  }
});

// If DOM changes (filter applied or files changed), update currentVisible mapping (keep lightbox index correct)
new MutationObserver(()=> {
  if(lightbox.getAttribute('aria-hidden') === 'false'){
    const src = lbImage.getAttribute('src');
    const visibleCards = allCards().filter(c => c.style.display !== 'none');
    const matchingCard = visibleCards.find(c => c.querySelector('img').getAttribute('src') === src);
    const cat = matchingCard ? (matchingCard.dataset.category || null) : null;
    currentVisible = visibleProductsByCategory(cat);
    const idx = currentVisible.findIndex(p => p.img === src);
    if(idx !== -1) currentIndex = idx;
    lbCounter.textContent = `${currentIndex + 1} / ${currentVisible.length}`;
  }
}).observe(productGrid, {childList:true, subtree:true, attributes:true});

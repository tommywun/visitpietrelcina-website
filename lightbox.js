(function(){
  var overlay, img, caption, counter, items, idx;

  function build(){
    overlay = document.createElement('div');
    overlay.className = 'vp-lightbox-overlay';
    overlay.innerHTML =
      '<button class="vp-lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="vp-lightbox-prev" aria-label="Previous">&#8249;</button>' +
      '<button class="vp-lightbox-next" aria-label="Next">&#8250;</button>' +
      '<img class="vp-lightbox-img" src="" alt="">' +
      '<div class="vp-lightbox-caption"></div>' +
      '<div class="vp-lightbox-counter"></div>';
    document.body.appendChild(overlay);
    img = overlay.querySelector('.vp-lightbox-img');
    caption = overlay.querySelector('.vp-lightbox-caption');
    counter = overlay.querySelector('.vp-lightbox-counter');
    overlay.querySelector('.vp-lightbox-close').addEventListener('click', close);
    overlay.querySelector('.vp-lightbox-prev').addEventListener('click', prev);
    overlay.querySelector('.vp-lightbox-next').addEventListener('click', next);
    overlay.addEventListener('click', function(e){ if(e.target === overlay) close(); });
    document.addEventListener('keydown', function(e){
      if(!overlay.classList.contains('active')) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowLeft') prev();
      if(e.key === 'ArrowRight') next();
    });
  }

  function show(i){
    idx = i;
    img.src = items[i].src;
    img.alt = items[i].alt;
    caption.textContent = items[i].alt;
    counter.textContent = (i+1) + ' / ' + items.length;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close(){
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prev(){ show((idx - 1 + items.length) % items.length); }
  function next(){ show((idx + 1) % items.length); }

  document.addEventListener('DOMContentLoaded', function(){
    var els = document.querySelectorAll('[data-lightbox]');
    if(!els.length) return;
    build();
    items = [];
    els.forEach(function(el, i){
      items.push({ src: el.getAttribute('data-lightbox'), alt: el.getAttribute('data-caption') || '' });
      el.addEventListener('click', function(e){
        e.preventDefault();
        show(i);
      });
      el.style.cursor = 'pointer';
    });
  });
})();

(function(){
  var overlay, lbImg, caption, counter, items, idx;

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
    lbImg = overlay.querySelector('.vp-lightbox-img');
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
    lbImg.src = items[i].src;
    lbImg.alt = items[i].alt;
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

  function register(el, src, alt, clickTarget){
    var i = items.length;
    items.push({ src: src, alt: alt });
    el.style.cursor = 'zoom-in';
    (clickTarget || el).addEventListener('click', function(e){
      e.preventDefault();
      show(i);
    });
  }

  function isTiny(el){
    var w = el.getAttribute('width'), h = el.getAttribute('height');
    return (w && parseInt(w) < 80) || (h && parseInt(h) < 80);
  }

  function bestSrc(src){
    // Strip WP thumbnail suffix to get full-size image
    return src.replace(/-\d+x\d+(\.\w+)$/, '$1');
  }

  document.addEventListener('DOMContentLoaded', function(){
    items = [];
    var registered = new Set();
    var content = document.querySelector('.entry-content');

    // 1. Explicit data-lightbox elements (e.g. stations page)
    var explicit = document.querySelectorAll('[data-lightbox]');
    explicit.forEach(function(el){
      registered.add(el);
      register(el, el.getAttribute('data-lightbox'), el.getAttribute('data-caption') || el.alt || '');
    });

    if(!content){ if(items.length) build(); return; }

    // 2. Images wrapped in links to image files
    var links = content.querySelectorAll('a[href]');
    links.forEach(function(link){
      var href = link.getAttribute('href') || '';
      if(!/\.(jpe?g|png|gif|webp)(\?.*)?$/i.test(href)) return;
      var img = link.querySelector('img');
      if(!img || registered.has(img)) return;
      if(isTiny(img)) return;
      registered.add(img);
      register(img, href, img.alt || '', link);
    });

    // 3. Standalone content images (not in links, not already registered)
    var imgs = content.querySelectorAll('img');
    imgs.forEach(function(el){
      if(registered.has(el)) return;
      if(el.closest('.vp-lightbox-overlay')) return;
      if(el.closest('a[href]')) return;
      if(isTiny(el)) return;
      if(el.classList.contains('avatar') || el.classList.contains('emoji')) return;
      registered.add(el);
      register(el, bestSrc(el.src), el.alt || '');
    });

    if(items.length) build();
  });
})();

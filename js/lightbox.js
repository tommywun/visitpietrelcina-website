(function(){
  var overlay = document.getElementById('vpLightbox');
  if (!overlay) return;
  var lbImg = overlay.querySelector('img');
  var lbCap = overlay.querySelector('figcaption');
  var close = overlay.querySelector('.vp-lightbox-close');

  document.querySelectorAll('.entry-content .vp-travel-img img, .entry-content .vp-travel-map img, .entry-content .vp-gallery-item img').forEach(function(img){
    img.addEventListener('click', function(e){
      e.preventDefault();
      var large = this.getAttribute('data-large') || this.src;
      var info = this.getAttribute('data-info') || '';
      var caption = this.closest('figure') ? this.closest('figure').querySelector('figcaption') : null;
      var title = caption ? caption.textContent : '';
      lbImg.src = large;
      lbImg.alt = this.alt;
      lbCap.innerHTML = title ? '<strong>' + title + '</strong>' + (info ? '<br>' + info : '') : info;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLB(){
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  close.addEventListener('click', closeLB);
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeLB();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeLB();
  });
})();

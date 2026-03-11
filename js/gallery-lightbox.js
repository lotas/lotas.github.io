(function () {
  var lb = document.createElement('div');
  lb.className = 'gallery-lightbox';
  lb.innerHTML =
    '<button class="gallery-lightbox__close" aria-label="Close">&times;</button>' +
    '<button class="gallery-lightbox__prev" aria-label="Previous">&#8249;</button>' +
    '<button class="gallery-lightbox__next" aria-label="Next">&#8250;</button>' +
    '<img class="gallery-lightbox__img" src="" alt="">' +
    '<div class="gallery-lightbox__caption"></div>';
  document.body.appendChild(lb);

  var img = lb.querySelector('.gallery-lightbox__img');
  var caption = lb.querySelector('.gallery-lightbox__caption');
  var images = [];
  var currentIndex = 0;

  function open() {
    lb.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function update() {
    var src = images[currentIndex];
    img.src = src.getAttribute('src');
    img.alt = src.alt || '';
    var fig = src.closest('figure');
    var cap = fig ? fig.querySelector('figcaption') : null;
    caption.textContent = cap ? cap.textContent : '';
  }

  function navigate(delta) {
    currentIndex = (currentIndex + delta + images.length) % images.length;
    update();
  }

  document.addEventListener('click', function (e) {
    var target = e.target;
    if (target.matches('.gallery__item img')) {
      var gallery = target.closest('.gallery');
      images = Array.prototype.slice.call(gallery.querySelectorAll('img[data-index]'));
      currentIndex = parseInt(target.getAttribute('data-index'), 10);
      update();
      open();
    }
  });

  lb.querySelector('.gallery-lightbox__close').addEventListener('click', close);
  lb.querySelector('.gallery-lightbox__prev').addEventListener('click', function () { navigate(-1); });
  lb.querySelector('.gallery-lightbox__next').addEventListener('click', function () { navigate(1); });

  lb.addEventListener('click', function (e) {
    if (e.target === lb) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-active')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') navigate(-1);
    else if (e.key === 'ArrowRight') navigate(1);
  });
})();

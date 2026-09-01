/* Scapeland — scroll reveals, motion section, video handling */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Motion section — sticky media with two panels */
  var track = document.querySelector('.motion__track');
  var video = document.querySelector('video.hero__img');
  var panels = document.querySelectorAll('.motion__panel');

  function onScroll() {
    if (!track) return;
    var rect = track.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    if (total <= 0) return;
    var progress = Math.min(1, Math.max(0, -rect.top / total));
    panels.forEach(function (p, i) {
      var active = i === 0 ? progress > 0.12 && progress < 0.5 : progress >= 0.5 && progress < 0.92;
      p.classList.toggle('is-active', active);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hero film: pause under reduced motion; otherwise play only while visible. */
  if (video) {
    if (reduced) {
      video.removeAttribute('autoplay');
      video.pause();
    } else if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var p = video.play();
            if (p && p.catch) p.catch(function () { /* autoplay blocked — poster stays */ });
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.1 });
      vio.observe(video);
    }
  }
})();

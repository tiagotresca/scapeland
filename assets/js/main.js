/* Scapeland — scroll reveals, motion section, video handling, reserve form */

/* Where reservation submissions go. Point this at a Formspree/Klaviyo/own
   endpoint (POST, JSON body) when one exists; while empty, submissions fall
   back to a pre-filled email to RESERVE_EMAIL. A host page may also define
   window.SCAPELAND_SUBMIT(data) -> Promise to take over delivery. */
var FORM_ENDPOINT = '';
var RESERVE_EMAIL = 'hello@scapeland.com';

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

  /* Reserve form */
  var form = document.getElementById('reserve-form');
  var done = document.getElementById('reserve-done');
  var errEl = document.getElementById('reserve-error');

  function deliver(data) {
    if (typeof window.SCAPELAND_SUBMIT === 'function') {
      return Promise.resolve(window.SCAPELAND_SUBMIT(data));
    }
    if (FORM_ENDPOINT) {
      return fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('endpoint ' + r.status);
      });
    }
    /* No endpoint configured: open a pre-filled email. */
    var body = 'Name: ' + data.name + '\nEmail: ' + data.email +
      '\nModel: ' + data.model + '\nLand: ' + (data.message || '-');
    window.location.href = 'mailto:' + RESERVE_EMAIL +
      '?subject=' + encodeURIComponent('Early access — ' + data.name) +
      '&body=' + encodeURIComponent(body);
    return Promise.resolve();
  }

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        model: form.model.value,
        message: form.message.value.trim(),
        at: new Date().toISOString()
      };
      var valid = data.name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      errEl.hidden = !!valid;
      if (!valid) return;
      var btn = form.querySelector('.reserve__submit');
      btn.disabled = true;
      deliver(data).then(function () {
        form.hidden = true;
        done.hidden = false;
      }).catch(function () {
        btn.disabled = false;
        errEl.textContent = "Something failed on our side — please email " + RESERVE_EMAIL + " directly.";
        errEl.hidden = false;
      });
    });
  }
})();

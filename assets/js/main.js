/* Scapeland — scroll reveals, motion section, video handling, reserve form */

/* Where reservation leads go. Set this to the Google Apps Script Web App URL
   (see docs/DEPLOY.md) — each lead is appended as a row in the "Scapeland
   Leads" Google Sheet. While empty, submissions fall back to a pre-filled
   email to RESERVE_EMAIL. A host page may also define
   window.SCAPELAND_SUBMIT(data) -> Promise to take over delivery. */
var FORM_ENDPOINT = '';
var RESERVE_EMAIL = 'hello@scapeland.com';

/* Country dial codes for the phone field; Portugal default. */
var DIAL_CODES = [
  ['PT', '🇵🇹', '+351'], ['ES', '🇪🇸', '+34'], ['FR', '🇫🇷', '+33'], ['GB', '🇬🇧', '+44'],
  ['DE', '🇩🇪', '+49'], ['IT', '🇮🇹', '+39'], ['NL', '🇳🇱', '+31'], ['BE', '🇧🇪', '+32'],
  ['LU', '🇱🇺', '+352'], ['CH', '🇨🇭', '+41'], ['AT', '🇦🇹', '+43'], ['IE', '🇮🇪', '+353'],
  ['DK', '🇩🇰', '+45'], ['SE', '🇸🇪', '+46'], ['NO', '🇳🇴', '+47'], ['FI', '🇫🇮', '+358'],
  ['IS', '🇮🇸', '+354'], ['PL', '🇵🇱', '+48'], ['CZ', '🇨🇿', '+420'], ['SK', '🇸🇰', '+421'],
  ['HU', '🇭🇺', '+36'], ['RO', '🇷🇴', '+40'], ['BG', '🇧🇬', '+359'], ['GR', '🇬🇷', '+30'],
  ['HR', '🇭🇷', '+385'], ['SI', '🇸🇮', '+386'], ['RS', '🇷🇸', '+381'], ['UA', '🇺🇦', '+380'],
  ['EE', '🇪🇪', '+372'], ['LV', '🇱🇻', '+371'], ['LT', '🇱🇹', '+370'], ['MT', '🇲🇹', '+356'],
  ['CY', '🇨🇾', '+357'], ['TR', '🇹🇷', '+90'], ['US', '🇺🇸', '+1'], ['CA', '🇨🇦', '+1'],
  ['MX', '🇲🇽', '+52'], ['BR', '🇧🇷', '+55'], ['AR', '🇦🇷', '+54'], ['CL', '🇨🇱', '+56'],
  ['CO', '🇨🇴', '+57'], ['PE', '🇵🇪', '+51'], ['UY', '🇺🇾', '+598'], ['VE', '🇻🇪', '+58'],
  ['MA', '🇲🇦', '+212'], ['DZ', '🇩🇿', '+213'], ['TN', '🇹🇳', '+216'], ['EG', '🇪🇬', '+20'],
  ['ZA', '🇿🇦', '+27'], ['AO', '🇦🇴', '+244'], ['MZ', '🇲🇿', '+258'], ['CV', '🇨🇻', '+238'],
  ['GW', '🇬🇼', '+245'], ['ST', '🇸🇹', '+239'], ['TL', '🇹🇱', '+670'], ['MO', '🇲🇴', '+853'],
  ['AE', '🇦🇪', '+971'], ['SA', '🇸🇦', '+966'], ['QA', '🇶🇦', '+974'], ['IL', '🇮🇱', '+972'],
  ['IN', '🇮🇳', '+91'], ['CN', '🇨🇳', '+86'], ['JP', '🇯🇵', '+81'], ['KR', '🇰🇷', '+82'],
  ['SG', '🇸🇬', '+65'], ['HK', '🇭🇰', '+852'], ['TH', '🇹🇭', '+66'], ['ID', '🇮🇩', '+62'],
  ['MY', '🇲🇾', '+60'], ['PH', '🇵🇭', '+63'], ['VN', '🇻🇳', '+84'], ['AU', '🇦🇺', '+61'],
  ['NZ', '🇳🇿', '+64'], ['RU', '🇷🇺', '+7']
];

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

  /* GLT strip — on mobile, vertical scroll drives the figures sideways
     so every image passes through the viewport. */
  var glt = document.getElementById('glt');
  var strip = glt && glt.querySelector('.solid__figures');
  var mqMobile = window.matchMedia('(max-width: 47.99rem)');
  var gltMax = 0;

  /* Measure the horizontal travel with the transform cleared (Safari can
     misreport scrollWidth on transformed elements) and give the track
     exactly viewport + travel of height, so the pin releases the moment
     the last figure is fully on screen. */
  function gltMeasure() {
    if (!glt.classList.contains('glt--active')) return;
    var prev = strip.style.transform;
    strip.style.transform = 'none';
    gltMax = Math.max(0, strip.scrollWidth - document.documentElement.clientWidth);
    strip.style.transform = prev;
    glt.style.height = (window.innerHeight + gltMax) + 'px';
  }

  function gltMode() {
    if (!glt) return;
    var active = mqMobile.matches && !reduced;
    glt.classList.toggle('glt--active', active);
    if (!active && strip) {
      strip.style.transform = '';
      glt.style.height = '';
    } else {
      gltMeasure();
    }
    onGltScroll();
  }

  function onGltScroll() {
    if (!glt || !strip || !glt.classList.contains('glt--active') || gltMax <= 0) return;
    var top = glt.getBoundingClientRect().top;
    var progress = Math.min(1, Math.max(0, -top / gltMax));
    strip.style.transform = 'translateX(' + (-progress * gltMax) + 'px)';
  }

  function gltRefresh() { gltMeasure(); onGltScroll(); }

  if (glt && strip) {
    gltMode();
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', gltMode);
    window.addEventListener('scroll', onGltScroll, { passive: true });
    window.addEventListener('resize', gltRefresh, { passive: true });
    window.addEventListener('orientationchange', gltRefresh);
    window.addEventListener('load', gltRefresh);
  }

  /* Hero film: lighter rendition on small screens (swap before it loads). */
  if (video && window.matchMedia('(max-width: 47.99rem)').matches) {
    var heroSrc = video.getAttribute('src');
    if (heroSrc && heroSrc.indexOf('motion.mp4') !== -1) {
      video.src = heroSrc.replace('motion.mp4', 'motion-mobile.mp4');
    }
  }

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

  /* Fill the dial-code dropdown (PT stays default). */
  if (form) {
    var dial = form.querySelector('.reserve__dial');
    dial.innerHTML = '';
    DIAL_CODES.forEach(function (c) {
      var o = document.createElement('option');
      o.value = c[2];
      o.textContent = c[1] + ' ' + c[2];
      o.setAttribute('data-country', c[0]);
      if (c[0] === 'PT') o.selected = true;
      dial.appendChild(o);
    });
  }

  function deliver(data) {
    if (typeof window.SCAPELAND_SUBMIT === 'function') {
      return Promise.resolve(window.SCAPELAND_SUBMIT(data));
    }
    if (FORM_ENDPOINT) {
      /* Apps Script web apps don't answer CORS preflights, so send the lead
         as an opaque no-cors POST; delivery is fire-and-forget. */
      return fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      });
    }
    /* No endpoint configured: open a pre-filled email. */
    var body = 'Name: ' + data.name + '\nEmail: ' + data.email + '\nPhone: ' + data.phone;
    window.location.href = 'mailto:' + RESERVE_EMAIL +
      '?subject=' + encodeURIComponent('Early access — ' + data.name) +
      '&body=' + encodeURIComponent(body);
    return Promise.resolve();
  }

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var num = form.phone.value.replace(/[^\d]/g, '');
      var data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.dial.value + ' ' + form.phone.value.trim(),
        at: new Date().toISOString()
      };
      var valid = data.name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && num.length >= 6;
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

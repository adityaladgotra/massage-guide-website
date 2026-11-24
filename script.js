(function(){
  'use strict';
  const config = window.SITE_CONFIG || {};
  const checkout = (config.checkoutUrl || '').trim();
  const toast = document.getElementById('toast');
  let toastTimeout;

  function notify(message){
    if(!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('visible'), 4500);
  }

  document.querySelectorAll('[data-checkout]').forEach(link => {
    if(checkout && /^https?:\/\//i.test(checkout)){
      link.href = checkout;
      link.rel = 'noopener noreferrer';
      link.target = '_self'; // Open checkout in the same browser tab.
    } else {
      link.addEventListener('click', function(event){
        event.preventDefault();
        notify('Checkout link not configured. Edit checkoutUrl in checkout-config.js, then rebuild and redeploy.');
      });
    }
  });

  // One-time scroll reveals for content entering view. No animation on first-screen
  // content, no permanently hidden content when observers are unavailable.
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll(
      '.section h2, .story-panel, .visual-card, .review, .learn-card, .author-card, .offer-card'
    );
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('scroll-reveal-pending');
        entry.target.classList.add('scroll-reveal-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px 25px 0px' });

    const viewportHeight = window.innerHeight || 900;
    targets.forEach(el => {
      // Do not hide initially visible content, including the hero.
      if (el.getBoundingClientRect().top < viewportHeight + 40) return;
      el.classList.add('scroll-reveal-pending');
      observer.observe(el);
    });
  }

  const tabs = document.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(btn => {
        const active = btn === tab;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      panels.forEach(panel => {
        panel.hidden = panel.id !== tab.dataset.tab;
      });
    });
  });

  // Session-based 10-minute page timer. It remains consistent on refresh and
  // starts fresh on a NEW browser tab/session. This is not proof of offer expiry.
  const countdown = document.getElementById('countdown');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const timerNote = document.getElementById('timer-note');
  if(countdown && hoursEl && minutesEl && secondsEl){
    const configured = String(config.offerEndAt || '').trim();
    const parsed = configured ? Date.parse(configured) : NaN;
    const hasRealDeadline = Number.isFinite(parsed);
    const sessionKey = 'massageGuideSessionCountdownV9';
    let endTime = hasRealDeadline ? parsed : NaN;

    if(!hasRealDeadline){
      try {
        const stored = Number(window.sessionStorage.getItem(sessionKey));
        if(Number.isFinite(stored) && stored > 0){
          endTime = stored;
        }
      } catch (_) { /* Storage may be disabled; countdown still works. */ }
      if(!Number.isFinite(endTime)){
        endTime = Date.now() + 10 * 60 * 1000;
        try { window.sessionStorage.setItem(sessionKey, String(endTime)); } catch (_) {}
      }
      if(timerNote) timerNote.textContent = '10-minute session countdown';
    } else if(timerNote){
      timerNote.textContent = 'Offer countdown';
    }

    let intervalId = null;
    const renderCountdown = () => {
      // Wall-clock calculation avoids drifting when the tab is backgrounded.
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
      if(remaining === 0 && intervalId !== null){
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    renderCountdown();
    if(endTime > Date.now()) intervalId = setInterval(renderCountdown, 250);
    document.addEventListener('visibilitychange', renderCountdown);
    window.addEventListener('focus', renderCountdown);
    window.addEventListener('pageshow', renderCountdown);
  }
})();

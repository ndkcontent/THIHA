/* ============================================
   THIHA WAREHOUSES — main.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom Cursor ──────────────────────── */
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let magEl = null;
    let isMagnifying = false;
    const LENS = 120;
    const SCALE = 2.2;

    const TEXT_SELECTORS = [
      'h1','h2','h3','h4','p','blockquote',
      '.why-name','.why-number','.why-sub',
      '.testimonials-quote','.testimonials-brand',
      '.testimonials-name','.panel-lead','.panel-body',
      '.footer-brand','.service-asterisk',
      '.btn-outline-light',
      '.footer-col p','.footer-col a',
      '.faq-glass-question','.faq-glass-answer-inner',
      '.faq-category-label','.about-h2','.about-lead',
      '.about-body','.about-card-title','.about-card-body',
      '.about-hero-title','.about-hero-sub'
    ].join(',');

    function setFollowerPos(x, y) {
      follower.style.left = x + 'px';
      follower.style.top  = y + 'px';
    }

    function clearMag() {
      const old = follower.querySelector('.mag-clone');
      if (old) old.remove();
    }

    function updateMag(x, y) {
      clearMag();
      if (!magEl) return;

      const rect   = magEl.getBoundingClientRect();
      const styles = window.getComputedStyle(magEl);

      const relX = x - rect.left;
      const relY = y - rect.top;

      const cloneLeft = (LENS / 2) - relX * SCALE;
      const cloneTop  = (LENS / 2) - relY * SCALE;

      const clone = document.createElement('div');
      clone.className = 'mag-clone';

      // innerHTML preserves <br> tags; falls back to textContent
      clone.innerHTML = magEl.innerHTML || magEl.textContent;

      // All resolved computed values — no clamp, no em, no variables
      clone.style.fontSize        = styles.fontSize;
      clone.style.fontFamily      = styles.fontFamily;
      clone.style.fontWeight      = styles.fontWeight;
      clone.style.fontStyle       = styles.fontStyle;
      clone.style.lineHeight      = styles.lineHeight;
      clone.style.letterSpacing   = styles.letterSpacing;
      clone.style.textAlign       = styles.textAlign;
      clone.style.whiteSpace      = styles.whiteSpace;
      clone.style.wordSpacing     = styles.wordSpacing;
      clone.style.textTransform   = styles.textTransform;
      clone.style.color           = 'rgba(255,255,255,0.95)';

      // Include padding so text starts at the same offset as the original
      clone.style.paddingLeft     = styles.paddingLeft;
      clone.style.paddingTop      = styles.paddingTop;
      clone.style.paddingRight    = styles.paddingRight;
      clone.style.paddingBottom   = styles.paddingBottom;

      // Lock width including padding so wrapping is identical
      clone.style.width           = rect.width + 'px';
      clone.style.boxSizing       = 'border-box';
      clone.style.margin          = '0';

      clone.style.transformOrigin = 'top left';
      clone.style.transform       = `scale(${SCALE})`;
      clone.style.left            = cloneLeft + 'px';
      clone.style.top             = cloneTop  + 'px';

      follower.appendChild(clone);
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
      if (isMagnifying) {
        followerX = mouseX;
        followerY = mouseY;
        setFollowerPos(mouseX, mouseY);
        updateMag(mouseX, mouseY);
      }
    });

    const animateFollower = () => {
      if (!isMagnifying) {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        setFollowerPos(followerX, followerY);
      }
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    document.querySelectorAll(TEXT_SELECTORS).forEach(el => {
      el.addEventListener('mouseenter', () => {
        magEl = el;
        isMagnifying = true;
        follower.classList.add('magnify');
        follower.classList.remove('hover');
        cursor.style.opacity = '0';
        followerX = mouseX;
        followerY = mouseY;
        setFollowerPos(mouseX, mouseY);
        updateMag(mouseX, mouseY);
      });
      el.addEventListener('mouseleave', () => {
        magEl = null;
        isMagnifying = false;
        clearMag();
        follower.classList.remove('magnify');
        cursor.style.opacity = '1';
      });
    });

    const hoverEls = document.querySelectorAll('a, button, .panel-card, .panel-why-item');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (isMagnifying) return;
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  /* ── FAQ deep link via hash ──────────────── */
  if (window.location.hash && document.querySelector('.faq-sections-scroll')) {
    const targetId = window.location.hash.slice(1);
    const targetItem = document.getElementById(targetId);

    if (targetItem) {
      // Find which panel contains this item
      const parentPanel = targetItem.closest('.faq-panel');
      const allPanels = [...document.querySelectorAll('.faq-panel')];
      const panelIndex = allPanels.indexOf(parentPanel);

      // Wait for page to settle then navigate
      setTimeout(() => {
        const faqScroll = document.getElementById('faqSectionsScroll');
        if (faqScroll && panelIndex >= 0) {
          const scrollable = faqScroll.offsetHeight - window.innerHeight;
          const FAQ_TOTAL = allPanels.length;
          const targetScroll = faqScroll.offsetTop + (panelIndex / (FAQ_TOTAL - 1)) * scrollable;
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });

          // Open the accordion item
          setTimeout(() => {
            targetItem.classList.add('open');
          }, 800);
        }
      }, 500);
    }
  }
  

  /* ── Nav scroll ─────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onNavScroll = () => nav.classList.toggle('scrolled', window.scrollY > 80);
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
  }

  /* ── Nav dropdowns ──────────────────────── */
  const dropdownItems = document.querySelectorAll('.nav-has-dropdown');
  dropdownItems.forEach(item => {
    let timeout;
    item.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      const dropdown = item.querySelector('.nav-dropdown');
      if (dropdown) dropdown.classList.add('open');
    });
    item.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => {
        const dropdown = item.querySelector('.nav-dropdown');
        if (dropdown) dropdown.classList.remove('open');
      }, 150);
    });
  });

  /* ── Mobile nav toggle ──────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      const isOpen = navLinks.classList.contains('open');
      spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
      spans[1].style.opacity  = isOpen ? '0' : '1';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity='1'; });
      });
    });
  }

  /* ── Active nav link ────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ── Hero fade on scroll ────────────────── */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.5), 1);
      heroContent.style.opacity = String(1 - progress);
      heroContent.style.transform = `translateY(${-progress * 80}px)`;
    }, { passive: true });
  }

  

  /* ── Section panels scroll driver ──────── */
  const sectionsScroll = document.getElementById('sectionsScroll');
  const panels = document.querySelectorAll('.section-panel');
  const dots = document.querySelectorAll('.stage-dot');
  const TOTAL = panels.length;
  let currentPanel = -1;
  let locked = false;

  const activatePanel = (index) => {
    if (index === currentPanel) return;
    const prev = currentPanel;
    currentPanel = index;

    panels.forEach((panel, i) => {
      panel.classList.remove('active', 'exit');
      if (i === index) {
        panel.classList.add('active');
        if (i === 1) {
          panel.querySelectorAll('.panel-card').forEach((card, ci) => {
            card.classList.remove('card-in');
            setTimeout(() => card.classList.add('card-in'), ci * 100);
          });
        }
        if (i === 2) {
          const svg = document.querySelector('.infographic-svg');
          if (svg) setTimeout(() => svg.classList.add('animate'), 200);
        }
      } else if (i === prev) {
        panel.classList.add('exit');
        setTimeout(() => panel.classList.remove('exit'), 700);
      }
    });

    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  if (sectionsScroll && panels.length) {

    const getPanelScroll = (index) => {
      const scrollable = sectionsScroll.offsetHeight - window.innerHeight;
      return sectionsScroll.offsetTop + (index / (TOTAL - 1)) * scrollable;
    };

    const inStickyZone = () => {
      const rect = sectionsScroll.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom >= window.innerHeight;
    };

    const goToPanel = (index) => {
      window.scrollTo({ top: getPanelScroll(index), behavior: 'smooth' });
    };

    let enteredFromTop = false;

    window.addEventListener('scroll', () => {
      if (!inStickyZone()) {
        const rect = sectionsScroll.getBoundingClientRect();
        enteredFromTop = rect.top > 0;
        return;
      }

      const rect = sectionsScroll.getBoundingClientRect();
      const scrollable = sectionsScroll.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const index = Math.min(Math.round(progress * (TOTAL - 1)), TOTAL - 1);
      activatePanel(index);

      if (enteredFromTop) {
        enteredFromTop = false;
        locked = true;
        window.scrollTo({ top: getPanelScroll(0), behavior: 'smooth' });
        setTimeout(() => { locked = false; }, 700);
      }
    }, { passive: true });

    window.addEventListener('wheel', (e) => {
      if (!inStickyZone()) return;
      e.preventDefault();
      if (locked) return;
      locked = true;

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = currentPanel + direction;

      if (next < 0) {
        window.scrollTo({ top: sectionsScroll.offsetTop - window.innerHeight, behavior: 'smooth' });
      } else if (next >= TOTAL) {
        window.scrollTo({ top: sectionsScroll.offsetTop + sectionsScroll.offsetHeight + 1, behavior: 'smooth' });
      } else {
        goToPanel(next);
      }

      setTimeout(() => { locked = false; }, 900);
    }, { passive: false });

    dots.forEach((dot, i) => dot.addEventListener('click', () => goToPanel(i)));

    activatePanel(0);
  }

  /* ── Partners carousel ────────────────────── */
  const partnersCarousel = document.getElementById('partnersCarousel');
  const partnersTrack = document.getElementById('partnersTrack');
  const partnersPrev = document.getElementById('partnersPrev');
  const partnersNext = document.getElementById('partnersNext');

  if (partnersCarousel && partnersTrack) {
    partnersCarousel.addEventListener('mouseenter', () => partnersCarousel.classList.add('paused'));
    partnersCarousel.addEventListener('mouseleave', () => partnersCarousel.classList.remove('paused'));

    let resumeTimer = null;
    const cardWidth = 196;

    function nudge(direction) {
      partnersCarousel.classList.add('paused');
      const wrap = partnersTrack.parentElement;
      wrap.scrollBy({ left: direction * cardWidth * 2, behavior: 'smooth' });
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => partnersCarousel.classList.remove('paused'), 3000);
    }

    if (partnersPrev) partnersPrev.addEventListener('click', () => nudge(-1));
    if (partnersNext) partnersNext.addEventListener('click', () => nudge(1));
  }

  /* ── Space Calculator ────────────────────── */
  var calcModal      = document.getElementById('calcModal');
  var calcBtn        = document.getElementById('fabCalcBtn');
  var calcClose      = document.getElementById('calcClose');
  var calcPallets    = document.getElementById('calcPallets');
  var calcPalletsVal = document.getElementById('calcPalletsVal');
  var calcSqft       = document.getElementById('calcSqft');
  var calcGroundFill = document.getElementById('calcGroundFill');
  var calcFirstFill  = document.getElementById('calcFirstFill');
  var calcGroundPct  = document.getElementById('calcGroundPct');
  var calcFirstPct   = document.getElementById('calcFirstPct');
  var calcNote       = document.getElementById('calcNote');

  var SQFT_PER_PALLET = 32; /* rule-of-thumb incl. aisle access */
  var FLOOR_SQFT = 5000;

  function updateCalc() {
    var pallets = parseInt(calcPallets.value, 10);
    var sqft = pallets * SQFT_PER_PALLET;
    calcPalletsVal.textContent = pallets;
    calcSqft.textContent = sqft;

    var groundFill = Math.min(sqft, FLOOR_SQFT);
    var overflow = Math.max(sqft - FLOOR_SQFT, 0);
    var firstFill = Math.min(overflow, FLOOR_SQFT);

    var groundPct = Math.round((groundFill / FLOOR_SQFT) * 100);
    var firstPct  = Math.round((firstFill / FLOOR_SQFT) * 100);

    calcGroundFill.style.width = groundPct + '%';
    calcFirstFill.style.width  = firstPct + '%';
    calcGroundPct.textContent = groundPct + '%';
    calcFirstPct.textContent  = firstPct + '%';

    if (sqft <= FLOOR_SQFT) {
      calcNote.textContent = 'Comfortably fits within our Ground Floor Storage with room to grow.';
    } else if (sqft <= FLOOR_SQFT * 2) {
      calcNote.textContent = "You'll need both floors — Ground Floor Storage plus First Floor Open Storage.";
    } else {
      calcNote.textContent = "This exceeds our standard floor capacity — get in touch and we'll discuss a custom solution.";
    }
  }

  if (calcPallets) {
    calcPallets.addEventListener('input', updateCalc);
    updateCalc();
  }
  if (calcBtn && calcModal) {
    calcBtn.addEventListener('click', function () {
      calcModal.classList.add('active');
      updateCalc();
    });
  }
  if (calcClose && calcModal) {
    calcClose.addEventListener('click', function () {
      calcModal.classList.remove('active');
    });
  }
  if (calcModal) {
    calcModal.addEventListener('click', function (e) {
      if (e.target === calcModal) calcModal.classList.remove('active');
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && calcModal && calcModal.classList.contains('active')) {
      calcModal.classList.remove('active');
    }
  });

  /* ── Cookie Consent Banner ────────────────── */
  var cookieBanner  = document.getElementById('cookieBanner');
  var cookieAccept  = document.getElementById('cookieAccept');
  var cookieDecline = document.getElementById('cookieDecline');

  if (cookieBanner) {
    var consent = localStorage.getItem('thiha_cookie_consent');
    if (!consent) {
      setTimeout(function () { cookieBanner.classList.add('show'); }, 1200);
    }
    if (cookieAccept) {
      cookieAccept.addEventListener('click', function () {
        localStorage.setItem('thiha_cookie_consent', 'accepted');
        cookieBanner.classList.remove('show');
      });
    }
    if (cookieDecline) {
      cookieDecline.addEventListener('click', function () {
        localStorage.setItem('thiha_cookie_consent', 'declined');
        cookieBanner.classList.remove('show');
      });
    }
  }

  /* ── About page scroll driver ───────────── */
  const aboutScroll = document.getElementById('aboutSectionsScroll');
  const aboutPanels = document.querySelectorAll('.about-panel');
  const aboutDots = document.querySelectorAll('#aboutIndicators .stage-dot');
  const ABOUT_TOTAL = aboutPanels.length;
  let aboutCurrentPanel = -1;
  let aboutLocked = false;

  const activateAboutPanel = (index) => {
    if (index === aboutCurrentPanel) return;
    const prev = aboutCurrentPanel;
    aboutCurrentPanel = index;

    aboutPanels.forEach((panel, i) => {
      panel.classList.remove('active', 'exit');
      if (i === index) {
        panel.classList.add('active');
        // Fly in cards when values panel activates
        if (i === 1) {
          panel.querySelectorAll('.about-card').forEach((card, ci) => {
            card.classList.remove('card-in');
            setTimeout(() => card.classList.add('card-in'), ci * 120);
          });
        }
      } else if (i === prev) {
        panel.classList.add('exit');
        setTimeout(() => panel.classList.remove('exit'), 700);
      }
    });

    aboutDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  if (aboutScroll && aboutPanels.length) {

    const getAboutPanelScroll = (index) => {
      const scrollable = aboutScroll.offsetHeight - window.innerHeight;
      return aboutScroll.offsetTop + (index / (ABOUT_TOTAL - 1)) * scrollable;
    };

    const inAboutStickyZone = () => {
      const rect = aboutScroll.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom >= window.innerHeight;
    };

    const goToAboutPanel = (index) => {
      window.scrollTo({ top: getAboutPanelScroll(index), behavior: 'smooth' });
    };

    let aboutEnteredFromTop = false;

    window.addEventListener('scroll', () => {
      if (!inAboutStickyZone()) {
        const rect = aboutScroll.getBoundingClientRect();
        aboutEnteredFromTop = rect.top > 0;
        return;
      }

      const rect = aboutScroll.getBoundingClientRect();
      const scrollable = aboutScroll.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const index = Math.min(Math.round(progress * (ABOUT_TOTAL - 1)), ABOUT_TOTAL - 1);
      activateAboutPanel(index);

      if (aboutEnteredFromTop) {
        aboutEnteredFromTop = false;
        aboutLocked = true;
        window.scrollTo({ top: getAboutPanelScroll(0), behavior: 'smooth' });
        setTimeout(() => { aboutLocked = false; }, 700);
      }
    }, { passive: true });

    window.addEventListener('wheel', (e) => {
      if (!inAboutStickyZone()) return;
      e.preventDefault();
      if (aboutLocked) return;
      aboutLocked = true;

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = aboutCurrentPanel + direction;

      if (next < 0) {
        window.scrollTo({ top: aboutScroll.offsetTop - window.innerHeight, behavior: 'smooth' });
      } else if (next >= ABOUT_TOTAL) {
        window.scrollTo({ top: aboutScroll.offsetTop + aboutScroll.offsetHeight + 1, behavior: 'smooth' });
      } else {
        goToAboutPanel(next);
      }

      setTimeout(() => { aboutLocked = false; }, 900);
    }, { passive: false });

    aboutDots.forEach((dot, i) => dot.addEventListener('click', () => goToAboutPanel(i)));

    activateAboutPanel(0);
  }

  /* ── Gallery filter + lightbox ───────────── */
  const galFilterBtns = document.querySelectorAll('.gal-filter-btn');
  const galItems = document.querySelectorAll('.gal-item');

  if (galFilterBtns.length) {
    // Staggered fade-in on scroll
    const galObserver = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          // Find index among all visible items for stagger
          const allVisible = [...galItems].filter(item => !item.classList.contains('hidden'));
          const idx = allVisible.indexOf(e.target);
          setTimeout(() => e.target.classList.add('gal-visible'), (idx % 6) * 80);
          galObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    galItems.forEach(item => galObserver.observe(item));

    // Filter
    galFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        galFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galItems.forEach(item => {
          const show = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('hidden', !show);
          // Re-trigger entrance if not yet visible
          if (show && !item.classList.contains('gal-visible')) {
            setTimeout(() => item.classList.add('gal-visible'), 80);
          }
        });
      });
    });
  }

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxCounter = document.getElementById('lightboxCounter');
    let galCurrent = 0;

    const visibleGalItems = () => [...galItems].filter(i => !i.classList.contains('hidden'));

    const openLightbox = (index) => {
      const items = visibleGalItems();
      galCurrent = index;
      const item = items[index];
      const isVideo = item.dataset.type === 'video';
      const src = item.dataset.src;
      lightboxContent.innerHTML = '';
      if (isVideo) {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.className = 'lightbox-media';
        video.innerHTML = `<source src="${src}" type="video/mp4">`;
        lightboxContent.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.className = 'lightbox-media';
        lightboxContent.appendChild(img);
      }
      lightboxCounter.textContent = `${index + 1} / ${items.length}`;
      lightbox.classList.add('active');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightboxContent.innerHTML = '';
    };

    galItems.forEach(item => {
      item.addEventListener('click', () => {
        const items = visibleGalItems();
        const idx = items.indexOf(item);
        if (idx !== -1) openLightbox(idx);
      });
      const vid = item.querySelector('video');
      if (vid) {
        item.addEventListener('mouseenter', () => vid.play());
        item.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
      }
    });

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => {
      const items = visibleGalItems();
      openLightbox((galCurrent - 1 + items.length) % items.length);
    });
    document.getElementById('lightboxNext').addEventListener('click', () => {
      const items = visibleGalItems();
      openLightbox((galCurrent + 1) % items.length);
    });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        const items = visibleGalItems();
        openLightbox((galCurrent - 1 + items.length) % items.length);
      }
      if (e.key === 'ArrowRight') {
        const items = visibleGalItems();
        openLightbox((galCurrent + 1) % items.length);
      }
    });
  }

  

  /* ── FAQ accordion (glass items) ────────── */
  const faqGlassItems = document.querySelectorAll('.faq-glass-item');
  faqGlassItems.forEach(item => {
    const btn = item.querySelector('.faq-glass-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqGlassItems.forEach(f => f.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── FAQ page scroll driver ──────────────── */
  const faqScroll = document.getElementById('faqSectionsScroll');
  const faqPanels = document.querySelectorAll('.faq-panel');
  const faqDots = document.querySelectorAll('#faqIndicators .stage-dot');
  const FAQ_TOTAL = faqPanels.length;
  let faqCurrentPanel = -1;
  let faqLocked = false;

  const activateFaqPanel = (index) => {
    if (index === faqCurrentPanel) return;
    const prev = faqCurrentPanel;
    faqCurrentPanel = index;

    faqPanels.forEach((panel, i) => {
      panel.classList.remove('active', 'exit');
      if (i === index) {
        panel.classList.add('active');
      } else if (i === prev) {
        panel.classList.add('exit');
        setTimeout(() => panel.classList.remove('exit'), 700);
      }
    });

    faqDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  if (faqScroll && faqPanels.length) {

    const getFaqPanelScroll = (index) => {
      const scrollable = faqScroll.offsetHeight - window.innerHeight;
      return faqScroll.offsetTop + (index / (FAQ_TOTAL - 1)) * scrollable;
    };

    const inFaqStickyZone = () => {
      const rect = faqScroll.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom >= window.innerHeight;
    };

    const goToFaqPanel = (index) => {
      window.scrollTo({ top: getFaqPanelScroll(index), behavior: 'smooth' });
    };

    let faqEnteredFromTop = false;

    window.addEventListener('scroll', () => {
      if (!inFaqStickyZone()) {
        const rect = faqScroll.getBoundingClientRect();
        faqEnteredFromTop = rect.top > 0;
        return;
      }

      const rect = faqScroll.getBoundingClientRect();
      const scrollable = faqScroll.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const index = Math.min(Math.round(progress * (FAQ_TOTAL - 1)), FAQ_TOTAL - 1);
      activateFaqPanel(index);

      if (faqEnteredFromTop) {
        faqEnteredFromTop = false;
        faqLocked = true;
        window.scrollTo({ top: getFaqPanelScroll(0), behavior: 'smooth' });
        setTimeout(() => { faqLocked = false; }, 700);
      }
    }, { passive: true });

    window.addEventListener('wheel', (e) => {
      if (!inFaqStickyZone()) return;
      e.preventDefault();
      if (faqLocked) return;
      faqLocked = true;

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = faqCurrentPanel + direction;

      if (next < 0) {
        window.scrollTo({ top: faqScroll.offsetTop - window.innerHeight, behavior: 'smooth' });
      } else if (next >= FAQ_TOTAL) {
        window.scrollTo({ top: faqScroll.offsetTop + faqScroll.offsetHeight + 1, behavior: 'smooth' });
      } else {
        goToFaqPanel(next);
      }

      setTimeout(() => { faqLocked = false; }, 900);
    }, { passive: false });

    faqDots.forEach((dot, i) => dot.addEventListener('click', () => goToFaqPanel(i)));

    activateFaqPanel(0);
  }

  /* ── Book Online scroll driver ───────────── */
  const bookScroll = document.getElementById('bookSectionsScroll');
  const bookPanels = document.querySelectorAll('.book-panel');
  const bookDots = document.querySelectorAll('#bookIndicators .stage-dot');
  const BOOK_TOTAL = bookPanels.length;
  let bookCurrentPanel = -1;
  let bookLocked = false;

  const activateBookPanel = (index) => {
    if (index === bookCurrentPanel) return;
    const prev = bookCurrentPanel;
    bookCurrentPanel = index;

    bookPanels.forEach((panel, i) => {
      panel.classList.remove('active', 'exit');
      if (i === index) {
        panel.classList.add('active');
      } else if (i === prev) {
        panel.classList.add('exit');
        setTimeout(() => panel.classList.remove('exit'), 700);
      }
    });

    bookDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  if (bookScroll && bookPanels.length) {

    const getBookPanelScroll = (index) => {
      const scrollable = bookScroll.offsetHeight - window.innerHeight;
      return bookScroll.offsetTop + (index / (BOOK_TOTAL - 1)) * scrollable;
    };

    const inBookStickyZone = () => {
      const rect = bookScroll.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom >= window.innerHeight;
    };

    const goToBookPanel = (index) => {
      window.scrollTo({ top: getBookPanelScroll(index), behavior: 'smooth' });
    };

    let bookEnteredFromTop = false;

    window.addEventListener('scroll', () => {
      if (!inBookStickyZone()) {
        const rect = bookScroll.getBoundingClientRect();
        bookEnteredFromTop = rect.top > 0;
        return;
      }

      const rect = bookScroll.getBoundingClientRect();
      const scrollable = bookScroll.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const index = Math.min(Math.round(progress * (BOOK_TOTAL - 1)), BOOK_TOTAL - 1);
      activateBookPanel(index);

      if (bookEnteredFromTop) {
        bookEnteredFromTop = false;
        bookLocked = true;
        window.scrollTo({ top: getBookPanelScroll(0), behavior: 'smooth' });
        setTimeout(() => { bookLocked = false; }, 700);
      }
    }, { passive: true });

    window.addEventListener('wheel', (e) => {
      if (!inBookStickyZone()) return;
      e.preventDefault();
      if (bookLocked) return;
      bookLocked = true;

      const direction = e.deltaY > 0 ? 1 : -1;
      const next = bookCurrentPanel + direction;

      if (next < 0) {
        window.scrollTo({ top: bookScroll.offsetTop - window.innerHeight, behavior: 'smooth' });
      } else if (next >= BOOK_TOTAL) {
        window.scrollTo({ top: bookScroll.offsetTop + bookScroll.offsetHeight + 1, behavior: 'smooth' });
      } else {
        goToBookPanel(next);
      }

      setTimeout(() => { bookLocked = false; }, 900);
    }, { passive: false });

    bookDots.forEach((dot, i) => dot.addEventListener('click', () => goToBookPanel(i)));

    activateBookPanel(0);

    // Form submit
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('bookFormWrapper').style.display = 'none';
        document.getElementById('bookSuccessMsg').classList.add('show');
      });
    }

    // Handle nav dropdown "Send an Enquiry" click — works on all pages including book-online itself
    document.querySelectorAll('a[href="book-online.html#enquiry-form"]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.location.pathname.includes('book-online')) {
          e.preventDefault();
          goToBookPanel(1);
        }
      });
    });

    // Handle hash on page load
    if (window.location.hash === '#enquiry-form') {
      setTimeout(() => goToBookPanel(1), 500);
    }
  }

  /* ── Contact form ───────────────────────── */
  const forms = document.querySelectorAll('.thiha-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.textContent='Message Sent ✓'; btn.disabled=true; btn.style.background='#4CAF50'; btn.style.color='#fff'; }
    });
  });

  

  /* ── Spine ──────────────────────────────── */
  const spineFill = document.getElementById('spineFill');
  const spineDot = document.getElementById('spineDot');
  const spineTrack = document.querySelector('.spine-track');
  const hero = document.querySelector('.hero');

  if (spineFill && spineDot && spineTrack) {
    const updateSpine = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
      const onHero = heroBottom > 0;
      spineTrack.style.opacity = onHero ? '0' : '1';
      spineDot.style.opacity = onHero ? '0' : '1';
      spineFill.style.height = (progress * 100) + '%';
      const minY = window.innerHeight * 0.08;
      const maxY = window.innerHeight * 0.92;
      spineDot.style.top = (minY + progress * (maxY - minY)) + 'px';
    };
    window.addEventListener('scroll', updateSpine, { passive: true });
    updateSpine();
  }

  /* ── Fade-in observer (other pages) ─────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    document.documentElement.classList.add('js-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => observer.observe(el));
  }

  /* ── About page card fly-in ─────────────── */
  const aboutCards = document.querySelectorAll('.about-fly-left, .about-fly-right');
  if (aboutCards.length) {
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('card-in'), i * 120);
          aboutObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    aboutCards.forEach(c => aboutObserver.observe(c));
  }

});
/* ============================================================
   DREAM GREEN — Main JavaScript
   Scroll effects, mobile menu, carousel, scroll reveals
   ============================================================ */

(function () {
  'use strict';

  // ─── DOM References ──────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');
  const bestsellersTrack = document.getElementById('bestsellersTrack');
  const scrollLeftBtn = document.getElementById('scrollLeft');
  const scrollRightBtn = document.getElementById('scrollRight');
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  // ─── Navbar Scroll Effect ────────────────────────────────
  let lastScroll = 0;
  let ticking = false;

  function handleNavbarScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(handleNavbarScroll);
      ticking = true;
    }
  }, { passive: true });


  // ─── Mobile Menu ─────────────────────────────────────────
  let menuOpen = false;

  function toggleMobileMenu() {
    menuOpen = !menuOpen;
    hamburgerBtn.classList.toggle('active', menuOpen);
    mobileNav.classList.toggle('open', menuOpen);
    
    // Add class to navbar to hide pill background in menu mode
    navbar.classList.toggle('menu-open', menuOpen);
    
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  hamburgerBtn.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (menuOpen) {
        toggleMobileMenu();
      }
    });
  });


  // ─── Smooth Scroll for Anchor Links ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });


  // ─── Scroll Reveal (IntersectionObserver) ────────────────
  var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  // ─── Bestsellers Horizontal Scroll ───────────────────────
  var scrollAmount = 300;

  if (scrollLeftBtn && scrollRightBtn && bestsellersTrack) {
    scrollLeftBtn.addEventListener('click', function () {
      bestsellersTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', function () {
      bestsellersTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Hide/show arrows based on scroll position
    function updateArrowVisibility() {
      var maxScroll = bestsellersTrack.scrollWidth - bestsellersTrack.clientWidth;
      scrollLeftBtn.style.opacity = bestsellersTrack.scrollLeft > 10 ? '1' : '0';
      scrollLeftBtn.style.pointerEvents = bestsellersTrack.scrollLeft > 10 ? 'auto' : 'none';
      scrollRightBtn.style.opacity = bestsellersTrack.scrollLeft < maxScroll - 10 ? '1' : '0';
      scrollRightBtn.style.pointerEvents = bestsellersTrack.scrollLeft < maxScroll - 10 ? 'auto' : 'none';
    }

    bestsellersTrack.addEventListener('scroll', updateArrowVisibility, { passive: true });
    
    // Initial state
    updateArrowVisibility();
  }


  // ─── Newsletter Form ─────────────────────────────────────
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      var emailInput = document.getElementById('newsletterEmail');
      var email = emailInput.value.trim();
      
      if (email && email.indexOf('@') > 0) {
        // Hide form, show success
        newsletterForm.style.display = 'none';
        newsletterSuccess.classList.add('show');
        
        // Also hide the fine print
        var finePrint = newsletterForm.parentElement.querySelector('.newsletter__fine-print');
        if (finePrint) finePrint.style.display = 'none';
      }
    });
  }


  // ─── Parallax-lite for About Section ─────────────────────
  var aboutSection = document.querySelector('.about-snippet');
  
  if (aboutSection && window.innerWidth > 768) {
    window.addEventListener('scroll', function () {
      var rect = aboutSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        var scrolled = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        var yPos = (scrolled - 0.5) * 60;
        aboutSection.style.backgroundPositionY = 'calc(50% + ' + yPos + 'px)';
      }
    }, { passive: true });
  }


  // ─── Add to Gift Button Micro-interaction ────────────────
  document.querySelectorAll('.product-card__add-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var originalText = this.textContent;
      this.textContent = '✓ Added!';
      this.style.backgroundColor = '#6e8e69';
      
      var self = this;
      setTimeout(function () {
        self.textContent = originalText;
        self.style.backgroundColor = '';
      }, 1500);

      // Update cart count
      var cartCount = document.querySelector('.navbar__cart-count');
      if (cartCount) {
        var count = parseInt(cartCount.textContent) + 1;
        cartCount.textContent = count;
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(function () {
          cartCount.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });


  // ─── Preload Hero Image (critical LCP element) ──────────
  var heroImg = document.querySelector('.hero__image img');
  if (heroImg && !heroImg.complete) {
    heroImg.addEventListener('load', function () {
      this.style.opacity = '1';
    });
  }

})();

/* ============================================================
   DREAM GREEN — Shared Components
   Renders navbar, footer, and common utilities on every page
   ============================================================ */

var DreamGreenComponents = (function () {
  'use strict';

  var leafSVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>';

  function renderNavbar() {
    var count = typeof DreamGreenCart !== 'undefined' ? DreamGreenCart.getTotalItems() : 0;
    var settings = DreamGreenData.settings || {};
    var storeName = settings.storeName || 'Dream Green';

    var user = typeof firebase !== 'undefined' ? firebase.auth().currentUser : null;
    var authLink = user 
      ? '<a href="account.html" class="navbar__icon-btn" aria-label="Account">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
        '</a>'
      : '<a href="login.html" class="navbar__link" style="font-size:0.85rem; font-weight:600;">Login</a>';

    var html = '<nav class="navbar reveal-down" id="navbar">' +
      '<div class="container navbar__inner">' +
        '<a href="index.html" class="navbar__logo">' +
          '<img src="assets/images/logo.png" alt="Dream Green Logo" class="navbar__logo-img">' +
          '<span class="navbar__logo-text">' + storeName + '</span>' +
        '</a>' +
        '<div class="navbar__links">' +
          '<a href="shop.html">Shop</a>' +
          '<a href="index.html#collections">Collections</a>' +
          '<a href="index.html#how-it-works">How It Works</a>' +
          '<a href="blog.html">Blog</a>' +
        '</div>' +
        '<div class="navbar__actions">' +
          authLink +
          '<a href="cart.html" class="navbar__icon-btn" aria-label="Cart">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
            '<span class="navbar__cart-count" id="navCartCount">' + count + '</span>' +
          '</a>' +
          '<a href="shop.html" class="btn btn--primary btn--small navbar__cta">Send a Gift</a>' +
          '<button class="navbar__hamburger" id="hamburgerBtn" aria-label="Menu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</nav>' +
    '<div class="mobile-nav" id="mobileNav">' +
      '<a href="shop.html" data-mobile-link>Shop</a>' +
      '<a href="index.html#collections" data-mobile-link>Gift Collections</a>' +
      '<a href="index.html#how-it-works" data-mobile-link>How It Works</a>' +
      '<a href="about.html" data-mobile-link>About Us</a>' +
      '<a href="blog.html" data-mobile-link>Blog</a>' +
      (user ? '<a href="account.html" data-mobile-link>My Account</a>' : '<a href="login.html" data-mobile-link>Login</a>') +
      '<a href="cart.html" class="btn btn--primary" data-mobile-link>View Cart (' + count + ')</a>' +
    '</div>';
    return html;
  }

  function renderFooter() {
    var settings = DreamGreenData.settings || {};
    var config = window.DreamGreenConfig || {};
    var storeName = config.storeName || settings.storeName || 'Dream Green';
    var footerText = settings.footerText || 'Give Green. Give Life. Curated plant gifts delivered with love across Surat, Gujarat.';
    var email = config.contactEmail || settings.contactEmail || 'dreamgreennn@gmail.com';
    var phone = config.contactPhone || settings.contactPhone || '+91 9898081729';
    var address = config.address || settings.contactAddress || 'Surat, Gujarat, India';
    var insta = config.instagramUrl || settings.instagramUrl || '#';
    var fb = config.facebookUrl || settings.facebookUrl || '#';
    var whatsappNum = config.whatsappNumber || settings.whatsappNumber || '+91 9898081729';
    var whatsapp = 'https://wa.me/' + whatsappNum.replace(/\+/g, '').replace(/\s/g, '');

    return '<footer class="footer" id="footer">' +
      '<div class="container">' +
        '<div class="footer__grid">' +
          '<div>' +
            '<a href="index.html" class="footer__logo">' +
              '<img src="assets/images/logo.png" alt="Logo" class="footer__logo-img">' +
              ' ' + storeName +
            '</a>' +
            '<p class="footer__brand-desc">' + footerText + '</p>' +
            '<div class="footer__socials">' +
              '<a href="' + insta + '" class="footer__social-link" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>' +
              '<a href="' + whatsapp + '" class="footer__social-link" aria-label="WhatsApp"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg></a>' +
              '<a href="' + fb + '" class="footer__social-link" aria-label="Facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg></a>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<h4 class="footer__heading">Shop</h4>' +
            '<ul class="footer__links">' +
              '<li><a href="shop.html">All Plants</a></li>' +
              (DreamGreenData.collections || []).slice(0, 5).map(function (c) {
                var linkId = c.id || c.firebaseId;
                return '<li><a href="collection.html?id=' + linkId + '" onclick="DreamGreenComponents.navigateToCollection(\'' + linkId + '\')">' + c.name + '</a></li>';
              }).join('') +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4 class="footer__heading">Help</h4>' +
            '<ul class="footer__links">' +
              '<li><a href="index.html#how-it-works">How It Works</a></li>' +
              '<li><a href="about.html#delivery">Delivery & Shipping</a></li>' +
              '<li><a href="blog.html?post=beginner-indoor-plant-care">Care Instructions</a></li>' +
              '<li><a href="about.html#delivery">Returns & Refunds</a></li>' +
              '<li><a href="about.html#faq">FAQs</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h4 class="footer__heading">Contact</h4>' +
            '<div class="footer__contact-item"><span>📧</span><span>' + email + '</span></div>' +
            '<div class="footer__contact-item"><span>📞</span><span>' + phone + '</span></div>' +
            '<div class="footer__contact-item"><span>📍</span><span>' + address + '</span></div>' +
            '<a href="' + whatsapp + '" class="footer__whatsapp-btn">💬 Chat on WhatsApp</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer__bottom">' +
          '<span class="footer__copyright">© 2025 ' + storeName + '. All rights reserved.</span>' +
          '<div class="footer__legal">' +
            '<a href="about.html">Privacy Policy</a>' +
            '<a href="about.html">Terms of Service</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  function initNavbar() {
    var navbar = document.getElementById('navbar');
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var mobileNav = document.getElementById('mobileNav');
    if (!navbar || !hamburgerBtn) return;

    var menuOpen = false;
    var ticking = false;

    function updateNavbar() {
      if (window.pageYOffset > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Apply immediately on load
    updateNavbar();

    // Scroll effect
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateNavbar();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Mobile menu
    hamburgerBtn.addEventListener('click', function () {
      menuOpen = !menuOpen;
      hamburgerBtn.classList.toggle('active', menuOpen);
      mobileNav.classList.toggle('open', menuOpen);
      
      // Fix: Toggle menu-open on navbar for Z-index and layout
      navbar.classList.toggle('menu-open', menuOpen);
      
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });

    document.querySelectorAll('[data-mobile-link]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (menuOpen) {
          menuOpen = false;
          hamburgerBtn.classList.remove('active');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    // Cart count updates
    if (typeof DreamGreenCart !== 'undefined') {
      DreamGreenCart.onChange(function () {
        var countEl = document.getElementById('navCartCount');
        if (countEl) {
          var c = DreamGreenCart.getTotalItems();
          countEl.textContent = c;
          countEl.style.transform = 'scale(1.3)';
          setTimeout(function () { countEl.style.transform = 'scale(1)'; }, 200);
        }
      });
    }
  }

  function initScrollReveals() {
    var elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      elements.forEach(function (el) { observer.observe(el); });
    } else {
      elements.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a[href*="#"]');
      if (!anchor) return;
      var href = anchor.getAttribute('href');
      // Only handle same-page hash links
      if (href.indexOf('#') === -1) return;
      var parts = href.split('#');
      var page = parts[0];
      var hash = parts[1];
      if (!hash) return;
      // If link has a page path and it's not the current page, let browser navigate
      if (page && !window.location.pathname.endsWith(page)) return;
      var target = document.getElementById(hash);
      if (target) {
        e.preventDefault();
        var offset = 80;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - offset,
          behavior: 'smooth'
        });
      }
    });
  }

  function renderStars(rating) {
    var stars = '';
    for (var i = 1; i <= 5; i++) {
      stars += i <= rating ? '★' : '☆';
    }
    return stars;
  }

  function formatPrice(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return 'Price on Request';
    return '₹' + Number(amount).toLocaleString('en-IN');
  }

  function renderProductCard(product) {
    if (!product) return '';
    var price = product.price || 0;
    var originalPrice = product.originalPrice || 0;
    var hasDiscount = originalPrice > price;
    var discountAmount = hasDiscount ? originalPrice - price : 0;

    var priceHTML = '<span class="product-card__price">' + formatPrice(price) + '</span>';
    if (hasDiscount) {
      priceHTML += '<span class="product-card__original-price">' + formatPrice(originalPrice) + '</span>';
    }

    var discountBadge = hasDiscount 
      ? '<div class="product-card__discount-badge">SAVE ' + formatPrice(discountAmount) + '</div>' 
      : '';

    var linkId = product.id || product.firebaseId || product.slug;
    var metaInfo = (product.size || 'Standard') + ' | ' + (product.potType || 'Nursery Pot');

    return '<div class="product-card" data-product-id="' + linkId + '" onclick="DreamGreenComponents.navigateToProduct(\'' + linkId + '\')">' +
      '<div class="product-card__image-wrap">' +
        '<img src="' + (product.image || 'assets/images/placeholder.png') + '" alt="' + (product.name || 'Plant') + '" loading="lazy" width="280" height="280">' +
        (product.tag ? '<span class="product-card__tag">' + product.tag + '</span>' : '') +
        discountBadge +
      '</div>' +
      '<div class="product-card__info">' +
        '<div class="product-card__meta">' + metaInfo + '</div>' +
        '<h3 class="product-card__name">' + (product.name || 'Unnamed Plant') + '</h3>' +
        '<div class="product-card__rating">' + renderStars(product.rating || 5) + ' <span>(' + (product.reviews || 0) + ' reviews)</span></div>' +
        '<div class="product-card__bottom">' +
          '<div class="product-card__price-group">' + priceHTML + '</div>' +
          '<button type="button" class="product-card__add-btn" aria-label="Add to Cart" data-add-to-cart="' + linkId + '">Add</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function navigateToProduct(id) {
    if (!id) return;
    try {
      sessionStorage.setItem('last_viewed_product_id', id.toString());
    } catch(e) {}
    window.location.href = 'product.html?id=' + id;
  }

  function initAddToCartButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add-to-cart]');
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      var productId = btn.getAttribute('data-add-to-cart');
      if (!productId) return;

      DreamGreenCart.addItem(productId, 1);

      var originalText = btn.textContent;
      btn.textContent = '✓ Added!';
      btn.style.backgroundColor = '#6e8e69';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.disabled = false;
      }, 1500);
    });
  }

  return {
    renderNavbar: renderNavbar,
    renderFooter: renderFooter,
    initNavbar: initNavbar,
    initScrollReveals: initScrollReveals,
    initSmoothScroll: initSmoothScroll,
    initAddToCartButtons: initAddToCartButtons,
    renderStars: renderStars,
    formatPrice: formatPrice,
    renderProductCard: renderProductCard,
    navigateToProduct: navigateToProduct,
    navigateToCollection: function (id) {
      if (!id) return;
      try {
        sessionStorage.setItem('last_viewed_collection_id', id.toString());
      } catch(e) {}
      window.location.href = 'collection.html?id=' + id;
    },

    /** Initialize page — call this on every page after DOM loads */
    initPage: function (options) {
      options = options || {};

      // Inject navbar and footer if placeholders exist
      if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged(function (user) {
          var navSlot = document.getElementById('nav-slot');
          if (navSlot) {
            navSlot.innerHTML = renderNavbar();
            initNavbar();
          }
        });
      }

      var navSlot = document.getElementById('nav-slot');
      var footerSlot = document.getElementById('footer-slot');
      if (navSlot) navSlot.innerHTML = renderNavbar();
      if (footerSlot) footerSlot.innerHTML = renderFooter();

      initNavbar();
      // Dismiss preloader if exists
    var preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(function() {
        preloader.classList.add('loaded');
        initScrollReveals();
        setTimeout(function() { preloader.style.display = 'none'; }, 1000);
      }, 500); 
    } else {
      initScrollReveals();
    }
      initSmoothScroll();
      initAddToCartButtons();

      if (typeof options.onReady === 'function') {
        try {
          options.onReady();
        } catch (err) {
          console.error('Dream Green onReady error:', err);
        }
      }
    }
  };
})();

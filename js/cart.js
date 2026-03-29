/* ============================================================
   DREAM GREEN — Cart System (localStorage)
   Add, remove, update, persist across pages
   ============================================================ */

var DreamGreenCart = (function () {
  'use strict';

  var CART_KEY = 'dreamgreen_cart';
  var listeners = [];

  function getCart() {
    try {
      var data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) { /* silent fail */ }
    notifyListeners();
  }

  function notifyListeners() {
    var cart = getCart();
    listeners.forEach(function (fn) { fn(cart); });
  }

  return {
    /** Get all cart items */
    getItems: function () {
      return getCart();
    },

    /** Add item or increment qty */
    addItem: function (productId, qty) {
      qty = qty || 1;
      var cart = getCart();
      var searchId = productId.toString();
      var existing = cart.find(function (item) { return item.id.toString() === searchId; });
      if (existing) {
        existing.qty += qty;
      } else {
        cart.push({ id: productId, qty: qty });
      }
      saveCart(cart);
    },

    /** Remove item completely */
    removeItem: function (productId) {
      var searchId = productId.toString();
      var cart = getCart().filter(function (item) { return item.id.toString() !== searchId; });
      saveCart(cart);
    },

    /** Update quantity for an item */
    updateQty: function (productId, qty) {
      if (qty <= 0) {
        this.removeItem(productId);
        return;
      }
      var cart = getCart();
      var searchId = productId.toString();
      var item = cart.find(function (i) { return i.id.toString() === searchId; });
      if (item) {
        item.qty = qty;
        saveCart(cart);
      }
    },

    /** Clear entire cart */
    clear: function () {
      saveCart([]);
    },

    /** Total number of items */
    getTotalItems: function () {
      return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
    },

    /** Total price (needs DreamGreenData) */
    getTotalPrice: function () {
      var cart = getCart();
      var total = 0;
      cart.forEach(function (item) {
        var product = DreamGreenData.getProduct(item.id);
        if (product) {
          total += product.price * item.qty;
        }
      });
      return total;
    },

    /** Total savings */
    getTotalSavings: function () {
      var cart = getCart();
      var savings = 0;
      cart.forEach(function (item) {
        var product = DreamGreenData.getProduct(item.id);
        if (product && product.originalPrice) {
          savings += (product.originalPrice - product.price) * item.qty;
        }
      });
      return savings;
    },

    /** Get full cart details (items with product info) */
    getCartDetails: function () {
      var cart = getCart();
      return cart.map(function (item) {
        var product = DreamGreenData.getProduct(item.id);
        return product ? {
          id: item.id,
          qty: item.qty,
          product: product,
          subtotal: product.price * item.qty
        } : null;
      }).filter(Boolean);
    },

    /** Subscribe to cart changes */
    onChange: function (fn) {
      listeners.push(fn);
    },

    /** Check if item is in cart */
    hasItem: function (productId) {
      var searchId = productId.toString();
      return getCart().some(function (item) { return item.id.toString() === searchId; });
    }
  };
})();

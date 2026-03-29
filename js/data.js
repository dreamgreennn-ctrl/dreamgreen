/* ============================================================
   DREAM GREEN — Product Data Catalog
   All products, collections, and blog data
   ============================================================ */

var DreamGreenData = (function () {
  'use strict';

  // Cache Configuration
  var CACHE_KEY = 'dreamgreen_data_v2';
  var CACHE_TTL = 300000; // 5 Minutes in milliseconds (Reduced from 1 Hour for better dev experience)

  var seedProducts = [
    {
      id: 1,
      name: 'Peace Lily Gift Box',
      slug: 'peace-lily-gift-box',
      price: 699,
      originalPrice: 899,
      image: 'assets/images/product-peace-lily.png',
      tag: 'Best for Birthdays',
      rating: 5,
      reviews: 128,
      category: 'flowering',
      occasions: ['birthday', 'anniversary', 'self-care'],
      size: 'Medium',
      potType: 'White Ceramic',
      description: 'The Peace Lily is a timeless symbol of serenity and care. This elegant plant arrives in our signature Dream Green gift box with kraft paper wrapping, a raffia ribbon, a care card, and your personalized message.',
      careInfo: {
        light: 'Low to medium indirect light',
        water: 'Water once a week, keep soil moist',
        difficulty: 'Easy — perfect for beginners'
      },
      features: [
        'Air-purifying plant — removes toxins',
        'Beautiful white blooms throughout the year',
        'Comes in a premium white ceramic pot',
        'Includes care card and personalized message',
        'Gift-wrapped in our signature Dream Green box'
      ],
      inStock: true
    },
    {
      id: 2,
      name: 'Snake Plant Premium',
      slug: 'snake-plant-premium',
      price: 599,
      originalPrice: 799,
      image: 'assets/images/product-snake-plant.png',
      tag: 'Most Popular',
      rating: 5,
      reviews: 94,
      category: 'indoor',
      occasions: ['housewarming', 'corporate', 'self-care'],
      size: 'Medium-Large',
      potType: 'Terracotta Ceramic',
      description: 'The Snake Plant is the ultimate low-maintenance gift. Hardy, striking, and almost impossible to kill — it\'s perfect for anyone, even those without a green thumb. A statement piece for any room.',
      careInfo: {
        light: 'Thrives in any light condition',
        water: 'Water every 2–3 weeks',
        difficulty: 'Very Easy — nearly indestructible'
      },
      features: [
        'NASA-approved air purifier',
        'Releases oxygen at night — great for bedrooms',
        'Tall, architectural look in terracotta pot',
        'Drought-tolerant — perfect for busy people',
        'Gift-wrapped in our signature Dream Green box'
      ],
      inStock: true
    },
    {
      id: 3,
      name: 'Jade Plant Gift Set',
      slug: 'jade-plant-gift-set',
      price: 449,
      originalPrice: 599,
      image: 'assets/images/product-jade-plant.png',
      tag: 'Good Luck Charm',
      rating: 4,
      reviews: 76,
      category: 'succulent',
      occasions: ['housewarming', 'festive', 'corporate'],
      size: 'Small',
      potType: 'Sage Green Ceramic',
      description: 'Known as the "Money Plant" in many cultures, the Jade Plant symbolizes prosperity and good fortune. Its plump, vibrant leaves make it a charming desk companion or windowsill beauty.',
      careInfo: {
        light: 'Bright indirect to direct sunlight',
        water: 'Water when soil is completely dry',
        difficulty: 'Easy — just don\'t overwater'
      },
      features: [
        'Symbol of prosperity and good luck',
        'Compact size perfect for desks and shelves',
        'Beautiful sage green ceramic pot',
        'Long-lived — can grow for decades',
        'Gift-wrapped in our signature Dream Green box'
      ],
      inStock: true
    },
    {
      id: 4,
      name: 'Money Plant Macramé',
      slug: 'money-plant-macrame',
      price: 549,
      originalPrice: 749,
      image: 'assets/images/product-money-plant.png',
      tag: 'Housewarming Pick',
      rating: 5,
      reviews: 112,
      category: 'indoor',
      occasions: ['housewarming', 'birthday', 'self-care'],
      size: 'Medium',
      potType: 'Macramé Hanger',
      description: 'A gorgeous cascading Money Plant (Pothos) in a handwoven macramé hanger. This boho-chic gift adds instant warmth and greenery to any space. One of our all-time bestsellers.',
      careInfo: {
        light: 'Low to bright indirect light',
        water: 'Water once a week',
        difficulty: 'Very Easy — grows anywhere'
      },
      features: [
        'Handwoven cotton macramé hanger included',
        'Heart-shaped leaves that cascade beautifully',
        'Excellent air-purifying properties',
        'Grows quickly — perfect for trailing displays',
        'Gift-wrapped in our signature Dream Green box'
      ],
      inStock: true
    },
    {
      id: 5,
      name: 'Mini Succulent Trio',
      slug: 'mini-succulent-trio',
      price: 399,
      originalPrice: 549,
      image: 'assets/images/product-succulent-set.png',
      tag: 'Desk Friendly',
      rating: 5,
      reviews: 203,
      category: 'succulent',
      occasions: ['birthday', 'corporate', 'self-care'],
      size: 'Mini',
      potType: 'Matching Ceramic Trio',
      description: 'Three adorable succulents in matching ceramic pots — sage, terracotta, and cream. Perfect for a desk, shelf, or windowsill. A delightful gift for anyone who loves tiny green things.',
      careInfo: {
        light: 'Bright indirect to direct light',
        water: 'Water every 10–14 days',
        difficulty: 'Very Easy — low maintenance'
      },
      features: [
        'Set of 3 unique succulent varieties',
        'Matching ceramic pots in three colors',
        'Compact and adorable for small spaces',
        'Extremely low maintenance',
        'Gift-wrapped in our signature Dream Green box'
      ],
      inStock: true
    },
    {
      id: 6,
      name: 'Lucky Bamboo Gift Vase',
      slug: 'lucky-bamboo-gift-vase',
      price: 499,
      originalPrice: 649,
      image: 'assets/images/product-bamboo.png',
      tag: 'Corporate Favourite',
      rating: 4,
      reviews: 89,
      category: 'indoor',
      occasions: ['corporate', 'festive', 'housewarming'],
      size: 'Medium',
      potType: 'Glass Vase with Pebbles',
      description: 'An elegant arrangement of Lucky Bamboo stalks in a clear glass vase with decorative pebbles. Symbolizes luck, health, and happiness — the perfect gift for any occasion.',
      careInfo: {
        light: 'Low to moderate indirect light',
        water: 'Keep roots submerged in water, change weekly',
        difficulty: 'Very Easy — just keep water fresh'
      },
      features: [
        'Symbol of luck, health, and prosperity',
        'Clean, modern look in glass vase',
        'Grows in water — no soil needed',
        'Decorative pebbles included',
        'Gift-wrapped in our signature Dream Green box'
      ],
      inStock: true
    },
    {
      id: 7,
      name: 'Areca Palm Statement',
      slug: 'areca-palm-statement',
      price: 899,
      originalPrice: 1199,
      image: 'assets/images/product-money-plant.png',
      tag: 'Premium Gift',
      rating: 5,
      reviews: 67,
      category: 'indoor',
      occasions: ['anniversary', 'housewarming'],
      size: 'Large',
      potType: 'White Ceramic Planter',
      description: 'The Areca Palm makes a grand statement — lush, tropical, and absolutely stunning. A premium gift that transforms any room into a tropical retreat.',
      careInfo: {
        light: 'Bright indirect light',
        water: 'Water twice a week, keep soil moist',
        difficulty: 'Moderate — needs regular care'
      },
      features: [
        'Tall tropical plant — instant room makeover',
        'Excellent natural humidifier',
        'Premium white ceramic planter',
        'Great for living rooms and offices',
        'Gift-wrapped in our signature Dream Green box'
      ],
      inStock: true
    },
    {
      id: 8,
      name: 'Rose Plant Gift Box',
      slug: 'rose-plant-gift-box',
      price: 749,
      originalPrice: 999,
      image: 'assets/images/product-peace-lily.png',
      tag: 'Anniversary Special',
      rating: 5,
      reviews: 156,
      category: 'flowering',
      occasions: ['anniversary', 'birthday'],
      size: 'Medium',
      potType: 'Blush Ceramic',
      description: 'A beautiful miniature rose plant in a blush ceramic pot. Unlike cut flowers, this living gift blooms again and again — a reminder of your love that grows over time.',
      careInfo: {
        light: 'Bright direct sunlight (4+ hours)',
        water: 'Water every 2 days, keep soil moist',
        difficulty: 'Moderate — needs sunshine and love'
      },
      features: [
        'Living roses that bloom repeatedly',
        'Beautiful blush ceramic pot',
        'Lasts years, not days like cut flowers',
        'Romantic and meaningful gift',
        'Gift-wrapped in our signature Dream Green box'
      ],
      inStock: true
    },
    {
      id: 9,
      name: 'Lavender Calm Set',
      slug: 'lavender-calm-set',
      price: 649,
      originalPrice: 849,
      image: 'assets/images/product-jade-plant.png',
      tag: 'Self-Care Hero',
      rating: 5,
      reviews: 91,
      category: 'flowering',
      occasions: ['self-care', 'birthday'],
      size: 'Small-Medium',
      potType: 'Terracotta',
      description: 'A fragrant lavender plant paired with a scented candle — the ultimate self-care gift. The soothing aroma reduces stress and promotes relaxation.',
      careInfo: {
        light: 'Full sun (6+ hours direct light)',
        water: 'Water when top soil is dry',
        difficulty: 'Moderate — loves sunshine'
      },
      features: [
        'Beautiful fragrant lavender plant',
        'Comes with a matching lavender scented candle',
        'Natural stress reliever and mood booster',
        'Rustic terracotta pot',
        'Gift-wrapped in our signature Dream Green box'
      ],
      inStock: true
    },
    {
      id: 10,
      name: 'Terrarium Gift Dome',
      slug: 'terrarium-gift-dome',
      price: 999,
      originalPrice: 1299,
      image: 'assets/images/product-succulent-set.png',
      tag: 'Unique Gift',
      rating: 5,
      reviews: 48,
      category: 'succulent',
      occasions: ['birthday', 'anniversary', 'corporate'],
      size: 'Small',
      potType: 'Glass Dome',
      description: 'A stunning miniature terrarium in a glass dome — a self-contained tiny world of succulents, moss, and decorative stones. A truly unique and memorable gift.',
      careInfo: {
        light: 'Bright indirect light',
        water: 'Mist once every 2 weeks',
        difficulty: 'Very Easy — almost self-sustaining'
      },
      features: [
        'Handcrafted glass dome terrarium',
        'Self-sustaining mini ecosystem',
        'Decorative moss, pebbles, and sand',
        'Unique — no two are exactly alike',
        'Gift-wrapped in our signature Dream Green box'
      ],
      inStock: true
    }
  ];

  var seedCollections = [
    {
      id: 'birthday',
      name: 'Birthday Blooms',
      emoji: '🎂',
      description: 'Make their day unforgettable',
      longDescription: 'Birthdays deserve gifts that last longer than a day. Our Birthday Blooms collection features vibrant, cheerful plants that grow alongside beautiful memories. Each one arrives gift-wrapped and ready to surprise.',
      image: 'assets/images/collection-birthday.png'
    },
    {
      id: 'housewarming',
      name: 'Housewarming Greens',
      emoji: '🏠',
      description: 'The perfect welcome-home gift',
      longDescription: 'Nothing says "welcome home" like a living, breathing plant. Our Housewarming Greens are hand-selected for their beauty and resilience — perfect for new spaces and fresh beginnings.',
      image: 'assets/images/collection-housewarming.png'
    },
    {
      id: 'anniversary',
      name: 'Anniversary Plants',
      emoji: '💍',
      description: 'Love that grows with time',
      longDescription: 'Just like love, these plants grow stronger with time. Our Anniversary collection features elegant, romantic plants that symbolize growth, beauty, and lasting commitment.',
      image: 'assets/images/collection-anniversary.png'
    },
    {
      id: 'self-care',
      name: 'Self-Care Collection',
      emoji: '🧘',
      description: 'For the one who deserves it most',
      longDescription: 'Sometimes the best gift is the one you give yourself — or someone you love. Our Self-Care collection pairs calming, air-purifying plants with wellness accessories for the ultimate relaxation gift.',
      image: 'assets/images/collection-selfcare.png'
    },
    {
      id: 'corporate',
      name: 'Corporate Gifting',
      emoji: '💼',
      description: 'Impress clients, inspire teams',
      longDescription: 'Elevate your corporate gifting game with living green plants. Perfect for employee milestones, client appreciation, and office spaces. Bulk orders welcome with custom branding options.',
      image: 'assets/images/collection-corporate.png'
    },
    {
      id: 'festive',
      name: 'Festive Gifting',
      emoji: '🎄',
      description: 'Seasonal specials for every celebration',
      longDescription: 'From Diwali to Christmas, from Navratri to New Year — our Festive Gifting collection brings green joy to every celebration with specially curated seasonal plant gifts.',
      image: 'assets/images/collection-festive.png'
    }
  ];

  var seedBlogPosts = [
    {
      id: 1,
      slug: '5-plants-birthday-gift',
      title: '5 Plants That Make the Perfect Birthday Gift',
      tag: 'Gifting Ideas',
      excerpt: 'From flowering beauties to low-maintenance succulents — here are our top picks for birthday gifting that will last much longer than a bouquet.',
      image: 'assets/images/blog-birthday-plants.png',
      date: 'February 15, 2025',
      readTime: '5 min read',
      content: '<p>When it comes to birthday gifts, flowers are the classic choice — but what if you could give something that lasts years instead of days? Plants are the new flowers, and they make incredibly thoughtful birthday presents. Here at Dream Green in Surat, we\'ve helped thousands of people send the perfect plant gift.</p>' +
        '<h3>1. Peace Lily — The Elegant Classic</h3>' +
        '<p>With its graceful white blooms and deep green leaves, the Peace Lily is like giving someone a living bouquet. It thrives in low light and purifies the air — a gift that keeps giving. We include it in our signature kraft paper box with a care card, making it one of our most popular choices for birthday delivery across Surat.</p>' +
        '<h3>2. Succulent Trio — For the Minimalist</h3>' +
        '<p>Three tiny succulents in matching pots make an adorable desk setup. They need almost no care and look stunning all year round. These are perfect for friends who claim they "can\'t keep plants alive" — succulents are almost impossible to kill!</p>' +
        '<h3>3. Money Plant in Macramé — Boho Vibes</h3>' +
        '<p>A trailing pothos in a handwoven macramé hanger adds instant character to any room. It grows quickly, brings good vibes, and according to many cultures, attracts prosperity. This is our #1 housewarming-cum-birthday gift in Surat.</p>' +
        '<h3>4. Rose Plant — The Romantic One</h3>' +
        '<p>Unlike cut roses that wilt in a week, a rose plant blooms again and again. Perfect for someone special — every time it flowers, they\'ll remember who gifted it. Our rose plants come in beautiful blush ceramic pots.</p>' +
        '<h3>5. Terrarium Dome — The Unique Surprise</h3>' +
        '<p>A glass dome terrarium is a gift they\'ll never forget. Each one is handcrafted with succulents, moss, and decorative stones. It\'s a conversation starter on any shelf and requires almost no maintenance.</p>' +
        '<h3>How to Order</h3>' +
        '<p>All our birthday gifts come with our signature Dream Green packaging — kraft paper, raffia ribbon, care card, and your personalized message. Same-day delivery available across Surat, Gujarat. Order before 2 PM for same-day delivery!</p>'
    },
    {
      id: 2,
      slug: 'beginner-indoor-plant-care',
      title: 'How to Care for Your New Indoor Plant — Beginner\'s Guide',
      tag: 'Plant Care',
      excerpt: 'Just received a plant gift? Here\'s everything you need to know about watering, sunlight, and keeping your new green friend happy and thriving.',
      image: 'assets/images/blog-plant-care.png',
      date: 'January 28, 2025',
      readTime: '7 min read',
      content: '<p>So someone gave you a beautiful plant — congratulations! Whether you\'re a total beginner or just want to make sure your new green friend thrives, this guide covers everything you need to know. This is based on our experience delivering over 5,000 plant gifts across Surat.</p>' +
        '<h3>Rule 1: Don\'t Overwater</h3>' +
        '<p>The number one cause of indoor plant death is overwatering. Most houseplants prefer their soil to dry out slightly between waterings. Stick your finger an inch into the soil — if it\'s dry, water it. If it\'s moist, wait. In Surat\'s humid climate, you might need to water less frequently, especially during monsoon season.</p>' +
        '<h3>Rule 2: Light Matters</h3>' +
        '<p>Different plants need different light. Low-light plants like pothos and snake plants do great in dim corners. Succulents and flowering plants need bright, direct light. Check the care card that came with your Dream Green gift — it has specific instructions for your plant!</p>' +
        '<h3>Rule 3: Drainage is Key</h3>' +
        '<p>Make sure your pot has drainage holes. Standing water in the bottom of a pot leads to root rot, which is almost always fatal for houseplants. All Dream Green pots come with proper drainage built in.</p>' +
        '<h3>Rule 4: Don\'t Move It Too Much</h3>' +
        '<p>Plants take time to adjust to new environments. Once you find a good spot, leave your plant there for at least 2-3 weeks before moving it again. They get stressed by constant relocation — just like we do!</p>' +
        '<h3>Rule 5: Watch for Signs</h3>' +
        '<p>Yellow leaves usually mean overwatering. Brown, crispy edges mean underwatering or too much direct sun. Drooping can mean either too much or too little water. Learn to read your plant\'s signals and you\'ll become a pro in no time.</p>' +
        '<h3>Need Help?</h3>' +
        '<p>If you\'re in Surat and your plant isn\'t doing well, WhatsApp us a photo at +91 9898081729. We\'re always happy to help with plant care tips! Remember, we offer a 7-day live plant guarantee on all our gifts.</p>'
    },
    {
      id: 3,
      slug: 'plants-vs-flowers-gifting',
      title: 'Why Gifting Plants is the New Gifting Flowers',
      tag: 'Inspiration',
      excerpt: 'Flowers wilt in days. Plants grow for years. Discover why the world is shifting from bouquets to potted greens for every special occasion.',
      image: 'assets/images/blog-plants-gifting.png',
      date: 'January 10, 2025',
      readTime: '4 min read',
      content: '<p>For centuries, cut flowers have been the go-to gift for celebrations. But times are changing — and people are realizing that plants make far better gifts. Here in Surat, we\'ve seen this shift firsthand.</p>' +
        '<h3>Plants Last, Flowers Don\'t</h3>' +
        '<p>A bouquet of roses looks stunning for about 5 days. A potted rose plant? It can bloom for years. Every time it flowers, it\'s a reminder of the person who gifted it. That\'s the power of a living gift — it grows alongside your memories.</p>' +
        '<h3>Plants Are Better for the Planet</h3>' +
        '<p>The cut flower industry has a surprisingly large carbon footprint — from refrigerated transport to plastic wrapping. A locally sourced plant in a reusable ceramic pot is infinitely more sustainable. At Dream Green, all our plants are sourced from nurseries right here in Gujarat.</p>' +
        '<h3>Plants Improve Your Space</h3>' +
        '<p>Indoor plants purify the air, reduce stress, boost productivity, and make any room more beautiful. NASA research has shown that plants like Peace Lilies and Snake Plants remove harmful toxins from indoor air. A bouquet just... sits in a vase and slowly dies.</p>' +
        '<h3>Plants Are More Personal</h3>' +
        '<p>When you choose a plant for someone, you\'re thinking about their personality, their space, their taste. A Jade Plant for someone who loves good luck. A Lavender for someone who needs relaxation. It\'s a more intentional, thoughtful gift than a generic bouquet.</p>' +
        '<h3>The Dream Green Way</h3>' +
        '<p>At Dream Green, we\'ve made plant gifting as beautiful as flower gifting — with our signature kraft paper packaging, personalized notes, and same-day delivery across Surat, Gujarat. Give green. Give life.</p>'
    },
    {
      id: 4,
      slug: 'best-air-purifying-plants-surat',
      title: 'Top 7 Air Purifying Plants Perfect for Surat Homes',
      tag: 'Plant Care',
      excerpt: 'Surat\'s textile hub means indoor air quality matters. These 7 plants naturally filter pollutants and keep your home fresh.',
      image: 'assets/images/product-snake-plant.png',
      date: 'December 20, 2024',
      readTime: '6 min read',
      content: '<p>As one of India\'s fastest-growing cities, Surat\'s urban environment means indoor air quality is more important than ever. The good news? Certain houseplants act as natural air filters. Here are the best ones for Surat homes.</p>' +
        '<h3>1. Snake Plant (Sansevieria)</h3>' +
        '<p>The ultimate bedroom plant — it actually releases oxygen at night, unlike most plants. It removes formaldehyde and benzene from the air. Plus, it\'s nearly indestructible, making it perfect for busy Surat professionals. Available in our shop starting at ₹599.</p>' +
        '<h3>2. Peace Lily (Spathiphyllum)</h3>' +
        '<p>Beautiful white flowers AND air-purifying power. Peace Lilies remove ammonia, benzene, and formaldehyde. They thrive in low light, so they\'re perfect for shaded Surat apartments. One of our bestselling gift plants.</p>' +
        '<h3>3. Money Plant (Pothos)</h3>' +
        '<p>The classic Indian household plant and for good reason — it grows in almost any condition and effectively removes carbon monoxide and benzene. Hang it in a macramé planter for that boho-chic look.</p>' +
        '<h3>4. Areca Palm</h3>' +
        '<p>A natural humidifier! Areca Palms release moisture into the air, which is especially helpful during Surat\'s dry winter months. They also remove toluene and xylene from indoor air.</p>' +
        '<h3>5. Spider Plant</h3>' +
        '<p>One of NASA\'s top air-purifying picks. Spider plants remove carbon monoxide and formaldehyde. They\'re incredibly easy to care for and even produce baby plants you can share with friends.</p>' +
        '<h3>6. Aloe Vera</h3>' +
        '<p>Not just great for skin — Aloe Vera also removes formaldehyde and benzene from the air. Keep one in your kitchen or bathroom. It loves Surat\'s sunny climate.</p>' +
        '<h3>7. Rubber Plant</h3>' +
        '<p>With its large, glossy leaves, the Rubber Plant is excellent at converting CO2 to oxygen and removing toxins. It makes a stunning statement piece in any Surat living room.</p>' +
        '<h3>Get These Plants Delivered</h3>' +
        '<p>All of these air-purifying plants are available for same-day delivery across Surat through Dream Green. Each one comes with a care card and our signature gift wrapping!</p>'
    },
    {
      id: 5,
      slug: 'corporate-plant-gifting-guide',
      title: 'The Complete Guide to Corporate Plant Gifting in Surat',
      tag: 'Corporate',
      excerpt: 'Stand out from the generic gift hamper crowd. Here\'s how Surat businesses are using plant gifts for employees, clients, and events.',
      image: 'assets/images/collection-corporate.png',
      date: 'December 5, 2024',
      readTime: '5 min read',
      content: '<p>In Surat\'s thriving business community — from textile giants to diamond merchants — corporate gifting is a big deal. But in a sea of dry fruit boxes and plastic-wrapped hampers, how do you stand out? The answer: plant gifts.</p>' +
        '<h3>Why Plants Beat Traditional Corporate Gifts</h3>' +
        '<p>A box of sweets gets eaten and forgotten. A plant sits on someone\'s desk for years, reminding them of your company every single day. That\'s ROI you can\'t get from a gift hamper.</p>' +
        '<h3>Best Corporate Occasions</h3>' +
        '<p><strong>Employee milestones:</strong> Work anniversaries, promotions, and birthdays. A Lucky Bamboo or Jade Plant shows you care about your team. <strong>Client appreciation:</strong> Festival seasons like Diwali and New Year. Send a premium plant gift with your company branding. <strong>Office events:</strong> New office openings, team celebrations, or as welcome gifts for new hires.</p>' +
        '<h3>Our Corporate Plans</h3>' +
        '<p>For orders of 10+ plants, we offer special corporate pricing, custom message cards with your company logo, and coordinated delivery across multiple Surat offices. Our most popular corporate gifts: Lucky Bamboo (₹499), Snake Plant (₹599), and Jade Plant (₹449).</p>' +
        '<h3>Bulk Order Process</h3>' +
        '<p>1. WhatsApp us your requirements at +91 9898081729<br>2. We\'ll send a custom quote within 2 hours<br>3. Choose your plants and personalized messaging<br>4. We handle packaging and delivery across Surat</p>' +
        '<h3>Success Stories</h3>' +
        '<p>We\'ve served 50+ Surat businesses including textile houses, IT companies, diamond offices, and hospitals. Our corporate clients love the premium packaging and reliable delivery. Contact us today!</p>'
    }
  ];

  // Live Data Memory Arrays
  var products = [];
  var collections = [];
  var blogPosts = [];
  var coupons = [];
  var settings = {};

  // Public API
  return {
    products: products,
    collections: collections,
    blogPosts: blogPosts,
    coupons: coupons,
    settings: settings,
    
    // Fetch data from Firebase with LocalStorage Caching
    init: function (force, callback) {
      var self = this;
      
      // Support old signature: init(callback)
      if (typeof force === 'function') {
        callback = force;
        force = false;
      }

      return new Promise(function(resolve, reject) {
        // Internal helper to complete the init
        function completeInit() {
          if (typeof callback === 'function') callback();
          resolve(self);
        }

        // 1. Try Loading from LocalStorage Cache first
        try {
          var cachedData = localStorage.getItem(CACHE_KEY);
          if (cachedData && !force) {
            var parsed = JSON.parse(cachedData);
            var now = Date.now();
            
            // If cache is fresh (less than CACHE_TTL old)
            if (parsed.timestamp && (now - parsed.timestamp < CACHE_TTL)) {
              console.log('DreamGreen: Loading data from LocalStorage cache (' + Math.round((now - parsed.timestamp) / 60000) + 'm old)');
              
              // Apply cached data to memory arrays
              products.length = 0;
              products.push.apply(products, parsed.products);
              
              collections.length = 0;
              collections.push.apply(collections, parsed.collections);
              
              blogPosts.length = 0;
              blogPosts.push.apply(blogPosts, parsed.blogPosts);

              coupons.length = 0;
              if (parsed.coupons) coupons.push.apply(coupons, parsed.coupons);
              
              for (var key in settings) delete settings[key];
              Object.assign(settings, parsed.settings);
              
              completeInit();
              return; // Exit early, no need to call Firestore
            }
          }
        } catch (e) {
          console.warn('DreamGreen: Cache read error', e);
        }

        // 2. Fallback to Firebase if no cache or cache expired
        if (typeof db === 'undefined') {
          console.error('Firebase DB not initialized. Please configure js/firebase-config.js');
          // Fallback to local data if Firebase isn't set up yet
          products.push.apply(products, seedProducts);
          collections.push.apply(collections, seedCollections);
          blogPosts.push.apply(blogPosts, seedBlogPosts);
          completeInit();
          return;
        }

        console.log('DreamGreen: Fetching consolidated data from Firestore...');
        
        // Load the ONE MASTER DOCUMENT (Optimized for cost & speed)
        db.collection('content').doc('website_data').get().then(function(doc) {
          if (doc.exists) {
            var data = doc.data();
            console.log('DreamGreen: Master Data Sync Successful (1 read used)');
            
            products.length = 0;
            products.push.apply(products, data.products || []);
            
            collections.length = 0;
            collections.push.apply(collections, data.collections || []);
            
            blogPosts.length = 0;
            blogPosts.push.apply(blogPosts, data.blogPosts || []);

            coupons.length = 0;
            coupons.push.apply(coupons, data.coupons || []);
            
            for (var key in settings) delete settings[key];
            Object.assign(settings, data.settings || {});
            
            // Save to LocalStorage Cache
            saveToCache();
            completeInit();
          } else {
            console.warn('DreamGreen: Master document missing, falling back to legacy fetch...');
            fetchLegacy(completeInit);
          }
        }).catch(function(error) {
          console.error('Error fetching master data:', error);
          fetchLegacy(completeInit);
        });

        function saveToCache() {
          try {
            var dataToCache = {
              timestamp: Date.now(),
              products: products,
              collections: collections,
              blogPosts: blogPosts,
              coupons: coupons,
              settings: settings
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
            console.log('DreamGreen: Data cached to LocalStorage');
          } catch (e) {
            console.warn('DreamGreen: Cache write error', e);
          }
        }

        function fetchLegacy(onFinish) {
          // Fallback to legacy individual collection fetches if master doc is missing
          Promise.all([
            db.collection('products').get(),
            db.collection('collections').get(),
            db.collection('blogPosts').get(),
            db.collection('coupons').get(),
            db.collection('settings').doc('siteConfig').get()
          ]).then(function(results) {
            var productsSnapshot = results[0];
            var collectionsSnapshot = results[1];
            var blogPostsSnapshot = results[2];
            var couponsSnapshot = results[3];
            var settingsDoc = results[4];
            
            products.length = 0;
            collections.length = 0;
            blogPosts.length = 0;
            coupons.length = 0;
            for (var key in settings) delete settings[key];
            
            productsSnapshot.forEach(function(doc) {
              products.push(Object.assign({ firebaseId: doc.id }, doc.data()));
            });
            
            collectionsSnapshot.forEach(function(doc) {
              collections.push(Object.assign({ firebaseId: doc.id }, doc.data()));
            });
            
            blogPostsSnapshot.forEach(function(doc) {
              blogPosts.push(Object.assign({ firebaseId: doc.id }, doc.data()));
            });

            couponsSnapshot.forEach(function(doc) {
              coupons.push(Object.assign({ firebaseId: doc.id }, doc.data()));
            });
    
            if (settingsDoc.exists) {
              Object.assign(settings, settingsDoc.data());
            }
            
            // Fallback checks
            if (products.length === 0) products.push.apply(products, seedProducts);
            if (collections.length === 0) collections.push.apply(collections, seedCollections);
            if (blogPosts.length === 0) blogPosts.push.apply(blogPosts, seedBlogPosts);
            
            saveToCache();
            if (onFinish) onFinish();
          }).catch(function(err) {
            console.error('Legacy fetch failed:', err);
            // Local seeds as absolute last resort
            products.push.apply(products, seedProducts);
            collections.push.apply(collections, seedCollections);
            blogPosts.push.apply(blogPosts, seedBlogPosts);
            if (onFinish) onFinish();
          });
        }
      });
    },

    // Seed database explicitly from admin panel
    seedDatabase: function() {
      if (typeof db === 'undefined') return alert('Firebase DB not initialized.');
      
      var batch = db.batch();
      
      seedProducts.forEach(function(product) {
        var docRef = db.collection('products').doc(product.id.toString());
        batch.set(docRef, product);
      });
      
      seedCollections.forEach(function(collection) {
        var docRef = db.collection('collections').doc(collection.id.toString());
        batch.set(docRef, collection);
      });
      
      seedBlogPosts.forEach(function(post) {
        var docRef = db.collection('blogPosts').doc(post.id.toString());
        batch.set(docRef, post);
      });
      
      return batch.commit().then(function() {
        console.log('Database successfully seeded with base content!');
        alert('Database seed complete. Please refresh.');
      }).catch(function(err) {
        console.error('Error seeding database:', err);
        alert('Error seeding database. Check console.');
      });
    },

    getProduct: function (id) {
      if (!id) return null;
      var searchId = id.toString().toLowerCase();
      // Try finding by internal id, firebaseId, or slug
      return products.find(function (p) { 
        var pid = p.id ? p.id.toString().toLowerCase() : "";
        var fid = p.firebaseId ? p.firebaseId.toString().toLowerCase() : "";
        var slug = p.slug ? p.slug.toString().toLowerCase() : "";
        return pid === searchId || fid === searchId || slug === searchId;
      }) || null;
    },

    getProductBySlug: function (slug) {
      return products.find(function (p) { return p.slug === slug; }) || null;
    },

    getProductsByOccasion: function (occasion) {
      if (!occasion) return [];
      var searchId = occasion.toString().toLowerCase();
      return products.filter(function (p) {
        if (!p.occasions) return false;
        return p.occasions.some(function(o) {
          return o.toString().toLowerCase() === searchId;
        });
      });
    },

    getProductsByCategory: function (category) {
      if (category === 'all') return products;
      return products.filter(function (p) { return p.category === category; });
    },

    getCollection: function (id) {
      if (!id) return null;
      var searchId = id.toString().trim().toLowerCase();
      return collections.find(function (c) { 
        var cid = c.id ? c.id.toString().trim().toLowerCase() : "";
        var fid = c.firebaseId ? c.firebaseId.toString().trim().toLowerCase() : "";
        return cid === searchId || fid === searchId;
      }) || null;
    },

    getBlogPost: function (id) {
      if (!id) return null;
      var searchId = id.toString();
      return blogPosts.find(function (b) { 
        return b.id.toString() === searchId || (b.firebaseId && b.firebaseId === searchId);
      }) || null;
    },

    getBlogPostBySlug: function (slug) {
      return blogPosts.find(function (b) { return b.slug === slug; }) || null;
    },

    filterProducts: function (filters) {
      var result = products.slice(); // always copy to avoid mutating original
      if (filters.category && filters.category !== 'all') {
        result = result.filter(function (p) { return p.category === filters.category; });
      }
      if (filters.occasion) {
        var searchOcc = filters.occasion.toString().toLowerCase();
        result = result.filter(function (p) { 
          if (!p.occasions) return false;
          return p.occasions.some(function(o) {
            return o.toString().toLowerCase() === searchOcc;
          });
        });
      }
      if (filters.minPrice) {
        result = result.filter(function (p) { return p.price >= filters.minPrice; });
      }
      if (filters.maxPrice) {
        result = result.filter(function (p) { return p.price <= filters.maxPrice; });
      }
      if (filters.sort === 'price-low') {
        result.sort(function (a, b) { return a.price - b.price; });
      } else if (filters.sort === 'price-high') {
        result.sort(function (a, b) { return b.price - a.price; });
      } else if (filters.sort === 'rating') {
        result.sort(function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; });
      }
      return result;
    },

    clearCache: function () {
      localStorage.removeItem(CACHE_KEY);
      console.log('DreamGreen: Cache cleared');
    }
  };
})();

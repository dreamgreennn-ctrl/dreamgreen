/* ============================================================
   DREAM GREEN — Admin Portal Logic
   Handles Auth, CRUD for Products, and UI state
   ============================================================ */

const DreamGreenAdmin = (function () {
  'use strict';

  let currentSection = 'products';
  let editingId = null;

  // --- UI Elements ---
  const loginOverlay = document.getElementById('loginOverlay');
  const adminPanel = document.getElementById('adminPanel');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  const sectionTitle = document.getElementById('sectionTitle');
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');
  const listView = document.getElementById('listView');
  
  const editorView = document.getElementById('editorView');
  const editorTitle = document.getElementById('editorTitle');
  const editorForm = document.getElementById('editorForm');
  const formFields = document.getElementById('formFields');
  
  const addNewBtn = document.getElementById('addNewBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const seedDbBtn = document.getElementById('seedDbBtn');
  const syncDataBtn = document.getElementById('syncDataBtn');
  const adminSearchInput = document.getElementById('adminSearchInput');

  // Mobile drawer elements
  const adminSidebar = document.getElementById('adminSidebar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  // --- Initialization ---
  function init() {
    // Mobile Sidebar Toggle
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', toggleSidebar);
    }
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Auth State Listener
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Optimized Admin Check: Check cache first
        const cacheKey = `dg_admin_${user.uid}`;
        const isCachedAdmin = localStorage.getItem(cacheKey) === 'true';

        if (isCachedAdmin) {
          console.log('Admin Security: Role verified from cache (0 reads)');
          proceedAsAdmin(user);
        } else {
          showLoading(true);
          try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists && userDoc.data().role === 'admin') {
              localStorage.setItem(cacheKey, 'true');
              console.log('Admin Security: Role verified from Firestore (1 read)');
              proceedAsAdmin(user);
            } else {
              console.warn('Admin Security: Access Denied for UID:', user.uid);
              auth.signOut();
              loginError.textContent = 'Access Denied: You do not have administrator privileges.';
              loginError.style.display = 'block';
            }
          } catch (err) {
            console.error('Admin Security: Error checking role:', err);
            auth.signOut();
          } finally {
            showLoading(false);
          }
        }
      } else {
        showLogin();
      }
    });

    function proceedAsAdmin(user) {
      showPanel();
      loadSection('dashboard');
      if (document.getElementById('adminUserEmail')) {
        document.getElementById('adminUserEmail').textContent = user.email;
      }
    }

    // Event Listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', () => {
      // Clear admin cache on logout
      const user = auth.currentUser;
      if (user) {
        localStorage.removeItem(`dg_admin_${user.uid}`);
      }
      auth.signOut();
    });
    
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.getAttribute('data-section');
        loadSection(section);
        if (window.innerWidth <= 1024) toggleSidebar();
      });
    });

    addNewBtn.addEventListener('click', () => showEditor());
    cancelBtn.addEventListener('click', hideEditor);
    seedDbBtn.addEventListener('click', handleSeed);
    if (syncDataBtn) {
      syncDataBtn.addEventListener('click', handleSync);
    }
    
    editorForm.addEventListener('submit', handleSave);
  }

  function toggleSidebar() {
    adminSidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  }

  // --- Auth Handlers ---
  async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    loginError.style.display = 'none';
    showLoading(true);

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      loginError.textContent = error.message;
      loginError.style.display = 'block';
    } finally {
      showLoading(false);
    }
  }

  function showLogin() {
    loginOverlay.style.display = 'flex';
    adminPanel.style.display = 'none';
  }

  function showPanel() {
    loginOverlay.style.display = 'none';
    adminPanel.style.display = 'flex';
  }

  // --- Navigation & Section Loading ---
  async function loadSection(section) {
    currentSection = section;
    editingId = null;
    hideEditor();
    
    // Update UI active state
    document.querySelectorAll('.admin-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-section') === section);
    });
    
    sectionTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1).replace('blog', 'Blog Posts');
    
    showLoading(true);
    
    // ENSURE DATA: If we're entering a data-section, force a refresh to bypass cache
    if (['products', 'blog', 'collections', 'coupons'].includes(section)) {
        await DreamGreenData.init(true);
    }
    
    // Hide all views first
    document.getElementById('dashboardView').style.display = 'none';
    listView.style.display = 'none';
    editorView.style.display = 'none';

    if (section === 'dashboard') {
      await renderDashboard();
      document.getElementById('dashboardView').style.display = 'block';
      addNewBtn.style.display = 'none';
      seedDbBtn.style.display = 'none';
    } else if (section === 'settings') {
      showEditor('siteConfig'); // Settings is just one special "Edit" view
      addNewBtn.style.display = 'none';
      seedDbBtn.style.display = 'block';
    } else if (section === 'orders') {
      listView.style.display = 'block';
      addNewBtn.style.display = 'none';
      seedDbBtn.style.display = 'none';
      await renderOrdersTable();
    } else if (section === 'coupons') {
      listView.style.display = 'block';
      addNewBtn.style.display = 'block';
      seedDbBtn.style.display = 'none';
      
      // DIAGNOSTIC: Fetch coupons directly instead of through bundle
      showLoading(true);
      db.collection('coupons').get().then(snapshot => {
          DreamGreenData.coupons.length = 0;
          snapshot.forEach(doc => {
              DreamGreenData.coupons.push(Object.assign({ firebaseId: doc.id }, doc.data()));
          });
          console.log('DreamGreenAdmin: Loaded', DreamGreenData.coupons.length, 'coupons directly from Firestore.');
          renderTable();
          showLoading(false);
      }).catch(err => {
          console.error('Coupon fetch error:', err);
          renderTable();
          showLoading(false);
      });
    } else {
      listView.style.display = 'block';
      renderTable();
      addNewBtn.style.display = 'block';
      seedDbBtn.style.display = 'block';
    }
    
    showLoading(false);
  }

  // --- Dashboard Logic ---
  async function renderDashboard() {
    try {
      // 1. Fetch ONLY LATEST 20 Orders for stats (Huge read savings!)
      const orderDocs = await db.collection('orders')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();
        
      const orders = [];
      orderDocs.forEach(doc => orders.push(doc.data()));

      // 2. Approximate Stats (For full stats, we should use a Cloud Function or separate aggregator doc)
      // Since we only fetch 20, revenue shown is for these last 20.
      const recentRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const lowStockCount = DreamGreenData.products.filter(p => !p.inStock).length;

      // 3. Update Stat Cards (Note: These are now based on recent activity)
      document.getElementById('statRevenue').textContent = '₹' + recentRevenue.toLocaleString('en-IN');
      document.getElementById('statOrders').textContent = orders.length + '+';
      document.getElementById('statStock').textContent = lowStockCount;

      // 4. Render mini recent table
      const dashHeader = document.getElementById('dashTableHeader');
      const dashBody = document.getElementById('dashTableBody');
      dashHeader.innerHTML = '<th>Order Date</th><th>Customer</th><th>Status</th><th>Total</th>';
      dashBody.innerHTML = '';

      const recentOrders = orders
        .sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 5);

      recentOrders.forEach(o => {
        const date = o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleDateString() : 'Recent';
        const tr = document.createElement('tr');
        const statusClass = 'badge-' + (o.status || 'pending').toLowerCase();
        tr.innerHTML = `
          <td>${date}</td>
          <td>${o.senderName || 'Guest'}</td>
          <td><span class="admin-badge ${statusClass}">${o.status || 'Pending'}</span></td>
          <td style="font-weight:700">₹${o.total || 0}</td>
        `;
        dashBody.appendChild(tr);
      });

    } catch (err) {
      console.error('Dashboard Err:', err);
    }
  }

  // --- Table Rendering ---
  function renderTable() {
    console.log('DreamGreenAdmin: Rendering Table for', currentSection, '| Data Count:', DreamGreenData[currentSection]?.length);
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (currentSection === 'products') {
      tableHeader.innerHTML = '<th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Stock</th><th>Actions</th>';
      
      DreamGreenData.products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.id}</td>
          <td><strong>${p.name}</strong></td>
          <td>₹${p.price}</td>
          <td>${p.category}</td>
          <td>${p.inStock ? '✅' : '❌'}</td>
          <td class="admin-table-actions">
            <button onclick="DreamGreenAdmin.editItem('${p.firebaseId}')" class="admin-action-btn" title="Edit">✏️</button>
            <button onclick="DreamGreenAdmin.deleteItem('${p.firebaseId}')" class="admin-action-btn" title="Delete">🗑️</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    } else if (currentSection === 'coupons') {
      tableHeader.innerHTML = '<th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Status</th><th>Actions</th>';
      DreamGreenData.coupons.forEach(c => {
        const tr = document.createElement('tr');
        const statusBadge = c.active ? '<span class="admin-badge badge-delivered">Active</span>' : '<span class="admin-badge badge-pending">Inactive</span>';
        tr.innerHTML = `
          <td><strong>${c.code}</strong></td>
          <td>${c.type === 'percent' ? 'Percentage' : 'Fixed'}</td>
          <td>${c.type === 'percent' ? c.value + '%' : '₹' + c.value}</td>
          <td>₹${c.minOrder || 0}</td>
          <td>${statusBadge}</td>
          <td class="admin-table-actions">
            <button onclick="DreamGreenAdmin.editItem('${c.firebaseId}')" class="admin-action-btn" title="Edit">✏️</button>
            <button onclick="DreamGreenAdmin.deleteItem('${c.firebaseId}')" class="admin-action-btn" title="Delete">🗑️</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      if (DreamGreenData.coupons.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--admin-text-muted);">No coupons found. Click "Add New" to create your first discount code.</td></tr>';
      }
    } else if (currentSection === 'blog') {
      tableHeader.innerHTML = '<th>Date</th><th>Title</th><th>Tag</th><th>Actions</th>';
      DreamGreenData.blogPosts.forEach(b => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${b.date}</td>
          <td><strong>${b.title}</strong></td>
          <td><span class="admin-badge">${b.tag}</span></td>
          <td class="admin-table-actions">
            <button onclick="DreamGreenAdmin.editItem('${b.firebaseId}')" class="admin-action-btn" title="Edit">✏️</button>
            <button onclick="DreamGreenAdmin.deleteItem('${b.firebaseId}')" class="admin-action-btn" title="Delete">🗑️</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    } else if (currentSection === 'collections') {
      tableHeader.innerHTML = '<th>ID</th><th>Emoji</th><th>Name</th><th>Actions</th>';
      DreamGreenData.collections.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.id}</td>
          <td>${c.emoji}</td>
          <td><strong>${c.name}</strong></td>
          <td class="admin-table-actions">
            <button onclick="DreamGreenAdmin.editItem('${c.firebaseId}')" class="admin-action-btn" title="Edit">✏️</button>
            <button onclick="DreamGreenAdmin.deleteItem('${c.firebaseId}')" class="admin-action-btn" title="Delete">🗑️</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  }

  async function renderOrdersTable() {
    tableHeader.innerHTML = '<th>Date & Status</th><th>Sender (Customer)</th><th>Recipient & Delivery</th><th>Order Items</th><th>Total</th><th>Actions</th>';
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading orders...</td></tr>';

    try {
      const query = db.collection('orders').limit(50);
      const snapshot = await query.get();
      tableBody.innerHTML = '';
      
      const orders = [];
      snapshot.forEach(doc => orders.push(Object.assign({ firebaseId: doc.id }, doc.data())));
      orders.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No orders found.</td></tr>';
        return;
      }

      orders.forEach(o => {
        const date = o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleDateString() : 'Recent';
        const tr = document.createElement('tr');
        
        const statusOptions = ['Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'];
        const statusSelect = `
          <select onchange="DreamGreenAdmin.updateOrderStatus('${o.firebaseId}', this.value)" class="admin-status-select">
            ${statusOptions.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        `;

        tr.innerHTML = `
          <td>
            <div style="font-weight:600; margin-bottom:0.5rem;">${date}</div>
            ${statusSelect}
          </td>
          <td>
            <div class="admin-order-detail-block">
              <strong>${o.senderName || 'Guest'}</strong><br>
              <small>${o.senderEmail || 'No Email'}</small><br>
              ${o.senderPhone ? `
                <div style="margin-top:0.4rem;">
                  <a href="https://wa.me/${o.senderPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`*Dream Green Order Confirmation*

Hi ${o.senderName || 'there'},

Thank you so much for choosing *Dream Green*! We've received your order and are preparing it for delivery.

*Order Details:*
${(o.items || []).map(i => `${i.qty}x ${i.productName}`).join('\n')}

*Total Amount:* INR ${o.total || 0}
*Delivery to:* ${o.recipientName || 'You'}

Thank you for your purchase! 
If you have any queries, feel free to reach out to us right here.`)}" 
                     target="_blank" 
                     class="admin-wa-btn">
                     <span>💬 WhatsApp</span>
                  </a>
                </div>
              ` : '<small style="color:var(--admin-text-muted);">No Phone</small>'}
            </div>
          </td>
          <td>
            <div class="admin-order-detail-block">
              <strong>To: ${o.recipientName || 'Unknown'}</strong><br>
              <small>📞 ${o.recipientPhone || 'No Phone'}</small><br>
              <div style="margin-top:0.5rem; font-size:0.85rem; line-height:1.4;">
                📍 ${o.deliveryAddress || 'No Address'}, ${o.deliveryArea || 'Surat'}<br>
                🗓️ Delivery: <strong>${o.deliveryDate || 'ASAP'}</strong>
              </div>
              ${o.giftMessage ? `<div class="admin-order-message">✉️ "${o.giftMessage}"</div>` : ''}
            </div>
          </td>
          <td>
            <div class="admin-order-items">
              ${(o.items || []).map(i => `
                <div class="admin-order-item-row">
                  <span>${i.qty}x</span>
                  <span>${i.productName}</span>
                </div>
              `).join('')}
            </div>
          </td>
          <td style="font-weight:700; color:var(--admin-primary-dark)">₹${o.total || 0}</td>
          <td>
            <div style="display:flex; gap:0.5rem;">
              <button onclick="DreamGreenAdmin.deleteOrder('${o.firebaseId}')" class="admin-action-btn" title="Delete">🗑️</button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (error) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--admin-error);">Error loading orders: ${error.message}</td></tr>`;
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      await db.collection('orders').doc(orderId).update({ status: newStatus });
    } catch (error) {
      alert('Error updating status: ' + error.message);
      loadSection('orders'); // Refresh
    }
  }

  async function deleteOrder(id) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    showLoading(true);
    try {
      await db.collection('orders').doc(id).delete();
      loadSection('orders');
    } catch (error) {
      alert('Error deleting: ' + error.message);
    } finally {
      showLoading(false);
    }
  }

  // --- Master Data Consolidation (ONE-READ Strategy) ---
  async function syncWebsiteData() {
    console.log('DreamGreenAdmin: Starting Master Data Consolidation...');
    
    try {
      // 1. Fetch EVERYTHING fresh one last time
      const [productsSnap, collectionsSnap, blogSnap, couponsSnap, settingsSnap] = await Promise.all([
        db.collection('products').get(),
        db.collection('collections').get(),
        db.collection('blogPosts').get(),
        db.collection('coupons').get(),
        db.collection('settings').doc('siteConfig').get()
      ]);

      const products = [];
      productsSnap.forEach(doc => products.push(Object.assign({ firebaseId: doc.id }, doc.data())));

      const collections = [];
      collectionsSnap.forEach(doc => collections.push(Object.assign({ firebaseId: doc.id }, doc.data())));

      const blogPosts = [];
      blogSnap.forEach(doc => blogPosts.push(Object.assign({ firebaseId: doc.id }, doc.data())));

      const coupons = [];
      couponsSnap.forEach(doc => coupons.push(Object.assign({ firebaseId: doc.id }, doc.data())));

      const settings = settingsSnap.exists ? settingsSnap.data() : {};

      // 2. Bundle it all
      const website_data = {
        lastUpdated: Date.now(),
        products: products,
        collections: collections,
        blogPosts: blogPosts,
        coupons: coupons,
        settings: settings,
        version: "1.3"
      };

      // 3. Save as a SINGLE MASTER DOCUMENT
      await db.collection('content').doc('website_data').set(website_data);
      console.log('DreamGreenAdmin: Master Data Sync Successful! (website_data)');
      
      // Update local memory to stay in sync
      DreamGreenData.products.length = 0;
      DreamGreenData.products.push.apply(DreamGreenData.products, products);

      DreamGreenData.collections.length = 0;
      DreamGreenData.collections.push.apply(DreamGreenData.collections, collections);

      DreamGreenData.blogPosts.length = 0;
      DreamGreenData.blogPosts.push.apply(DreamGreenData.blogPosts, blogPosts);

      DreamGreenData.coupons.length = 0;
      DreamGreenData.coupons.push.apply(DreamGreenData.coupons, coupons);

      Object.assign(DreamGreenData.settings, settings);
      
      // CRITICAL: Clear local cache to ensure the next fetch gets the fresh bundle
      // Synchronized with CACHE_KEY in js/data.js
      localStorage.removeItem('dreamgreen_data_v2');
      
      console.log('DreamGreenAdmin: Memory sync complete and cache invalidated. Coupons:', DreamGreenData.coupons.length);
      return true;
    } catch (err) {
      console.error('Sync Error:', err);
      throw err;
    }
  }

  async function handleSync() {
    showLoading(true);
    try {
      await syncWebsiteData();
      alert('✅ Master Sync Successful! All users will now load your data with just 1 Firestore read.');
    } catch (err) {
      alert('❌ Sync failed: ' + err.message);
    } finally {
      showLoading(false);
    }
  }

  // --- Editor Logic ---
  function showEditor(id = null) {
    editingId = id;
    
    let title = 'Add New';
    if (currentSection === 'products') title = id ? 'Edit Product' : 'Add New Product';
    else if (currentSection === 'blog') title = id ? 'Edit Post' : 'New Blog Post';
    else if (currentSection === 'collections') title = id ? 'Edit Collection' : 'New Collection';
    else if (currentSection === 'coupons') title = id ? 'Edit Coupon' : 'New Coupon';
    
    editorTitle.textContent = title;
    listView.style.display = 'none';
    editorView.style.display = 'block';
    addNewBtn.style.display = 'none';
    
    renderFormFields(id);
  }

  function hideEditor() {
    editingId = null;
    listView.style.display = 'block';
    editorView.style.display = 'none';
    addNewBtn.style.display = 'block';
    editorForm.reset();
  }

  function renderFormFields(id) {
    formFields.innerHTML = '';
    formFields.className = 'admin-form-grid';
    
    let fields = [];
    let item = null;

    if (currentSection === 'products') {
      item = id ? DreamGreenData.products.find(p => p.firebaseId === id) : null;
      fields = [
        { section: 'Basic Info' },
        { name: 'id', label: 'Numerical ID', type: 'number', required: true, value: item?.id || (DreamGreenData.products.length + 1) },
        { name: 'name', label: 'Product Name', type: 'text', required: true, value: item?.name || '' },
        { name: 'slug', label: 'URL Slug', type: 'text', required: true, value: item?.slug || '' },
        { name: 'price', label: 'Price (₹)', type: 'number', required: true, value: item?.price || '' },
        { name: 'originalPrice', label: 'Original Price (₹)', type: 'number', required: false, value: item?.originalPrice || '' },
        { name: 'category', label: 'Category', type: 'select', options: ['indoor', 'succulent', 'flowering'], value: item?.category || 'indoor' },
        { name: 'image', label: 'Image Path', type: 'text', required: true, value: item?.image || 'assets/images/product-peace-lily.png' },
        { name: 'tag', label: 'Badge Tag', type: 'text', required: false, value: item?.tag || '' },
        { name: 'size', label: 'Size', type: 'text', required: true, value: item?.size || 'Medium' },
        { name: 'potType', label: 'Pot Type', type: 'text', required: true, value: item?.potType || 'White Ceramic' },
        { name: 'inStock', label: 'In Stock', type: 'select', options: ['Yes', 'No'], value: item?.inStock === false ? 'No' : 'Yes' },
        { name: 'description', label: 'Description', type: 'textarea', required: true, value: item?.description || '', full: true },
        
        { section: 'Plant Care (Dynamic details)', grid: 'three-cols' },
        { name: 'careInfo_light', label: '☀️ Light', type: 'text', value: item?.careInfo?.light || 'Low to medium indirect light' },
        { name: 'careInfo_water', label: '💧 Water', type: 'text', value: item?.careInfo?.water || 'Once a week' },
        { name: 'careInfo_difficulty', label: '🌡️ Difficulty', type: 'text', value: item?.careInfo?.difficulty || 'Easy' },
        
        { section: 'Marketing' },
        { name: 'features', label: "What's Included (Comma separated)", type: 'textarea', value: (item?.features || []).join(', '), full: true },
        { 
          name: 'occasions', 
          label: 'In Collections (Select all that apply)', 
          type: 'checkbox-group', 
          options: DreamGreenData.collections.map(c => ({ value: c.id, label: c.name })), 
          value: item?.occasions || [], 
          full: true 
        },
      ];
    } else if (currentSection === 'blog') {
      item = id ? DreamGreenData.blogPosts.find(b => b.firebaseId === id) : null;
      fields = [
        { name: 'title', label: 'Post Title', type: 'text', required: true, value: item?.title || '' },
        { name: 'slug', label: 'Slug', type: 'text', required: true, value: item?.slug || '' },
        { name: 'tag', label: 'Tag', type: 'text', required: true, value: item?.tag || 'Plant Care' },
        { name: 'date', label: 'Date', type: 'text', required: true, value: item?.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
        { name: 'readTime', label: 'Read Time', type: 'text', value: item?.readTime || '5 min read' },
        { name: 'image', label: 'Featured Image', type: 'text', value: item?.image || 'assets/images/blog-1.jpg' },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true, value: item?.excerpt || '', full: true },
        { name: 'content', label: 'Full Content (HTML)', type: 'textarea', required: true, value: item?.content || '', full: true },
      ];
    } else if (currentSection === 'collections') {
        item = id ? DreamGreenData.collections.find(c => c.firebaseId === id) : null;
        fields = [
          { name: 'id', label: 'Slug / ID (Must match product occasions)', type: 'text', required: true, value: item?.id || '' },
          { name: 'name', label: 'Collection Name', type: 'text', required: true, value: item?.name || '' },
          { name: 'emoji', label: 'Emoji Icon', type: 'text', required: true, value: item?.emoji || '🌿' },
          { name: 'image', label: 'Banner Image Path', type: 'text', required: true, value: item?.image || 'assets/images/collection-birthday.png' },
          { name: 'description', label: 'Short Description', type: 'textarea', required: true, value: item?.description || '', full: true },
          { name: 'longDescription', label: 'Long Description (For page header)', type: 'textarea', required: true, value: item?.longDescription || '', full: true },
          { section: 'Products in this Collection' },
          { 
            name: 'linkedProducts', 
            label: 'Select plants to add to this collection', 
            type: 'checkbox-group', 
            options: DreamGreenData.products.map(p => ({ value: p.firebaseId, label: p.name })), 
            value: DreamGreenData.products.filter(p => (p.occasions || []).includes(item?.id)).map(p => p.firebaseId),
            full: true 
          },
        ];
    } else if (currentSection === 'coupons') {
      item = id ? DreamGreenData.coupons.find(c => c.firebaseId === id) : null;
      fields = [
        { name: 'code', label: 'Coupon Code (e.g. SAVE10)', type: 'text', value: item ? item.code : '', required: true },
        { name: 'type', label: 'Discount Type', type: 'select', options: ['percent', 'fixed'], value: item ? item.type : 'percent' },
        { name: 'value', label: 'Discount Value', type: 'number', value: item ? item.value : '', required: true },
        { name: 'minOrder', label: 'Min Order Amount (₹)', type: 'number', value: item ? item.minOrder : '0' },
        { name: 'active', label: 'Currently Active?', type: 'select', options: ['Yes', 'No'], value: (item && !item.active) ? 'No' : 'Yes' }
      ];
    } else if (currentSection === 'settings') {
      item = DreamGreenData.settings || {};
      fields = [
        { section: 'Store Identity' },
        { name: 'storeName', label: 'Store Name', type: 'text', value: item.storeName || 'Dream Green' },
        { name: 'footerText', label: 'Footer Brand Description', type: 'textarea', value: item.footerText || '', full: true }
      ];
    }

    fields.forEach(f => {
      if (f.section) {
        const header = document.createElement('div');
        header.className = 'admin-form-section-header full-width';
        header.innerHTML = `<h4>${f.section}</h4>`;
        formFields.appendChild(header);
        if (f.grid) formFields.classList.add(f.grid);
        return;
      }

      const div = document.createElement('div');
      div.className = `form-group ${f.full ? 'full-width' : ''}`;
      
      let inputHtml = '';
      if (f.type === 'select') {
        inputHtml = `<select name="${f.name}" id="f_${f.name}">${f.options.map(o => `<option value="${o}" ${f.value === o ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
      } else if (f.type === 'textarea') {
        inputHtml = `<textarea name="${f.name}" id="f_${f.name}" rows="${f.full ? 8 : 4}" ${f.required ? 'required' : ''}>${f.value}</textarea>`;
      } else if (f.type === 'checkbox-group') {
        inputHtml = `<div class="checkbox-group">${f.options.map(o => {
          const checked = f.value.includes(o.value) ? 'checked' : '';
          return `<label class="checkbox-item"><input type="checkbox" name="${f.name}" value="${o.value}" ${checked}> ${o.label}</label>`;
        }).join('')}</div>`;
      } else {
        inputHtml = `<input type="${f.type}" name="${f.name}" id="f_${f.name}" value="${f.value}" ${f.required ? 'required' : ''}>`;
      }

      div.innerHTML = `<label for="f_${f.name}">${f.label}</label>${inputHtml}`;
      formFields.appendChild(div);
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    showLoading(true);

    const formData = new FormData(editorForm);
    const rawData = {};
    formData.forEach((value, key) => {
      if (rawData[key]) {
        if (!Array.isArray(rawData[key])) rawData[key] = [rawData[key]];
        rawData[key].push(value);
      } else {
        rawData[key] = value;
      }
    });

    // --- Dynamic URL Formatting (e.g., Google Drive) ---
    const formatImageUrl = (url) => {
        if (!url) return url;
        // Detect Google Drive sharing links
        if (url.includes('drive.google.com/file/d/')) {
            const fileId = url.split('/d/')[1].split('/')[0];
            return `https://lh3.googleusercontent.com/u/0/d/${fileId}=w1000`; // High-quality direct link
        }
        return url;
    };

    let collectionName = 'products';
    let saveId = editingId;
    let finalData = {};

    if (currentSection === 'products') {
      collectionName = 'products';
      finalData = {
        id: parseInt(rawData.id),
        name: rawData.name,
        slug: rawData.slug,
        price: parseInt(rawData.price),
        originalPrice: rawData.originalPrice ? parseInt(rawData.originalPrice) : null,
        category: rawData.category,
        image: formatImageUrl(rawData.image),
        tag: rawData.tag,
        size: rawData.size,
        potType: rawData.potType,
        inStock: rawData.inStock === 'Yes',
        description: rawData.description,
        careInfo: {
          light: rawData.careInfo_light,
          water: rawData.careInfo_water,
          difficulty: rawData.careInfo_difficulty
        },
        features: rawData.features.split(',').map(s => s.trim()).filter(s => s),
        occasions: Array.isArray(rawData.occasions) ? rawData.occasions : (rawData.occasions ? [rawData.occasions] : [])
      };

      if (!saveId) {
        saveId = finalData.id.toString();
        finalData.rating = 5;
        finalData.reviews = 0;
      }
    } else if (currentSection === 'blog') {
      collectionName = 'blogPosts';
      finalData = {
        title: rawData.title,
        slug: rawData.slug,
        tag: rawData.tag,
        date: rawData.date,
        readTime: rawData.readTime,
        image: formatImageUrl(rawData.image),
        excerpt: rawData.excerpt,
        content: rawData.content
      };
      if (!saveId) saveId = finalData.slug;
    } else if (currentSection === 'collections') {
      collectionName = 'collections';
      finalData = {
        id: rawData.id,
        name: rawData.name,
        emoji: rawData.emoji,
        image: formatImageUrl(rawData.image),
        description: rawData.description,
        longDescription: rawData.longDescription
      };
      if (!saveId) saveId = finalData.id;

      // Handle linked products
      const selectedProductIds = Array.isArray(rawData.linkedProducts) ? rawData.linkedProducts : (rawData.linkedProducts ? [rawData.linkedProducts] : []);
      const batch = db.batch();
      
      DreamGreenData.products.forEach(p => {
        const productRef = db.collection('products').doc(p.firebaseId);
        const hasCollection = (p.occasions || []).includes(finalData.id);
        const shouldHaveCollection = selectedProductIds.includes(p.firebaseId);

        if (shouldHaveCollection && !hasCollection) {
          batch.update(productRef, { occasions: firebase.firestore.FieldValue.arrayUnion(finalData.id) });
        } else if (!shouldHaveCollection && hasCollection) {
          batch.update(productRef, { occasions: firebase.firestore.FieldValue.arrayRemove(finalData.id) });
        }
      });
      await batch.commit();
    } else if (currentSection === 'coupons') {
      collectionName = 'coupons';
      finalData = {
        code: rawData.code.toUpperCase().trim(),
        type: rawData.type,
        value: parseInt(rawData.value),
        minOrder: parseInt(rawData.minOrder) || 0,
        active: rawData.active === 'Yes'
      };
      if (!saveId) saveId = finalData.code;
    } else if (currentSection === 'settings') {
      collectionName = 'settings';
      saveId = 'siteConfig';
      finalData = rawData;
    }

    try {
      if (editingId || currentSection === 'settings') {
        await db.collection(collectionName).doc(saveId).set(finalData, { merge: true });
      } else {
        await db.collection(collectionName).doc(saveId).set(finalData);
      }
      
      // AUTO-SYNC: Update the consolidated website_data document
      await syncWebsiteData();
      
      alert('Saved and Synchronized successfully!');
      if (currentSection !== 'settings') {
        loadSection(currentSection);
      } else {
        await DreamGreenData.init();
        showEditor('siteConfig');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      showLoading(false);
    }
  }

  async function deleteItem(id) {
    const colMap = { products: 'products', blog: 'blogPosts', collections: 'collections', coupons: 'coupons' };
    const col = colMap[currentSection];
    if (!confirm(`Are you sure you want to delete this ${currentSection}?`)) return;
    
    showLoading(true);
    try {
      await db.collection(col).doc(id).delete();
      
      // AUTO-SYNC after deletion
      await syncWebsiteData();
      
      loadSection(currentSection);
    } catch (error) {
      alert('Error deleting: ' + error.message);
    } finally {
      showLoading(false);
    }
  }

  function handleSeed() {
      if (confirm('This will populate circular database with sample data. Continue?')) {
          showLoading(true);
          DreamGreenData.seedDatabase().finally(() => {
              showLoading(false);
              loadSection('products');
          });
      }
  }

  function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
  }

  // --- Exposed API ---
  return {
    init: init,
    editItem: (id) => showEditor(id),
    deleteItem: deleteItem,
    updateOrderStatus: updateOrderStatus,
    deleteOrder: deleteOrder,
    syncWebsiteData: syncWebsiteData
  };
})();

// Initialize on load
document.addEventListener('DOMContentLoaded', DreamGreenAdmin.init);

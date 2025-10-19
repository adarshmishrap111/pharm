// Super Admin Dashboard JavaScript

// Check admin authentication
(async function checkAuth() {
    try {
        const res = await fetch('/api/session', { credentials: 'same-origin' });
        if (!res.ok) {
            window.location.href = '/admin-login.html';
            return;
        }
        const json = await res.json();
        if (!json || !json.ok) {
            window.location.href = '/admin-login.html';
        }
    } catch (err) {
        window.location.href = '/admin-login.html';
    }
})();

// Show/Hide Sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('a').classList.add('active');
    
    // Update title
    const titles = {
        overview: 'Dashboard Overview',
        products: 'Product Management',
        categories: 'Categories',
        offers: 'Offers & Discounts',
        orders: 'Orders Management',
        users: 'Users Management',
        prescriptions: 'Prescriptions',
        ambulance: 'Ambulance Requests',
        doctor: 'Doctor Appointments',
        settings: 'Settings'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionName] || 'Dashboard';
    
    // Load data for section
    loadSectionData(sectionName);
}

// Load data based on section
async function loadSectionData(section) {
    switch(section) {
        case 'overview':
            loadOverviewStats();
            break;
        case 'products':
            loadProducts();
            loadCategories();
            break;
        case 'categories':
            loadCategoriesTable();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

// Load Overview Stats
async function loadOverviewStats() {
    try {
        // Get products
        const products = await fetch('/api/products').then(r => r.json());
        document.getElementById('totalProducts').textContent = products.products?.length || 0;
        
        // Get orders
        const orders = await fetch('/api/orders', { credentials: 'same-origin' }).then(r => r.json());
        document.getElementById('totalOrders').textContent = orders.orders?.length || 0;
        
        // Calculate revenue
        const revenue = orders.orders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;
        document.getElementById('totalRevenue').textContent = '₹' + revenue.toFixed(2);
        
        // Get users (profiles)
        const users = await fetch('/api/profiles', { credentials: 'same-origin' }).then(r => r.json());
        document.getElementById('totalUsers').textContent = users.profiles?.length || 0;
    } catch (err) {
        console.error('Error loading stats:', err);
    }
}

// Load Products
async function loadProducts() {
    try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';
        
        data.products.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${p.imageUrl}" alt="${p.name}"></td>
                <td>${p.name}</td>
                <td>${p.category || 'N/A'}</td>
                <td>₹${Number(p.price).toFixed(2)}</td>
                <td>${p.stock || 'N/A'}</td>
                <td class="action-btns">
                    <button class="btn-edit" onclick="editProduct(${p.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Error loading products:', err);
    }
}

// Load Categories for dropdown
async function loadCategories() {
    try {
        const res = await fetch('/api/categories', { credentials: 'same-origin' });
        const data = await res.json();
        const select = document.getElementById('categorySelect');
        select.innerHTML = '<option value="">Select Category</option>';
        
        if (data.categories) {
            data.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error('Error loading categories:', err);
    }
}

// Load Categories Table
async function loadCategoriesTable() {
    try {
        const res = await fetch('/api/categories', { credentials: 'same-origin' });
        const data = await res.json();
        const tbody = document.querySelector('#categoriesTable tbody');
        tbody.innerHTML = '';
        
        if (data.categories) {
            data.categories.forEach(cat => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td style="font-size:2em">${cat.icon || '📦'}</td>
                    <td>${cat.name}</td>
                    <td>${cat.description || 'N/A'}</td>
                    <td>${cat.productCount || 0}</td>
                    <td class="action-btns">
                        <button class="btn-edit" onclick="editCategory(${cat.id})">Edit</button>
                        <button class="btn-delete" onclick="deleteCategory(${cat.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (err) {
        console.error('Error loading categories:', err);
    }
}

// Load Orders
async function loadOrders() {
    try {
        const res = await fetch('/api/orders', { credentials: 'same-origin' });
        const data = await res.json();
        const tbody = document.querySelector('#ordersTable tbody');
        tbody.innerHTML = '';
        
        data.orders.forEach(order => {
            const items = JSON.parse(order.items || '[]');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${items.length} items</td>
                <td>₹${Number(order.total).toFixed(2)}</td>
                <td><span class="badge badge-${order.status === 'delivered' ? 'success' : 'warning'}">${order.status || 'pending'}</span></td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td class="action-btns">
                    <button class="btn-view" onclick="viewOrder(${order.id})">View</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Error loading orders:', err);
    }
}

// Load Users
async function loadUsers() {
    try {
        const res = await fetch('/api/profiles', { credentials: 'same-origin' });
        const data = await res.json();
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';
        
        data.profiles.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td class="action-btns">
                    <button class="btn-view">View</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Error loading users:', err);
    }
}

// Product Form Submit
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        });
        
        const data = await res.json();
        
        if (res.ok) {
            showAlert('Product added successfully!', 'success');
            e.target.reset();
            document.getElementById('imagePreview').innerHTML = '';
            loadProducts();
            loadOverviewStats();
        } else {
            showAlert(data.error || 'Error adding product', 'error');
        }
    } catch (err) {
        showAlert('Network error', 'error');
    }
});

// Category Form Submit
document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: e.target.categoryName.value,
        icon: e.target.icon.value,
        description: e.target.description.value
    };
    
    try {
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'same-origin'
        });
        
        const data = await res.json();
        
        if (res.ok) {
            showAlert('Category added successfully!', 'success');
            e.target.reset();
            loadCategoriesTable();
        } else {
            showAlert(data.error || 'Error adding category', 'error');
        }
    } catch (err) {
        showAlert('Network error', 'error');
    }
});

// Image Preview
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Delete Product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            credentials: 'same-origin'
        });
        
        if (res.ok) {
            showAlert('Product deleted successfully!', 'success');
            loadProducts();
            loadOverviewStats();
        } else {
            showAlert('Error deleting product', 'error');
        }
    } catch (err) {
        showAlert('Network error', 'error');
    }
}

// Edit Product
function editProduct(id) {
    window.location.href = `/admin-edit.html?id=${id}`;
}

// View Order
function viewOrder(id) {
    window.location.href = `/track-order.html?id=${id}`;
}

// Show Alert
function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    
    setTimeout(() => {
        alert.classList.remove('show');
    }, 3000);
}

// Logout
async function logout() {
    try {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'same-origin'
        });
        window.location.href = '/admin-login.html';
    } catch (err) {
        console.error('Logout error:', err);
    }
}

// Initialize
window.onload = function() {
    loadOverviewStats();
    loadProducts();
    loadCategories();
};

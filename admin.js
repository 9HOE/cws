// admin.js

let adminToken = null;

// Admin login
function setupLoginForm() {
  const form = document.getElementById('admin-login-form');
  const messageEl = document.getElementById('admin-login-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    const credentials = {
      username: document.getElementById('admin-username').value.trim(),
      password: document.getElementById('admin-password').value.trim()
    };

    if (!credentials.username || !credentials.password) {
      showMessage(messageEl, 'Please enter username and password.', 'error');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch(API_CONFIG.getUrl('adminLogin'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        adminToken = data.token;
        showMessage(messageEl, 'Login successful!', 'success');
        loadLeads();
        loadPendingReviews();
        document.getElementById('admin-login-section').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
      } else {
        showMessage(messageEl, data.error || 'Login failed.', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      showMessage(messageEl, 'Unable to login. Try again later.', 'error');
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });
}

// Load leads
async function loadLeads() {
  if (!adminToken) return;

  const container = document.getElementById('leads-container');
  container.innerHTML = 'Loading leads...';

  try {
    const res = await fetch(API_CONFIG.getUrl('adminLeads'), {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();

    if (res.ok && data.leads) {
      container.innerHTML = data.leads.map(l => `
        <div class="lead-card">
          <p><strong>${l.name}</strong> - ${l.email}</p>
          <p>${l.message}</p>
          <p>${new Date(l.created_at).toLocaleString()}</p>
        </div>
      `).join('');
    } else {
      container.innerHTML = 'No leads found.';
    }
  } catch (err) {
    console.error('Error loading leads:', err);
    container.innerHTML = 'Failed to load leads.';
  }
}

// Load pending reviews for approval
async function loadPendingReviews() {
  if (!adminToken) return;

  const container = document.getElementById('pending-reviews-container');
  container.innerHTML = 'Loading reviews...';

  try {
    const res = await fetch(API_CONFIG.getUrl('adminReviews'), {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();

    if (res.ok && data.reviews) {
      container.innerHTML = data.reviews.map(r => `
        <div class="review-card">
          <p><strong>${r.name}</strong> (${r.rating}★)</p>
          <p>${r.review}</p>
          <button onclick="approveReview('${r.id}')">Approve</button>
          <button onclick="rejectReview('${r.id}')">Reject</button>
        </div>
      `).join('');
    } else {
      container.innerHTML = 'No pending reviews.';
    }
  } catch (err) {
    console.error('Error loading reviews:', err);
    container.innerHTML = 'Failed to load reviews.';
  }
}

// Approve review
async function approveReview(id) {
  if (!adminToken) return;
  try {
    await fetch(`${API_CONFIG.getUrl('adminReviews')}/approve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ id })
    });
    loadPendingReviews();
  } catch (err) {
    console.error('Error approving review:', err);
  }
}

// Reject review
async function rejectReview(id) {
  if (!adminToken) return;
  try {
    await fetch(`${API_CONFIG.getUrl('adminReviews')}/reject`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ id })
    });
    loadPendingReviews();
  } catch (err) {
    console.error('Error rejecting review:', err);
  }
}

// Reuse message helper
function showMessage(el, message, type) {
  el.textContent = message;
  el.className = 'form-message ' + type;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupLoginForm();
});
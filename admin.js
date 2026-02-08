// Admin dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
  setupLoginForm();
  setupLogout();
  setupRefreshButtons();
});

// Check if already authenticated
function checkAuth() {
  const token = sessionStorage.getItem('adminToken');
  if (token) {
    showDashboard();
  }
}

// Setup login form
function setupLoginForm() {
  const form = document.getElementById('login-form');
  const messageEl = document.getElementById('login-message');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    const password = document.getElementById('admin-password').value;
    
    try {
      const response = await fetch(API_CONFIG.getUrl('adminLogin'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        sessionStorage.setItem('adminToken', data.token);
        showDashboard();
      } else {
        showMessage(messageEl, data.error || 'Invalid password', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showMessage(messageEl, 'Unable to login. Please try again.', 'error');
    }
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });
}

// Show dashboard after login
function showDashboard() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'block';
  loadLeads();
  loadPendingReviews();
}

// Setup logout
function setupLogout() {
  document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('adminToken');
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-password').value = '';
  });
}

// Setup refresh buttons
function setupRefreshButtons() {
  document.getElementById('refresh-leads').addEventListener('click', loadLeads);
  document.getElementById('refresh-reviews').addEventListener('click', loadPendingReviews);
}

// Load leads
async function loadLeads() {
  const container = document.getElementById('leads-container');
  const token = sessionStorage.getItem('adminToken');
  
  container.innerHTML = '<p>Loading leads...</p>';
  
  try {
    const response = await fetch(API_CONFIG.getUrl('adminLeads'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.leads) {
      if (data.leads.length === 0) {
        container.innerHTML = '<p>No leads yet.</p>';
      } else {
        container.innerHTML = createLeadsTable(data.leads);
        setupLeadStatusHandlers();
      }
    } else {
      container.innerHTML = '<p>Failed to load leads.</p>';
    }
  } catch (error) {
    console.error('Error loading leads:', error);
    container.innerHTML = '<p>Unable to load leads.</p>';
  }
}

// Create leads table HTML
function createLeadsTable(leads) {
  return `
    <div class="table-responsive">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${leads.map(lead => `
            <tr>
              <td>${formatDate(lead.created_at)}</td>
              <td>${escapeHtml(lead.name)}</td>
              <td><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></td>
              <td>${lead.phone ? `<a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a>` : '-'}</td>
              <td class="message-cell">${lead.message ? escapeHtml(lead.message) : '-'}</td>
              <td><span class="status-badge status-${lead.status}">${lead.status}</span></td>
              <td>
                <select class="status-select" data-lead-id="${lead.id}">
                  <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New</option>
                  <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                  <option value="qualified" ${lead.status === 'qualified' ? 'selected' : ''}>Qualified</option>
                  <option value="closed" ${lead.status === 'closed' ? 'selected' : ''}>Closed</option>
                </select>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Setup lead status change handlers
function setupLeadStatusHandlers() {
  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async function() {
      const leadId = this.dataset.leadId;
      const newStatus = this.value;
      const token = sessionStorage.getItem('adminToken');
      
      try {
        const response = await fetch(API_CONFIG.getUrl('adminLeads'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: leadId, status: newStatus })
        });
        
        if (response.ok) {
          loadLeads(); // Refresh the table
        } else {
          alert('Failed to update lead status');
        }
      } catch (error) {
        console.error('Error updating lead:', error);
        alert('Error updating lead status');
      }
    });
  });
}

// Load pending reviews
async function loadPendingReviews() {
  const container = document.getElementById('pending-reviews-container');
  const token = sessionStorage.getItem('adminToken');
  
  container.innerHTML = '<p>Loading reviews...</p>';
  
  try {
    const response = await fetch(API_CONFIG.getUrl('adminReviews'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok && data.reviews) {
      if (data.reviews.length === 0) {
        container.innerHTML = '<p>No pending reviews.</p>';
      } else {
        container.innerHTML = createReviewsTable(data.reviews);
        setupReviewActionHandlers();
      }
    } else {
      container.innerHTML = '<p>Failed to load reviews.</p>';
    }
  } catch (error) {
    console.error('Error loading reviews:', error);
    container.innerHTML = '<p>Unable to load reviews.</p>';
  }
}

// Create reviews table HTML
function createReviewsTable(reviews) {
  return `
    <div class="table-responsive">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${reviews.map(review => `
            <tr>
              <td>${formatDate(review.created_at)}</td>
              <td>${escapeHtml(review.name)}</td>
              <td>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</td>
              <td class="message-cell">${escapeHtml(review.review)}</td>
              <td>
                <button class="btn btn-primary btn-sm approve-btn" data-review-id="${review.id}">Approve</button>
                <button class="btn btn-outline btn-sm delete-btn" data-review-id="${review.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Setup review action handlers
function setupReviewActionHandlers() {
  const token = sessionStorage.getItem('adminToken');
  
  document.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const reviewId = this.dataset.reviewId;
      await handleReviewAction(reviewId, 'approve', token);
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      if (confirm('Are you sure you want to delete this review?')) {
        const reviewId = this.dataset.reviewId;
        await handleReviewAction(reviewId, 'delete', token);
      }
    });
  });
}

// Handle review action (approve/delete)
async function handleReviewAction(reviewId, action, token) {
  try {
    const response = await fetch(API_CONFIG.getUrl('adminReviews'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: reviewId, action: action })
    });
    
    if (response.ok) {
      loadPendingReviews(); // Refresh the table
    } else {
      alert(`Failed to ${action} review`);
    }
  } catch (error) {
    console.error(`Error ${action}ing review:`, error);
    alert(`Error ${action}ing review`);
  }
}

// Helper functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = 'form-message ' + type;
  element.style.display = 'block';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

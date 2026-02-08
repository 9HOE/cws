// reviews.js

// Load approved reviews on page load
async function loadReviews() {
  const container = document.getElementById('reviews-container');
  container.innerHTML = 'Loading reviews...';

  try {
    const res = await fetch(API_CONFIG.getUrl('reviews'));
    const data = await res.json();

    if (res.ok && data.reviews && data.reviews.length > 0) {
      container.innerHTML = data.reviews.map(createReviewCard).join('');
    } else {
      container.innerHTML = 'No reviews yet. Be the first to leave a review!';
    }
  } catch (err) {
    console.error('Error loading reviews:', err);
    container.innerHTML = 'Unable to load reviews at this time.';
  }
}

// Create HTML for a review card
function createReviewCard(review) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return `
    <div class="review-card">
      <div class="review-header">
        <span class="review-stars">${stars}</span>
        <span class="review-date">${date}</span>
      </div>
      <p class="review-text">${escapeHtml(review.review)}</p>
      <p class="review-name">— ${escapeHtml(review.name)}</p>
    </div>
  `;
}

// Setup submission form
function setupReviewForm() {
  const form = document.getElementById('review-form');
  const messageEl = document.getElementById('review-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    const formData = {
      name: document.getElementById('review-name').value.trim(),
      rating: parseInt(document.getElementById('review-rating').value),
      review: document.getElementById('review-text').value.trim()
    };

    if (!formData.name || !formData.rating || !formData.review) {
      showMessage(messageEl, 'Please fill in all fields.', 'error');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch(API_CONFIG.getUrl('reviewSubmit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showMessage(messageEl, 'Thank you! Your review will be displayed after approval.', 'success');
        form.reset();
      } else {
        showMessage(messageEl, data.error || 'Failed to submit review.', 'error');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      showMessage(messageEl, 'Unable to submit review. Please try later.', 'error');
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });
}

// Show messages
function showMessage(el, message, type) {
  el.textContent = message;
  el.className = 'form-message ' + type;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

// Escape HTML
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadReviews();
  setupReviewForm();
});
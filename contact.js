// contact.js

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const messageEl = document.getElementById('contact-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = {
      name: document.getElementById('contact-name').value.trim(),
      email: document.getElementById('contact-email').value.trim(),
      message: document.getElementById('contact-message-text').value.trim()
    };

    if (!formData.name || !formData.email || !formData.message) {
      showMessage(messageEl, 'Please fill in all fields.', 'error');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch(API_CONFIG.getUrl('leadSubmit'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showMessage(messageEl, 'Message sent! We will get back to you soon.', 'success');
        form.reset();
      } else {
        showMessage(messageEl, data.error || 'Failed to send message.', 'error');
      }
    } catch (err) {
      console.error('Error sending contact message:', err);
      showMessage(messageEl, 'Unable to send message. Please try later.', 'error');
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });
}

// Reuse message helper
function showMessage(el, message, type) {
  el.textContent = message;
  el.className = 'form-message ' + type;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  setupContactForm();
});
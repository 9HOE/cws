// Contact form functionality

document.addEventListener('DOMContentLoaded', function() {
  setupContactForm();
});

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  const messageEl = document.getElementById('contact-message-status');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const formData = {
      name: document.getElementById('contact-name').value.trim(),
      email: document.getElementById('contact-email').value.trim(),
      phone: document.getElementById('contact-phone').value.trim(),
      message: document.getElementById('contact-message').value.trim()
    };
    
    // Validate required fields
    if (!formData.name || !formData.email) {
      showMessage(messageEl, 'Please fill in your name and email.', 'error');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showMessage(messageEl, 'Please enter a valid email address.', 'error');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }
    
    try {
      const response = await fetch(API_CONFIG.getUrl('leadSubmit'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        showMessage(messageEl, 'Thank you! We\'ll be in touch soon.', 'success');
        form.reset();
      } else {
        showMessage(messageEl, data.error || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showMessage(messageEl, 'Unable to send message. Please call us instead.', 'error');
    }
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  });
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.className = 'form-message ' + type;
  element.style.display = 'block';
  
  if (type === 'success') {
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }
}

// api-config.js
const API_CONFIG = {
  getUrl: (key) => {
    switch (key) {
      case 'reviewSubmit': return '/api/review-submit';
      case 'reviews': return '/api/reviews';
      case 'leadSubmit': return '/api/lead-submit';
      case 'adminLogin': return '/api/admin-login';
      case 'adminLeads': return '/api/admin-leads';
      case 'adminReviews': return '/api/admin-reviews';
      default: return '/';
    }
  }
};
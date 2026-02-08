const res = await fetch('/api/reviews')

// Load approved reviews
async function loadReviews() {
  const res = await fetch('/api/reviews-approved', {
    method: 'GET'
  })

  const data = await res.json()

  const list = document.getElementById('reviews-list')
  list.innerHTML = ''

  if (!data.reviews) return

  data.reviews.forEach(r => {
    const div = document.createElement('div')
    div.className = 'review'
    div.innerHTML = `<strong>${r.name}</strong> (${r.rating}/5)<p>${r.message}</p>`
    list.appendChild(div)
  })
}

loadReviews()

// Submit new review
document.getElementById('review-form')?.addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('review-name').value
  const rating = document.getElementById('review-rating').value
  const message = document.getElementById('review-message').value

  const res = await fetch('/api/review-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, rating, message })
  })

  const data = await res.json()

  if (data.success) {
    alert('Review submitted for approval!')
    e.target.reset()
  } else {
    alert(data.error || 'Failed to submit review.')
  }
})
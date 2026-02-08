let loggedIn = false

document.getElementById('admin-login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault()

  const password = document.getElementById('admin-password').value

  const res = await fetch('/api/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })

  const data = await res.json()

  if (data.success) {
    loggedIn = true
    document.getElementById('login-section').style.display = 'none'
    document.getElementById('admin-panel').style.display = 'block'
    loadLeads()
    loadReviews()
  } else {
    alert('Invalid password')
  }
})

async function loadLeads() {
  const res = await fetch('/api/admin-leads')
  const data = await res.json()

  const list = document.getElementById('leads-list')
  list.innerHTML = ''

  data.leads.forEach(l => {
    const li = document.createElement('li')
    li.textContent = `${l.name} (${l.email}): ${l.message}`
    list.appendChild(li)
  })
}

async function loadReviews() {
  const res = await fetch('/api/admin-reviews')
  const data = await res.json()

  const list = document.getElementById('pending-reviews')
  list.innerHTML = ''

  data.reviews.forEach(r => {
    const div = document.createElement('div')
    div.innerHTML = `
      <strong>${r.name}</strong> (${r.rating}/5)
      <p>${r.message}</p>
      <button onclick="approveReview('${r.id}')">Approve</button>
    `
    list.appendChild(div)
  })
}

async function approveReview(id) {
  await fetch('/api/reviews-approved', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })

  loadReviews()
}
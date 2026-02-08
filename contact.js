document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  const message = document.getElementById('message').value

  const res = await fetch('/api/lead-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  })

  const data = await res.json()

  if (data.success) {
    alert('Message sent!')
    e.target.reset()
  } else {
    alert(data.error || 'Something went wrong.')
  }
})
async function submitContact() {
  const btn = document.getElementById('send-btn');
  const status = document.getElementById('form-status');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    status.className = 'status-error';
    status.textContent = 'Please fill in all required fields.';
    status.style.display = 'block';
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;
  status.style.display = 'none';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });

    const data = await res.json();

    if (res.ok) {
      status.className = 'status-success';
      status.textContent = "Message sent! I'll get back to you within 24 hours.";
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('subject').value = '';
      document.getElementById('message').value = '';
    } else {
      status.className = 'status-error';
      status.textContent = data.error || 'Something went wrong. Please try again.';
    }
  } catch (err) {
    status.className = 'status-error';
    status.textContent = 'Could not reach the server. Please try again later.';
  }

  status.style.display = 'block';
  btn.textContent = 'Send message';
  btn.disabled = false;
}
// api/contact.js
// Vercel Serverless Function — handles contact form submissions

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (name.length > 100 || message.length > 2000) {
    return res.status(400).json({ error: 'Input too long.' });
  }

  const submission = {
    name:      name.trim(),
    email:     email.trim().toLowerCase(),
    subject:   (subject || '').trim(),
    message:   message.trim(),
    timestamp: new Date().toISOString(),
  };

  // ─── Email via Resend (recommended for Vercel) ─────────────────
  // 1. Sign up at https://resend.com (free tier: 3000 emails/mo)
  // 2. Add RESEND_API_KEY to your Vercel environment variables
  // 3. Add CONTACT_EMAIL (the address you want to receive messages at)
  // 4. Uncomment the block below:
  //
  // if (process.env.RESEND_API_KEY) {
  //   await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       from: 'Portfolio <onboarding@resend.dev>',
  //       to:   [process.env.CONTACT_EMAIL],
  //       reply_to: submission.email,
  //       subject:  `[Portfolio] ${submission.subject || 'New message from ' + submission.name}`,
  //       text: [
  //         `Name: ${submission.name}`,
  //         `Email: ${submission.email}`,
  //         `Subject: ${submission.subject || '—'}`,
  //         '',
  //         submission.message,
  //       ].join('\n'),
  //     }),
  //   });
  // }

  console.log('[Contact] Submission from:', submission.email);
  return res.status(200).json({ success: true, message: 'Message received!' });
}
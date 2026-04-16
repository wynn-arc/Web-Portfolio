

export default async function handler(req, res) {
  const username = process.env.GITHUB_USERNAME;

  if (!username) {
    return res.status(500).json({ error: 'GITHUB_USERNAME env var not set.' });
  }

  try {
    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const ghRes = await fetch(`https://api.github.com/users/${username}`, { headers });

    if (!ghRes.ok) {
      const err = await ghRes.json();
      return res.status(ghRes.status).json({ error: err.message || 'GitHub API error' });
    }

    const data = await ghRes.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

    return res.status(200).json({
      login:        data.login,
      name:         data.name,
      bio:          data.bio,
      avatar_url:   data.avatar_url,
      html_url:     data.html_url,
      public_repos: data.public_repos,
      followers:    data.followers,
      following:    data.following,
    });

  } catch (err) {
    console.error('[GitHub Profile]', err.message);
    return res.status(500).json({ error: 'Failed to fetch GitHub profile.' });
  }
}
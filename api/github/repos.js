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

    const ghRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
      { headers }
    );

    if (!ghRes.ok) {
      const err = await ghRes.json();
      return res.status(ghRes.status).json({ error: err.message || 'GitHub API error' });
    }

    const repos = await ghRes.json();

    const top = repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map(r => ({
        id:               r.id,
        name:             r.name,
        description:      r.description,
        html_url:         r.html_url,
        language:         r.language,
        stargazers_count: r.stargazers_count,
        forks_count:      r.forks_count,
        topics:           r.topics,
        updated_at:       r.updated_at,
      }));

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(top);

  } catch (err) {
    console.error('[GitHub Repos]', err.message);
    return res.status(500).json({ error: 'Failed to fetch GitHub repos.' });
  }
}
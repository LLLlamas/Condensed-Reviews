import 'dotenv/config';

const TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';
const API_BASE = 'https://oauth.reddit.com';

let cachedToken = null;
let tokenExpiresAt = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function userAgent() {
  return process.env.REDDIT_USER_AGENT || 'court-report-scraper/0.1';
}

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;

  const { REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD } = process.env;
  if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
    throw new Error('REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET missing in .env');
  }

  const auth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64');
  const body = REDDIT_USERNAME && REDDIT_PASSWORD
    ? new URLSearchParams({ grant_type: 'password', username: REDDIT_USERNAME, password: REDDIT_PASSWORD })
    : new URLSearchParams({ grant_type: 'client_credentials' });

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': userAgent(),
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Reddit auth failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
  return cachedToken;
}

async function redditFetch(path, params = {}, { retries = 3 } = {}) {
  const token = await getAccessToken();
  const url = new URL(API_BASE + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': userAgent() },
    });

    if (res.status === 429 || res.status >= 500) {
      const wait = 2000 * (attempt + 1);
      console.warn(`[reddit] ${res.status} on ${url.pathname} — retrying in ${wait}ms`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) {
      throw new Error(`Reddit fetch ${url.pathname} failed: ${res.status} ${await res.text()}`);
    }
    return res.json();
  }
  throw new Error(`Reddit fetch ${url.pathname} exhausted retries`);
}

export async function listSubredditPosts({
  subreddit,
  sort = 'new',
  timeRange,
  pageDelayMs = 800,
  maxPages = 20,
}) {
  const out = [];
  let cursor = null;
  for (let page = 0; page < maxPages; page++) {
    const params = { limit: 100, after: cursor };
    if (timeRange && (sort === 'top' || sort === 'controversial')) params.t = timeRange;
    const data = await redditFetch(`/r/${subreddit}/${sort}.json`, params);
    const children = data.data?.children ?? [];
    if (children.length === 0) break;
    out.push(...children.map((c) => c.data));
    cursor = data.data?.after;
    if (!cursor) break;
    await sleep(pageDelayMs);
  }
  return out;
}

export async function searchSubredditPosts({
  subreddit,
  query,
  sort = 'new',
  timeRange = 'year',
  pageDelayMs = 800,
  maxPages = 20,
}) {
  const out = [];
  let cursor = null;
  for (let page = 0; page < maxPages; page++) {
    const data = await redditFetch(`/r/${subreddit}/search.json`, {
      q: query,
      restrict_sr: 1,
      sort,
      t: timeRange,
      limit: 100,
      after: cursor,
    });
    const children = data.data?.children ?? [];
    if (children.length === 0) break;
    out.push(...children.map((c) => c.data));
    cursor = data.data?.after;
    if (!cursor) break;
    await sleep(pageDelayMs);
  }
  return out;
}

export async function getPostWithComments(postId, { commentLimit = 50, delayMs = 800 } = {}) {
  const data = await redditFetch(`/comments/${postId}.json`, { limit: commentLimit, depth: 2 });
  const post = data[0]?.data?.children?.[0]?.data;
  const comments = (data[1]?.data?.children ?? [])
    .filter((c) => c.kind === 't1')
    .map((c) => ({
      author: c.data.author,
      body: c.data.body,
      score: c.data.score,
      created_utc: c.data.created_utc,
    }));
  await sleep(delayMs);
  return { post, comments };
}

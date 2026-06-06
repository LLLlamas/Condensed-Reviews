import 'dotenv/config';
import { searchSubredditPosts, getPostWithComments } from './lib/reddit.js';
import { isLikelyPerformanceReview, dropDeletedOrRemoved } from './lib/filter.js';
import { condensePost } from './lib/condense.js';
import { loadReviews, saveReviews, mergeByRedditId, OUTPUT_PATH } from './lib/store.js';

// Reddit's listing endpoints cap at ~1000 items per search query, so we sweep
// multiple queries × time ranges to maximize unique post coverage.
const TARGETS = [
  { subreddit: 'BBallShoes', sport: 'basketball' },
  { subreddit: 'RunningShoeGeeks', sport: 'running' },
  { subreddit: 'AskRunningShoeGeeks', sport: 'running' },
];

const SEARCH_QUERIES_BASKETBALL = [
  'review',
  'performance review',
  'thoughts',
  'verdict',
  'impressions',
  'breakdown',
  'after',
  'hooping in',
];

const SEARCH_QUERIES_RUNNING = [
  'review',
  'performance review',
  'thoughts',
  'verdict',
  'impressions',
  'long term',
  'miles in',
  'running in',
  'after',
];

const TIME_RANGES = ['year', 'all'];

async function sweepSubreddit({ subreddit, sport }, existing) {
  const queries = sport === 'running' ? SEARCH_QUERIES_RUNNING : SEARCH_QUERIES_BASKETBALL;
  const seen = new Set();
  const candidates = [];

  console.log(`\n--- sweeping r/${subreddit} (${sport}) ---`);
  for (const q of queries) {
    for (const t of TIME_RANGES) {
      console.log(`[search] r/${subreddit} q="${q}" t=${t}`);
      try {
        const posts = await searchSubredditPosts({ subreddit, query: q, sort: 'new', timeRange: t });
        let added = 0;
        for (const p of posts) {
          if (seen.has(p.id)) continue;
          seen.add(p.id);
          candidates.push({ ...p, _sport: sport, _subreddit: subreddit });
          added++;
        }
        console.log(`  -> ${posts.length} returned, ${added} new (${candidates.length} unique total)`);
      } catch (e) {
        console.error(`  search failed: ${e.message}`);
      }
    }
  }

  const filtered = candidates.filter(dropDeletedOrRemoved).filter(isLikelyPerformanceReview);
  console.log(`Filtered ${candidates.length} -> ${filtered.length} likely performance reviews`);

  const existingIds = new Set(existing.map((r) => r.redditId));
  return filtered.filter((p) => !existingIds.has(p.id));
}

async function main() {
  console.log('=== backfill: starting ===');
  console.log(`subreddits: ${TARGETS.map((t) => `r/${t.subreddit}`).join(', ')}`);
  console.log(`output:     ${OUTPUT_PATH}\n`);

  const existing = await loadReviews();

  // 1. Sweep all subreddits for candidates
  const allTodo = [];
  for (const target of TARGETS) {
    const todo = await sweepSubreddit(target, existing);
    allTodo.push(...todo);
  }
  console.log(`\n${allTodo.length} total posts to condense across all subreddits\n`);

  // 2. Condense via LLM, persist incrementally so we don't lose progress
  const newReviews = [];
  let totals = { input: 0, output: 0, cacheRead: 0, cacheCreate: 0 };
  for (let i = 0; i < allTodo.length; i++) {
    const p = allTodo[i];
    const label = `[${i + 1}/${allTodo.length}] r/${p._subreddit} ${p.title.slice(0, 60)}`;
    process.stdout.write(label.padEnd(85, ' ') + ' ');
    try {
      const { post, comments } = await getPostWithComments(p.id);
      const review = await condensePost({ post, comments, sport: p._sport, subreddit: p._subreddit });
      if (!review) {
        console.log('SKIP');
        continue;
      }
      const u = review._usage || {};
      totals.input += u.inputTokens || 0;
      totals.output += u.outputTokens || 0;
      totals.cacheRead += u.cacheReadTokens || 0;
      totals.cacheCreate += u.cacheCreationTokens || 0;
      delete review._usage;
      newReviews.push(review);
      console.log('OK');

      // Persist every 10 to survive crashes
      if (newReviews.length % 10 === 0) {
        await saveReviews(mergeByRedditId(existing, newReviews));
      }
    } catch (e) {
      console.log(`FAIL: ${e.message}`);
    }
  }

  // 3. Final merge + save
  const merged = mergeByRedditId(existing, newReviews);
  await saveReviews(merged);

  console.log(`\n=== backfill: done ===`);
  console.log(`  ${newReviews.length} new reviews condensed`);
  console.log(`  ${merged.length} total in dataset`);
  console.log(`  tokens — input: ${totals.input}, output: ${totals.output}, cache read: ${totals.cacheRead}, cache create: ${totals.cacheCreate}`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});

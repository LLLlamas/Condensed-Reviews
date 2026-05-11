import 'dotenv/config';
import { searchSubredditPosts, getPostWithComments } from './lib/reddit.js';
import { isLikelyPerformanceReview, dropDeletedOrRemoved } from './lib/filter.js';
import { condensePost } from './lib/condense.js';
import { loadReviews, saveReviews, mergeByRedditId, OUTPUT_PATH } from './lib/store.js';

const SUBREDDIT = 'BBallShoes';

// Reddit's listing endpoints cap at ~1000 items via pagination, so /new alone
// can't reach 5y. We sweep the search endpoint with multiple queries × time
// ranges to maximize unique post coverage. For deeper historical depth (full
// 5y guarantee) supplement this with Pushshift archive dumps — see scripts/README.md.
const SEARCH_QUERIES = [
  'review',
  'performance review',
  'thoughts',
  'verdict',
  'impressions',
  'breakdown',
  'after',
];
const TIME_RANGES = ['year', 'all'];

async function main() {
  console.log('=== backfill: starting ===');
  console.log(`subreddit: r/${SUBREDDIT}`);
  console.log(`output:    ${OUTPUT_PATH}\n`);

  // 1. Sweep candidate posts via search
  const seen = new Set();
  const candidates = [];
  for (const q of SEARCH_QUERIES) {
    for (const t of TIME_RANGES) {
      console.log(`[search] q="${q}" t=${t}`);
      try {
        const posts = await searchSubredditPosts({
          subreddit: SUBREDDIT,
          query: q,
          sort: 'new',
          timeRange: t,
        });
        let added = 0;
        for (const p of posts) {
          if (seen.has(p.id)) continue;
          seen.add(p.id);
          candidates.push(p);
          added++;
        }
        console.log(`  -> ${posts.length} returned, ${added} new (${candidates.length} unique total)`);
      } catch (e) {
        console.error(`  search failed: ${e.message}`);
      }
    }
  }

  // 2. Filter to likely performance reviews
  const reviews = candidates.filter(dropDeletedOrRemoved).filter(isLikelyPerformanceReview);
  console.log(`\nFiltered ${candidates.length} candidates -> ${reviews.length} likely performance reviews`);

  // 3. Skip already-condensed
  const existing = await loadReviews();
  const existingIds = new Set(existing.map((r) => r.redditId));
  const todo = reviews.filter((p) => !existingIds.has(p.id));
  console.log(`${reviews.length - todo.length} already in dataset, ${todo.length} to condense\n`);

  // 4. Condense via LLM, persist incrementally so we don't lose progress
  const newReviews = [];
  let totals = { input: 0, output: 0, cacheRead: 0, cacheCreate: 0 };
  for (let i = 0; i < todo.length; i++) {
    const p = todo[i];
    const label = `[${i + 1}/${todo.length}] ${p.title.slice(0, 70)}`;
    process.stdout.write(label.padEnd(80, ' ') + ' ');
    try {
      const { post, comments } = await getPostWithComments(p.id);
      const review = await condensePost({ post, comments });
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

  // 5. Final merge + save
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

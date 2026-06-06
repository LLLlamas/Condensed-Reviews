import 'dotenv/config';
import { listSubredditPosts, getPostWithComments } from './lib/reddit.js';
import { isLikelyPerformanceReview, dropDeletedOrRemoved } from './lib/filter.js';
import { condensePost } from './lib/condense.js';
import { loadReviews, saveReviews, mergeByRedditId, OUTPUT_PATH } from './lib/store.js';

const TARGETS = [
  { subreddit: 'BBallShoes', sport: 'basketball' },
  { subreddit: 'RunningShoeGeeks', sport: 'running' },
  { subreddit: 'AskRunningShoeGeeks', sport: 'running' },
];
const WINDOW_DAYS = 7; // overlap window — catches edits + late comments

async function main() {
  console.log('=== daily-update: starting ===');
  console.log(`subreddits: ${TARGETS.map((t) => `r/${t.subreddit}`).join(', ')}`);
  console.log(`window:     last ${WINDOW_DAYS} days`);
  console.log(`output:     ${OUTPUT_PATH}\n`);

  const cutoff = Date.now() / 1000 - WINDOW_DAYS * 86400;
  const existing = await loadReviews();
  const existingIds = new Set(existing.map((r) => r.redditId));

  const allTodo = [];
  for (const { subreddit, sport } of TARGETS) {
    console.log(`Fetching /new from r/${subreddit}...`);
    const recent = await listSubredditPosts({ subreddit, sort: 'new' });
    const inWindow = recent.filter((p) => p.created_utc >= cutoff);
    console.log(`  ${inWindow.length} of ${recent.length} posts in window`);
    const filtered = inWindow.filter(dropDeletedOrRemoved).filter(isLikelyPerformanceReview);
    const todo = filtered.filter((p) => !existingIds.has(p.id));
    console.log(`  ${filtered.length} look like reviews, ${todo.length} new\n`);
    allTodo.push(...todo.map((p) => ({ ...p, _sport: sport, _subreddit: subreddit })));
  }

  console.log(`${allTodo.length} total new posts to condense\n`);

  const newReviews = [];
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
      delete review._usage;
      newReviews.push(review);
      console.log('OK');
    } catch (e) {
      console.log(`FAIL: ${e.message}`);
    }
  }

  const merged = mergeByRedditId(existing, newReviews);
  await saveReviews(merged);

  console.log(`\n=== daily-update: done ===`);
  console.log(`  ${newReviews.length} new reviews condensed`);
  console.log(`  ${merged.length} total in dataset`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});

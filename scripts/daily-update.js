import 'dotenv/config';
import { listSubredditPosts, getPostWithComments } from './lib/reddit.js';
import { isLikelyPerformanceReview, dropDeletedOrRemoved } from './lib/filter.js';
import { condensePost } from './lib/condense.js';
import { loadReviews, saveReviews, mergeByRedditId, OUTPUT_PATH } from './lib/store.js';

const SUBREDDIT = 'BBallShoes';
const WINDOW_DAYS = 7; // overlap window — catches edits + late comments

async function main() {
  console.log('=== daily-update: starting ===');
  console.log(`subreddit: r/${SUBREDDIT}`);
  console.log(`window:    last ${WINDOW_DAYS} days`);
  console.log(`output:    ${OUTPUT_PATH}\n`);

  const cutoff = Date.now() / 1000 - WINDOW_DAYS * 86400;

  console.log('Fetching /new...');
  const recent = await listSubredditPosts({ subreddit: SUBREDDIT, sort: 'new' });
  const inWindow = recent.filter((p) => p.created_utc >= cutoff);
  console.log(`${inWindow.length} of ${recent.length} posts fall in window\n`);

  const reviews = inWindow.filter(dropDeletedOrRemoved).filter(isLikelyPerformanceReview);
  console.log(`${reviews.length} look like performance reviews`);

  const existing = await loadReviews();
  const existingIds = new Set(existing.map((r) => r.redditId));
  const todo = reviews.filter((p) => !existingIds.has(p.id));
  console.log(`${todo.length} new (not yet in dataset)\n`);

  const newReviews = [];
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

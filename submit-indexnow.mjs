// ---------------------------------------------------------------------------
// submit-indexnow.mjs
// Submits ALL pages from deer-antler.jewelry to IndexNow (Bing) in one go.
// Reads URLs automatically from your live sitemap so nothing is missed.
//
// HOW TO RUN:
//   Open VS Code terminal and run:
//   node submit-indexnow.mjs
// ---------------------------------------------------------------------------

const SITE     = 'https://deer-antler.jewelry';
const KEY      = '567eabed3f7049aa92b5fa2f7d12972d';
const SITEMAP  = `${SITE}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function fetchSitemapUrls() {
  console.log(`\nFetching sitemap: ${SITEMAP}`);
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`Sitemap fetch failed: HTTP ${res.status}`);
  const xml = await res.text();

  // Extract all <loc> values
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  const urls = matches.map(m => m[1].trim()).filter(Boolean);
  console.log(`Found ${urls.length} URLs in sitemap.`);
  return urls;
}

async function submitToIndexNow(urls) {
  // IndexNow accepts up to 10,000 URLs per request
  const body = {
    host:        'deer-antler.jewelry',
    key:         KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList:     urls,
  };

  console.log(`\nSubmitting ${urls.length} URLs to IndexNow...`);

  const res = await fetch(ENDPOINT, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body:    JSON.stringify(body),
  });

  if (res.ok || res.status === 202) {
    console.log(`\n✅ Success! IndexNow accepted the submission.`);
    console.log(`   HTTP ${res.status} — Bing will begin crawling your pages shortly.`);
    console.log(`\n   Check status at: https://www.bing.com/webmasters → IndexNow tab\n`);
  } else {
    const text = await res.text().catch(() => '');
    console.error(`\n❌ Submission failed: HTTP ${res.status}`);
    console.error(`   Response: ${text}`);
    console.error(`\n   Common causes:`);
    console.error(`   - Key file not yet deployed (push to GitHub first)`);
    console.error(`   - DNS not fully propagated yet`);
    console.error(`   Try again in a few minutes.\n`);
  }
}

// Main
(async () => {
  try {
    const urls = await fetchSitemapUrls();
    if (urls.length === 0) {
      console.error('No URLs found in sitemap. Is the site deployed?');
      process.exit(1);
    }
    await submitToIndexNow(urls);
  } catch (err) {
    console.error(`\n❌ Error: ${err.message}`);
    console.error('Make sure the site is live at https://deer-antler.jewelry before running this script.\n');
    process.exit(1);
  }
})();

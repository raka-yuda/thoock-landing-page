import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
for (const [path, heading] of [['dist/index.html', 'Your stock-content workflow.'], ['dist/changelog/index.html', 'What’s new.']]) {
  const html = await readFile(path, 'utf8');
  assert.match(html, /<h1[ >]/, `${path} must paint meaningful content before React loads`);
  assert.ok(html.includes(heading), `${path} is missing its page heading`);
  assert.ok(html.includes('data-prerendered="true"'), `${path} must hydrate its existing markup`);
  assert.ok(html.includes('/#download'), `${path} is missing download access`);
  console.log(`Static HTML verified: ${path}`);
}

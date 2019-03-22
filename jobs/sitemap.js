require('dotenv').config()
const path = require('path');
const builder = require('xmlbuilder');
const fs = require('fs');
const contentful = require('contentful');   
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const host = 'cdn.contentful.com';

const client = contentful.createClient({
  space: spaceId,
  accessToken: accessToken,
  host: host,
  resolveLinks: false
});

(async function() {
  // get all content types that need to be added as pages
  const pages = await client.getEntries({ content_type: 'page' });
  const series = await client.getEntries({ content_type: 'articles' });

  let feedObject = {
    'urlset': {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      '@xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
      'url': []
    }
  }

  for (const item of pages.items) {
    if (typeof item.fields !== 'undefined') {
      feedObject.urlset.url.push(
        buildUrlObject(`/${item.fields.slug}`, item.sys.updatedAt)
      );
    }
  }

  for (const item of articles.items) {
    if (typeof item.fields !== 'undefined') {
      feedObject.urlset.url.push(
        buildUrlObject(`/articles/${item.fields.slug}`, item.sys.updatedAt)
      )
    }
  }

  const feed = builder.create(feedObject, { encoding: 'utf-8' })

  fs.writeFile(path.join(__dirname, '../static/sitemap.xml'), feed.end({ pretty: true }), 'utf8', (err) => {
    if (err) throw err;

    console.log('File saved success...');
  })
  
})();

function buildUrlObject(path, updatedAt) {
  return {
    'loc': { '#text': `https://www.yourdomain.com${path}` },
    'lastmod': { '#text': updatedAt.split('T')[0] },
    'changfreq': { '#text': 'daily' },
    'priority': { '#text': '1.0' }
  }
}
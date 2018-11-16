const LRUCache = require('lru-cache');

class Cache {
    constructor(app, req, res, pagePath, queryParams) {
        this.ssrCache = new LRUCache({
            max: 100,
            maxAge: 1000 * 60 * 60 // 1 hour
        });

        this.app = app;
        this.req = req;
        this.res = res;
        this.pagePath = pagePath;
        this.queryParams = queryParams;
    }

    getCacheKey() {
        return `${req.url}`;
    }

    async renderAndCache() {
        const key = getCacheKey(this.req);

        // If we have a page in the cache, let's serve it
        if (ssrCache.has(key)) {
            console.log('cache hit');
            this.res.setHeader('x-cache', 'HIT');
            return this.res.send(ssrCache.get(key));
        }

        try {
            console.log('non-cached');
            // If not let's render the page into HTML
            const html = await this.app.renderToHTML(this.req, this.res, this.pagePath, this.queryParams)

            // Something is wrong with the request, let's skip the cache
            if (this.res.statusCode !== 200) {
                return this.res.send(html);
            }

            // Let's cache this page
            this.ssrCache.set(key, html);

            this.res.setHeader('x-cache', 'MISS');
            this.res.send(html);
        } catch (err) {
            this.app.renderError(err, req, res, pagePath, queryParams);
        }
    }
}

// const ssrCache = new LRUCache({
//     max: 100,
//     maxAge: 1000 * 60 * 60 // 1hour
// });

// function getCacheKey (req) {
//     return `${req.url}`;
// }

// async function renderAndCache(app, req, res, pagePath, queryParams) {
//     const key = getCacheKey(req);

//     // If we have a page in the cache, let's serve it
//     if (ssrCache.has(key)) {
//         console.log('cache hit');
//         res.setHeader('x-cache', 'HIT');
//         return res.send(ssrCache.get(key));
//     }

//     try {
//         console.log('non-cached');
//         // If not let's render the page into HTML
//         const html = await app.renderToHTML(req, res, pagePath, queryParams)

//         // Something is wrong with the request, let's skip the cache
//         if (res.statusCode !== 200) {
//             return res.send(html);
//         }

//         // Let's cache this page
//         ssrCache.set(key, html);

//         res.setHeader('x-cache', 'MISS');
//         res.send(html);
//     } catch (err) {
//         app.renderError(err, req, res, pagePath, queryParams);
//     }
// }

// module.exports = {
//     renderAndCache
// };

exports.Cache = Cache;
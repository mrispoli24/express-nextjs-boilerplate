const express = require('express');
const router = express.Router();

router.use('/contentful', (req, res, next) => {
    const url = require('url');
    const contentful = require('contentful');   
    const spaceId = process.env.CONTENTFUL_SPACE_ID;
    const accessToken = process.env.CONTENTFUL_PREVIEW_MODE ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CONTENTFUL_ACCESS_TOKEN;
    const host = process.env.CONTENTFUL_PREVIEW_MODE ? 'preview.contentful.com' : 'cdn.contentful.com';

    console.log('access', accessToken);

    req.client = contentful.createClient({
        space: spaceId,
        accessToken: accessToken,
        host: host,
        resolveLinks: false
    });

    req.queryObj = {};

    const queryString = url.parse(req.url).query;

    if (queryString !== null) {
        queryString.split('&').forEach((e) => {
            let item = e.split('=');
            req.queryObj[item[0]] = item[1];
        });
    }

    next();
});

router.get('/contentful', (req, res) => {
    req.client.getEntries(req.queryObj)
    .then((response) => {
        return res.send(response);
    })
    .catch((error) => {
        return res.status(500).send(error.message);
    });
});

module.exports = router;
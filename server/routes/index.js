const express = require('express');
const router = express.Router();
const next = require('next');
const {renderAndCache} = require('../cache');
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });

app.prepare().then(() => {
    router.get('/', (req, res) => {
        const actualPage = '/index';
        renderAndCache(app, req, res, actualPage);
    });
}); 

module.exports = router;
const express = require('express');
const router = express.Router();
const next = require('next');
const {renderAndCache} = require('../cache');
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });

app.prepare().then(() => {
    router.get('/', (req, res) => {
        const actualPage = '/articles';
        renderAndCache(app, req, res, actualPage);
    });

    router.get('/:id', (req, res) => {
        const actualPage = '/article';
        const queryParams = { id: req.params.id };
        renderAndCache(app, req, res, actualPage, queryParams);
    });
}); 

module.exports = router;
const express = require('express');
const router = express.Router();
const next = require('next');
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });

app.prepare().then(() => {
    router.get('/', (req, res) => {
        const actualPage = '/articles';
        app.render(req, res, actualPage);
    });

    router.get('/:id', (req, res) => {
        const actualPage = '/article';
        const queryParams = { id: req.params.id };
        app.render(req, res, actualPage, queryParams);
    });
}); 

module.exports = router;
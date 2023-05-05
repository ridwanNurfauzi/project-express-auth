const router = require('express').Router();
const routeArtikel = require('./barang');

router.use('/barang', routeArtikel);

module.exports = router;
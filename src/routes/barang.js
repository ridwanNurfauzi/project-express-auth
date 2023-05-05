const router = require('express').Router(),
    { barang } = require('../controllers');

router.get('/', barang.getBarang);

router.get('/:kode_barang', barang.getBarangByKode_barang);

router.post('/add', barang.addBarang);

router.put('/edit/:kode_barang', barang.editBarang);

router.delete('/delete/:kode_barang', barang.deleteBarang);

module.exports = router;
const config = require('../configs/database');
const mysql = require('mysql');
const session = require('express-session');
const express = require('express');
const connection = mysql.createConnection(config);
connection.connect();

const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

const getBarang = async (req, res) => {
    try {
        const data = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM barang', (error, rows) => {
                if (rows) {
                    resolve(rows);
                } else {
                    reject([]);
                }
            });
        });

        if (data && req.session.loggedin) {
            res.send({
                success: true,
                message: "Berhasil mengambil data barang.",
                data: data
            });
        }
        else{
            res.send({
                success: false,
                message: "Silahkan login terlebih dahulu"
            });
        }
    } catch (error) {
        console.info(error)
        res.send({
            success: false,
            message: "Gagal mengambil data barang.",
            error: error.stack
        });
    }
}

const getBarangByKode_barang = async (req, res) => {
    try {
        let kode_barang = req.params.kode_barang;
        const data = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM barang WHERE id = ?', [kode_barang], (error, rows) => {
                if (rows) {
                    resolve(rows);
                } else {
                    reject([]);
                }
            });
        });

        if (data) {
            res.send({
                success: true,
                message: `Berhasil mengambil data barang dengan id ${kode_barang}.`,
                data: data
            });
        }
    } catch (error) {
        res.send({
            success: false,
            message: "Gagal mengambil data barang.",
            error: error.stack
        });
    }
}

const addBarang = async (req, res) => {
    try {
        let potongan = 0;
        if ((parseInt(req.body.harga) * parseInt(req.body.jumlah)) > 100_000) {
            potongan = 10_000;
        }
        else potongan = 0;

        let total_harga = parseInt(req.body.harga) * parseInt(req.body.jumlah) - (potongan);
        let data = {
            kode_barang: req.body.kode_barang,
            nama_barang: req.body.nama_barang,
            harga: req.body.harga,
            jumlah: req.body.jumlah,
            potongan,
            total_harga
        }

        const result = await new Promise((resolve, reject) => {
            connection.query('INSERT INTO barang SET ?', [data], (error, rows) => {
                if (rows) {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });

        if (result) {
            res.send({
                success: true,
                message: `Berhasil menambah data barang.`,
                data: data
            });
        }
    } catch (error) {
        res.send({
            success: false,
            message: "Gagal menambah data barang.",
            error: error.stack
        });
    }
}

const editBarang = async (req, res) => {
    try {
        let potongan = 0;
        if ((parseInt(req.body.harga) * parseInt(req.body.jumlah)) > 100_000) {
            potongan = 10_000;
        }
        else potongan = 0;

        let total_harga = parseInt(req.body.harga) * parseInt(req.body.jumlah) - (potongan);
        let data = {
            nama_barang: req.body.nama_barang,
            harga: req.body.harga,
            jumlah: req.body.jumlah,
            potongan,
            total_harga
        }

        const result = await new Promise((resolve, reject) => {
            connection.query('UPDATE barang SET ? WHERE kode_barang = ?', [data, req.params.kode_barang], (error, rows) => {
                if (rows) {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });

        if (result) {
            res.send({
                success: true,
                message: `Berhasil mengubah data barang.`,
                data: data
            });
        }
    } catch (error) {
        res.send({
            success: false,
            message: "Gagal mengubah data barang.",
            error: error.stack
        });
    }
}

const deleteBarang = async (req, res) => {
    try {
        let kode_barang = req.params.kode_barang;

        const result = await new Promise((resolve, reject) => {
            connection.query('DELETE FROM barang WHERE kode_barang = ?', [kode_barang], (error, rows) => {
                if (rows) {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });

        if (result) {
            res.send({
                success: true,
                message: `Berhasil menghapus data barang dengan kode barang ${kode_barang}.`
            });
        }
    } catch (error) {
        res.send({
            success: false,
            message: "Gagal menghapus data barang.",
            error: error.stack
        });
    }
}


module.exports = {
    getBarang,
    getBarangByKode_barang,
    addBarang,
    editBarang,
    deleteBarang
};
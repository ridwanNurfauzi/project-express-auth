const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const session = require('express-session');
// Definisi enviroment secara global dengan .env
require('dotenv').config();


const databaseConfig = require('./src/configs/database');

const connection = mysql.createConnection(databaseConfig);

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


// Mengubah data menjadi JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Memanggil route yang tersedia
const appRoute = require('./src/routes');
app.use(appRoute);

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password], (error, result, fields) => {
                if (error) throw error;
                if (result.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.password = password;

                    res.send({
                        success: true,
                        message: 'Login berhasil !'
                    });
                } else {
                    res.send({
                        success: false,
                        message: 'Login gagal !'
                    })
                }
                res.end();
            });
    }
    else {
        res.send({
            success: true,
            message: 'Please enter Username and Password!'
        });
        res.end();
    }
});

// Menjalankan server
app.listen(process.env.APP_PORT, () => {
    console.info(`Server berjalan di http://localhost:${process.env.APP_PORT}`);
});
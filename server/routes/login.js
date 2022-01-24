const express = require('express');

const Usuario = require('../models/usuario');
const app = express();


app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ curp: body.curp }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(CURP) o contraseña incorrectos'
                }
            });
        }

        if (body.password != usuarioDB.password) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'CURP o (contraseña) incorrectos'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
        });
    });
});

module.exports = app;
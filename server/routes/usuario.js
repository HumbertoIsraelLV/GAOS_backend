const express = require('express');
const Usuario = require('../models/usuario');
const Encargo = require('../models/encargo');
const _ = require('underscore');

const app = express();


//OBTENCION DE TODOS LOS USUARIO ACTIVOS
app.get('/usuario', (req, res) => {

    Usuario.find({}, 'nombre curp role estado password')
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuarios
            });
        })
});


//CREACION DE USUARIOS
app.post('/usuario', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        curp: body.curp,
        password: body.password,
        role: body.role,
        estado: body.estado
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario...',
                err
            });
        }
        res.json({
            ok: true,
            message: 'Usuario creado!',
            usuario: usuarioDB
        });
    });
});


//ACTUALIZACION DE DATOS
app.put('/usuario', (req, res) => {
    let id = req.body.id;
    let body = _.pick(req.body, ['nombre', 'curp', 'role', 'estado', 'password']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar datos...',
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: `Usuario con id ${id} no encontrado`
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Datos actualizados correctamente!',
            usuario: usuarioDB
        });
    });
});

//BORRADO DURO DE USUARIO 
// app.delete('/usuario/:id', (req, res) => {
//     let id = req.params.id;

//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }
//         if (usuarioBorrado == null) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'Usuario no encontrado'
//             });
//         }
//         res.json({
//             ok: true,
//             usuario: usuarioBorrado
//         });
//     })
// });

//BORRADO SUAVE DE USUARIOS
app.delete('/usuario', (req, res) => {
    let id = req.query.id;
    let mode = req.query.mode;

    //MODO SUAVE == 1
    if (mode == '1') {
        let cambiaEstado = {
            estado: false
        };
        Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    message: 'Usuario no encontrado'
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });
        });
    }
    //MODO DURO == 2
    if (mode == '2') {
        Encargo.remove({ usuario: id }, (err, encargosBorrados) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // if (encargosBorrados == null) {
            //     return res.status(400).json({
            //         ok: false,
            //         message: 'Encargos no encontrados'
            //     });
            // }
            Usuario.findByIdAndRemove(id, (er, usuarioBorrado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        er
                    });
                }
                if (usuarioBorrado == null) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Usuario no encontrado'
                    });
                }
                res.json({
                    ok: true,
                    usuario: usuarioBorrado,
                    encargos: encargosBorrados
                });
            });
        });
    }
});

module.exports = app;
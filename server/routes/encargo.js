const express = require('express');
const _ = require('underscore');

let app = express();
let Encargo = require('../models/encargo');
let Usuario = require('../models/usuario');
let Pedido = require('../models/pedido');

//===================
//OBTENER TODOS LOS ENCARGOS
//===================
app.get('/encargo', (req, res) => {
    let mode = req.query.mode;
    let id = req.query.id;
    //OBTENER TODAS LAS RELACIONES
    if (mode == '1') {
        Encargo.find({}, )
            .populate('usuario', 'nombre')
            .populate('pedido', )
            .sort('pedido')
            .exec((err, encargos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    encargos
                });
            });
    }
    //Obtener todos los workers activos y los pedidos no terminados
    if (mode == '2') {
        Usuario.find({ estado: true, role: 'WORKER_ROLE' }, 'nombre')
            .exec((err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Pedido.find({ terminado: false }, 'nombreCliente precioTotal fechaPedido')
                    .exec((err, pedidos) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                err
                            });
                        }
                        res.json({
                            ok: true,
                            encargos: {
                                usuarios,
                                pedidos
                            }
                        });
                    });
            });
    }
    //SE ENTREGAN TODOS LOS PEDIDOS ASOCIADOS A UN WORKER
    if (mode == '3') {
        Encargo.find({ usuario: id }, 'pedido')
            .exec((err, encargos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                let listaPedidos = [];
                encargos.forEach((encargo) => {
                    listaPedidos.push(encargo['pedido']);
                });
                Pedido.find({ _id: listaPedidos }, )
                    .sort('fechaPedido')
                    .exec((err, pedidos) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                err
                            });
                        }
                        res.json({
                            ok: true,
                            pedidos
                        });
                    });

            });
    }
});

//===================
//CREAR ENCARGO
//===================
app.post('/encargo', (req, res) => {
    let body = req.body;
    let encargo = new Encargo({
        usuario: body.usuario,
        pedido: body.pedido,
    });
    encargo.save((err, encargoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            encargo: encargoDB
        });
    });
});
//===================
//OBTENER ENCARGO
//===================
// app.get('/pedido', (req, res) => {
//     let id = req.query.id;
//     Pedido.findById(id)
//         .populate('usuario', 'nombre curp')
//         .exec((err, pedidoDB) => {
//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     err
//                 });
//             }
//             if (!pedidoDB) {
//                 return res.status(400).json({
//                     ok: false,
//                     err: {
//                         message: 'No hay producto con ese id'
//                     }
//                 });
//             }
//             res.json({
//                 ok: true,
//                 pedido: pedidoDB
//             });
//         });
// });


// //===================
// //ACTUALIZAR PEDIDO
// //===================
// app.put('/pedido', (req, res) => {
//     let id = req.body.id;
//     let body = _.pick(req.body, ['nombreCliente', 'precioTotal', 'descripcion', 'terminado']);

//     Pedido.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, pedidoDB) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }
//         res.status(200).json({
//             ok: true,
//             pedido: pedidoDB
//         });
//     });
// });

//===================
//BORRAR ENCARGOS
//===================
app.delete('/encargo', (req, res) => {
    let id = req.query.id;
    // let mode = req.query.mode;
    //MODO POR ID
    // if (mode == '1') {
    Encargo.findByIdAndRemove(id, (err, encargoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (encargoBorrado == null) {
            return res.status(400).json({
                ok: false,
                message: 'Encargo no encontrado'
            });
        }
        res.json({
            ok: true,
            encargo: encargoBorrado
        });
    });
});
// //BORRA A TODOS LOS ENCARGOS ASOCIADOS A UN PEDIDO
// if (mode == '2') {
//     Encargo.remove({ pedido: id }, (err, encargosBorrados) => {
//         if (err) {
//             return res.status(400).json({ 
//                 ok: false,
//                 err
//             });
//         }
//         if (encargosBorrados == null) {
//             return res.status(400).json({
//                 ok: false,
//                 message: 'Encargos no encontrados'
//             });
//         }
//         res.json({
//             ok: true,
//             encargos: encargosBorrados
//         });
//     });
// }
// });

module.exports = app;
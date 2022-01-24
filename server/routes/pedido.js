const express = require('express');
const _ = require('underscore');

let app = express();

let Pedido = require('../models/pedido');
let Encargo = require('../models/encargo');

//===================
//OBTENER TODOS LOS PEDIDOS
//===================
app.get('/pedido', (req, res) => {
    Pedido.find({}, )
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

//===================
//OBTENER PEDIDO
//===================
// app.get('/pedido', (req, res) => {
//     let id = req.query.id;
//     Pedido.findById(id)
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

//===================
//CREAR PEDIDO
//===================
app.post('/pedido', (req, res) => {
    let body = req.body;
    let pedido = new Pedido({
        nombreCliente: body.nombreCliente,
        descripcion: body.descripcion,
        precioTotal: body.precioTotal,
        terminado: body.terminado,
        fechaPedido: body.fechaPedido
    });

    pedido.save((err, pedidoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            pedido: pedidoDB
        });
    });
});

//===================
//ACTUALIZAR PEDIDO
//===================
app.put('/pedido', (req, res) => {
    let id = req.body.id;
    let body = _.pick(req.body, ['nombreCliente', 'precioTotal', 'descripcion', 'terminado', 'fechaPedido']);

    Pedido.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, pedidoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            pedido: pedidoDB
        });
    });
});

//===================
//TERMINAR PEDIDO
//===================
app.delete('/pedido', (req, res) => {
    let id = req.query.id;
    let mode = req.query.mode;
    let pedido = {
        terminado: true
    };
    //MODO DE USUARIO // MODO SUAVE
    if (mode == 1) {
        Pedido.findByIdAndUpdate(id, pedido, { new: true, runValidators: true }, (err, pedidoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no encontrado'
                    }
                });
            }
            if (!pedidoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'ID no encontrado'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                pedido: pedidoDB,
                mode
            });
        });
    }
    //MODO DE ADMIN // MODO DURO 
    //Borra primero los encargos asociados y luego el propio pedido
    if (mode == 2) {
        Encargo.remove({ pedido: id }, (err, encargosBorrados) => {
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
            Pedido.findByIdAndRemove(id, (er, pedidoBorrado) => {
                if (er) {
                    return res.status(400).json({
                        ok: false,
                        er
                    });
                }
                if (pedidoBorrado == null) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Pedido no encontrado'
                    });
                }
                res.json({
                    ok: true,
                    pedido: pedidoBorrado,
                    encargos: encargosBorrados
                });
            });
        });
    }
});


//====================
//BUSCAR PRODUCTO
//====================
// app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
//     let termino = req.params.termino;

//     let regex = new RegExp(termino, 'i');
//     Producto.find({ nombre: regex })
//         .populate('categoria', 'descripcion')
//         .exec((err, productos) => {
//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     err
//                 });
//             }
//             res.json({
//                 ok: true,
//                 productos
//             });
//         });
// });
module.exports = app;
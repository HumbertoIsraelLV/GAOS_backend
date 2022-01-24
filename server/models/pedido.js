var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var pedidoSchema = new Schema({
    nombreCliente: {
        type: String,
        required: [true, 'El nombre del cliente es necesario']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesaria']
    },
    precioTotal: {
        type: Number,
        required: [true, 'El precio total es necesario']
    },
    fechaPedido: {
        type: Date,
        required: true
    },
    terminado: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('Pedido', pedidoSchema);
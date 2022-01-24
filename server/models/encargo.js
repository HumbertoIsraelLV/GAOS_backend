var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var encargoSchema = new Schema({
    pedido: {
        type: Schema.Types.ObjectId,
        ref: 'Pedido'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


module.exports = mongoose.model('Encargo', encargoSchema);
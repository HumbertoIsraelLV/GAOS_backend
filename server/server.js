//heroku
//du1llIP49P93YzPp

//MONGO URL:
//PARA CONEXION CON COMPASS
//mongodb+srv://heroku:du1llIP49P93YzPp@cluster0-ycito.mongodb.net/cafe

//PARA CONEXION CON NODE
//mongodb+srv://heroku:du1llIP49P93YzPp@cluster0-ycito.mongodb.net/test?retryWrites=true&w=majority

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
require('./config/config');



//LOS APP.USE SON MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//CONFIGURACION GLOBAL DE RUTAS
app.use(require('./routes/index'));



//CONFIGURACION DE MONGOOSE
mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (err, res) => {
        if (err) throw new error;
        else console.log('Base de datos online');

    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);

});
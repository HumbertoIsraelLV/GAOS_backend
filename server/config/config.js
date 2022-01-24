///========================
//Puerto
//=========================

process.env.PORT = process.env.PORT || 3000;



///========================
//ENTORNO
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';




///========================
//BASE DE DATOS
//=========================
let urlDB;
if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/gaos';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//Para heroku
//Meter en el package.json
// "engines": {
//     "node": "13.13.0"
// },
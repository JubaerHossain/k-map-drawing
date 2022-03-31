require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js');
const path    = require('path');
const multer = require('multer');
const upload = new multer({dest:'uploads/'});
const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV;
const enVal = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.any());
app.set('view engine', 'ejs');

if (environment != 'production') {
    app.use(logger('dev'));
}
    try {
         mongoose.connect(enVal.DB_HOST);
         console.log("MongoDB Conected")
    } catch (err) {
        console.error('err.message');
        console.error(err.message);
        process.exit(1);
    }

app.get('/', function(req, res) {      
    res.render('pages/index');
    });


app.use('/api/v1', routes(router));

const PORT = enVal.PORT || 8080;
app.listen(PORT, () => {
    console.log(` Server running at at localhost:${PORT}`)
});
module.exports = app;
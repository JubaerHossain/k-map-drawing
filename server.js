require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js');
const path    = require('path');
const multer = require('multer');
const Uploads = require('./models/uploadModel');

const app = express();
const router = express.Router();
const upload = new multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now()+'-'+file.originalname);
        }
    }),
    fileFilter: function (req, file, cb) {
        if (file.mimetype == 'text/csv' || file.mimetype == 'application/json' || file.mimetype == 'application/vnd.ms-excel') {
            cb(null, true);
        }
         else {
            cb(null, false);
        }
    }
});
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
        res.render('pages/index', {
            errors: req.app.get('errors')
        });
        req.app.set('errors', '');
});

app.get('/list', async function (req, res) { 
   try {
    const uploads = await Uploads.find({})
    .sort({ _id: 'DESC' })
    .exec();
    res.render('pages/list', {
        data: uploads,
        errors: req.app.get('errors')
    });
    req.app.set('errors', '');
       
   } catch (error) {
    res.render('pages/list', {
        errors: error.message

    });
       
   }
    
});

app.get('/download', function(req, res) { 
   try {
    res.render('pages/download', {
        errors: req.app.get('errors'),
        url :  '/api/v1/download?id='+req.query.file ?? ''

     });
    req.app.set('errors', ''); 
   } catch (error) {
    res.render('pages/list', {
        errors: error.message

    });
       
       
   }
});


app.use('/api/v1', routes(router));

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

const PORT = enVal.PORT || 8080;
app.listen(PORT, () => {
    console.log(` Server running at at localhost:${PORT}`)
});
module.exports = app;
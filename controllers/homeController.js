const validateFileUploadInput = require('../validations/fileUpload');
const User = require('../models/userModel');

let fileUpload = (req, res, next) => {
    console.log(req.body);
    const { errors, isValid } = validateFileUploadInput(req.body);
        if(!isValid) {
            req.app.set('errors', errors)
            return res.redirect("/");
        }
};



module.exports = {
    fileUpload
}
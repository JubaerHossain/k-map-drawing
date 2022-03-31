const validateFileUploadInput = require('../validations/fileUpload');
const User = require('../models/userModel');

let fileUpload = (req, res, next) => {
    const { errors, isValid } = validateFileUploadInput(req.body);
      console.log(req.body);
        if(!isValid) {
            return res.status(400).json(errors);
        }
};



module.exports = {
    fileUpload
}
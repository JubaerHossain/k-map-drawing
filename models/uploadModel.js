const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UploadSchema = new Schema({
    location_details: {
        type: String,
        required: true
    },
    location_employee_details: {
        type: String,
        required: true
    },
    employee_details: {
        type: String,
        required: true
    },
    colleges_location_values: {
        type: String,
    }
});



module.exports = mongoose.model('Uploads', UploadSchema);

module.exports.addUpload = (newUpload, callback) => {
    newUpload.save((err, upload) => {
        if (err) {
              return callback(err, null);
            } else {
               return  callback(null, upload);
            }
    });
}

module.exports.getUploads = (callback, limit) => {
    Uploads.find(callback).limit(limit);
}
const validateFileUploadInput = require('../validations/fileUpload');
const Uploads = require('../models/uploadModel');

let fileUpload = (req, res, next) => { 
    try {
        const { errors, isValid, data } = validateFileUploadInput(req.files);
            if(!isValid) {
                req.app.set('errors', errors)
                return res.redirect("/");
            }    
            var upload = new Uploads(data)
            Uploads.addUpload(upload, (err, upload) => {
                if (err) {
                    req.app.set('errors', err)
                    process.exit(0);
                    return res.redirect("/");
                } else {
                    return res.redirect("/download?file=" + upload?._id);
                }
            });
            return res.redirect("/download?file=" + upload?._id);
    }
    catch(err) {
        console.log(err);
        process.exit(0);
        req.app.set('errors', err)
        return res.redirect("/");
    }      
};


let download = async (req, res) =>{
    try {        
        const file = req.query.id;
        const upload = await Uploads.find({_id:file}).exec();
        const filePath = `./uploads/${upload[0].location_details}`;
        res.download(filePath);
        
    }
    catch(err) {
        req.app.set('errors', err)
        return res.redirect("/download ?file=" + file);
    }
};



module.exports = {
    fileUpload,
    download
}
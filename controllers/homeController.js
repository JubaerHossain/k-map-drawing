const validateFileUploadInput = require('../validations/fileUpload');
const Uploads = require('../models/uploadModel');
const csv = require("csvtojson");
const fs = require('fs');


let fileUpload = (req, res, next) => { 
    try {
        const { errors, isValid, data } = validateFileUploadInput(req.files);
            if(!isValid) {
                req.app.set('errors', errors)
                return res.redirect("/");
            }

            const sampleFile = {}
            let location_details
            let location_employee_details
            let employee_details
            let colleges_location_values
            csv()
            .fromFile(`./uploads/${data?.employee_details}`)
            .then((jsonObj)=>{
                employee_details = jsonObj;

                var location_details = JSON.parse(fs.readFileSync(`./uploads/${data?.location_details}`, 'utf8'));
                var location_employee_details = JSON.parse(fs.readFileSync(`./uploads/${data?.location_employee_details}`, 'utf8'));
                var colleges_location_values = JSON.parse(fs.readFileSync(`./uploads/${data?.colleges_location_values}`, 'utf8'));
                // console.log('employee_details');
                // console.log(employee_details);
                // console.log('location_details');
                // console.log(location_details);
                // console.log('location_employee_details');
                // console.log(location_employee_details);
                // console.log('colleges_location_values');
                // console.log(colleges_location_values);
                //  merge the location_details  to get  employee_details and location_employee_details and colleges_location_values   dynamically
                


                

                for(let i=0; i<location_details.length; i++){
                    for(let j=0; j<location_employee_details.length; j++){
                        if(location_details[i].location_id === location_employee_details[j].location_id){
                            location_details[i].location_employee_details = location_employee_details[j];
                        }
                    }
                }
                console.log('location_details');
                console.log(location_details['features']);
                console.log(location_details['features'][0].geometry);
                //  merge the location_details and location_employee_details to get the location_employee_details_merged dynamically

                 
                
                
                
                console.log(sampleFile);
 
                
            }).catch((err)=>{
                console.log(err);
            })

            // var upload = new Uploads(data)
            // Uploads.addUpload(upload, (err, upload) => {
            //     if (err) {
            //         req.app.set('errors', err)
            //         return res.redirect("/");
            //     } else {

            //         return res.redirect("/download?file=" + upload?._id);
            //     }
            // });
            // return res.redirect("/download?file=" + upload?._id);
    }
    catch(err) {
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
const validateFileUploadInput = require('../validations/fileUpload');
const Uploads = require('../models/uploadModel');
const csv = require("csvtojson");
const fs = require('fs');


let fileUpload = (req, res, next) => { 
    try {
        console.log(req.files);
        const { errors, isValid, data } = validateFileUploadInput(req.files);
            if(!isValid) {
                req.app.set('errors', errors)
                return res.redirect("/");
            }
            let employee_details
            csv()
            .fromFile(`./uploads/${data?.employee_details}`)
            .then((jsonObj)=>{
                employee_details = jsonObj;
                var location_details = JSON.parse(fs.readFileSync(`./uploads/${data?.location_details}`, 'utf8'));
                var location_employee_details = JSON.parse(fs.readFileSync(`./uploads/${data?.location_employee_details}`, 'utf8'));
                var colleges_location_values = JSON.parse(fs.readFileSync(`./uploads/${data?.colleges_location_values}`, 'utf8'));

                
                location_details['features'].forEach(feature => {
                    let resercher =[];
                    location_employee_details[feature.properties.loc_id].kmapids.forEach(kmapid => {
                        employee_details.forEach(employee => {
                            if(employee.kmapId === kmapid) {
                                resercher.push({
                                    kmapids: employee.kmapId,
                                    name: employee.name,
                                    collegeId: employee.collegeid,
                                });
                            }
                        });
                    });
                    feature.properties.researchers = resercher;
                    let college_values = {};


                    Object.keys(colleges_location_values).forEach(collegeName => {
                        if (colleges_location_values[collegeName][feature.properties.loc_id]) {
                            college_values[collegeName] = colleges_location_values[collegeName][feature.properties.loc_id];
                            
                        }
                    });
                    feature.properties.college_values = college_values;  
                    
                });

                sample_outputJson = JSON.stringify(location_details);
                sample_outputName = Date.now()+"-"+"sample_output.json"
                fs.writeFile("./uploads/"+sample_outputName, sample_outputJson , 'utf8', function (err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                });
                const upload = new Uploads({
                    location_details: data?.location_details,
                    location_employee_details: data?.location_employee_details,
                    employee_details: data?.employee_details,
                    colleges_location_values: data?.colleges_location_values,
                    sample_output: sample_outputName
                });
                Uploads.addUpload(upload, (err, upload) => {
                    if (err) {
                        req.app.set('errors', err)
                        return res.redirect("/");
                    } else {  
                        console.log(upload);  
                        return res.redirect("/download?file=" + upload?._id);
                    }
                });
                console.log(upload);
                return res.redirect("/download?file=" + upload?._id);
 
                
            }).catch((err)=>{
                console.log('err');
                console.log(err);
            })
    console.log(req.files);
           
    }
    catch(err) {
        req.app.set('errors', err)
        return res.redirect("/");
    }      
};


let download = async (req, res) =>{
    const file = req.query.id;
    try {        
        const upload = await Uploads.findById(file);
        const filePath = `./uploads/${upload.sample_output}`;
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
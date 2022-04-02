const Validator = require('validator');
const isEmpty = require('./is_empty');

function jsonValidator(file){
    if(file.mimetype !== 'application/json') {
        return false;
    }
    return true;
}
function csvValidator(file){
    if(file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
        return false;
    }
    return true;
}

module.exports = function validateFileUploadInput(files) {
    let errors = {};
    let data ={};
    files? files.map(file => {
        switch (file.fieldname) {
            case 'location_details':
                if (Validator.isEmpty(file.fieldname)) {
                    errors.location_details = 'Location details is required';
                }
                jsonValidator(file) ? data.location_details = file.filename : errors.location_details = 'Only json file are allowed';
                break;
            case 'location_employee_details':
                if (Validator.isEmpty(file.fieldname)) {
                    errors.location_employee_details = 'Location employee details is required';
                }
                jsonValidator(file) ? data.location_employee_details = file.filename : errors.location_employee_details = 'Only json file are allowed';
                break;
            case 'employee_details':
                if (Validator.isEmpty(file.fieldname)) {
                    errors.employee_details = 'Employee details is required';
                }
                csvValidator(file) ? data.employee_details = file.filename : errors.employee_details = 'Only csv file are allowed';
                break;
            case 'colleges_location_values':
                if (Validator.isEmpty(file.fieldname)) {
                    errors.colleges_location_values = 'Colleges location values is required';
                }
                jsonValidator(file) ? data.colleges_location_values = file.filename : errors.colleges_location_values = 'Only json file are allowed';
                break;
            default:
                break;
        }
        
    }) : null;

    if (files.length === 0) {
         errors.location_details = 'Location lol details is required';
         errors.location_employee_details = 'Location employee details is required';
         errors.employee_details = 'Employee details is required';
         errors.colleges_location_values = 'Colleges location values is required';
    }
    return {
        errors,
        isValid: isEmpty(errors),
        data
    }
}
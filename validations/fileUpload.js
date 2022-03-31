const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateFileUploadInput(data) {
    let errors = {};
    data.location_details = !isEmpty(data.location_details) ? data.location_details : '';
    data.location_employee_details = !isEmpty(data.location_employee_details) ? data.location_employee_details : '';
    data.employee_details = !isEmpty(data.employee_details) ? data.employee_details : '';
    data.colleges_location_values = !isEmpty(data.colleges_location_values) ? data.colleges_location_values : '';
    
    if(Validator.isEmpty(data.location_details)) {
        errors.location_details = 'Location details field is required';
    }

    if(Validator.isEmpty(data.location_employee_details)) {
        errors.location_employee_details = 'Location employee details is required';
    }
    if(Validator.isEmpty(data.employee_details)) {
        errors.employee_details = 'Location details is required';
    }

    if(Validator.isEmpty(data.colleges_location_values)) {
        errors.colleges_location_values = 'College Location values details is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
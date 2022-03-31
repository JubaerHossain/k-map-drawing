
const controller = require('../controllers/homeController');
module.exports = (router) => {
  router.route('/file-upload').post(controller.fileUpload);
};

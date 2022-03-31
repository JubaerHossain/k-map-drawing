
const controller = require('../controllers/homeController');
module.exports = (router) => {
  router.route('/upload').post(controller.fileUpload);
  router.route('/download').get(controller.download);
};

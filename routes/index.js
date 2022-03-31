const web = require('./web.js');

module.exports = (router) => {
  web(router);
  return router;
};
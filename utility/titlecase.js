const _ = require("lodash");
module.exports = function (str) {
  return _.startCase(_.toLower(str));
};

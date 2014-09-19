module.exports = function (cb) {
  console.log(require('../../package.json').version);
  cb();
};
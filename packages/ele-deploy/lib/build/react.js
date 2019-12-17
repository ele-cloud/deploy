var fs = require('fs');
var sp = require('shell-spawn');
var del = require('delete');
var request = require('request');

var config = require('../config');

function requestAnimation(opts, spCwd) {
  var fileBuffer = fs.readFileSync(config.path.project + opts.project + '.zip')
  
  var formData = {
    company: opts.company,
    project: opts.project,
    file: fileBuffer
  }

  request.post({url: 'http://121.36.50.216:4002/upload', formData: formData }, function optionalCallback(err, httpResponse, body) {
    if (err) {
      utils.log(['error: 提交服务器时发生错误：'])
      throw new Error(err);
    }
    return body;
  })
}

module.exports = function (opts, spCwd) {
  return sp('matriks2 dest', spCwd)
    .then(function () {
      return sp('mv dest/prod/pages/index.html dest/prod/', spCwd)
    })
    .then(function () {
      return sp('rm -rf dest/prod/pages', spCwd)
    })
    .then(function () {
      // del.sync(utils.p(spCwd.cwd + '/dest/prod/dist'))
      return sp('if [ -d dest/prod/' + opts.project + '.zip ]; then\n' +
        '  rm -f dest/prod' +opts.project+ '.zip\n' +
        'fi\n' +
        'zip -r ' + opts.project + '.zip dest/prod/*', spCwd)
    })
    .then(function () {
      return requestAnimation(opts, spCwd);
    })
    .then(function () {
      utils.logs([
        ['info: 部署完成😊']
      ])
    })
    .catch(function (ex) {
      utils.log(['error: 运行错误', ex])
    })
}

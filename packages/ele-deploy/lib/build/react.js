var fs = require('fs');
var sp = require('shell-spawn');
var request = require('request');

var config = require('../config');
var utils = require('../backend-utils/utils');

function requestAnimation(opts, spConfig) {
  var fileBuffer = fs.readFileSync(spConfig.cwd + '/' + opts.project);
  var formData = {
    company: opts.company,
    project: opts.project,
    file: fileBuffer
  };
  request.post({
    url: 'http://121.36.50.216:4002/upload',
    formData: formData
  }, function optionalCallback(err, httpResponse, body) {
    if (err) {
      utils.log(['error: 提交服务器时发生错误：']);
      throw new Error(err);
    }
    return body;
  });
}

module.exports = function (opts, spConfig) {
  return sp('mv pages/index.html .', spConfig)
    .then(function () {
      return sp('rm -rf pages', spConfig);
    })
    .then(function () {
      if (fs.existsSync(opts.project)) {
        return sp('rm -f ' + opts.project, spConfig);
      } else {
        return true;
      }
    })
    .then(function () {
      var suffix = opts.project.replace(/.*?\./, '');
      if (suffix === 'zip') {
        return sp('zip -r ' + opts.project + ' ./*', spConfig);
      } else if (suffix === 'tar') {
        return sp('tar -cvf ' + opts.project + ' ./*', spConfig);
      } else if (suffix === 'tar.gz') {
        return sp('tar -zcvf ' + opts.project + ' ./*', spConfig);
      } else {
        throw new Error('不支持【' + suffix + '】的打包形式');
      }
    })
    .then(function () {
      return requestAnimation(opts, spConfig);
    })
    .then(function () {
      utils.logs([
        ['info: 部署完成😊']
      ]);
    })
    .catch(function (ex) {
      utils.log(['error: 运行错误', ex]);
    });
};

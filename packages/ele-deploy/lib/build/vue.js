var fs = require('fs');
var sp = require('shell-spawn');
var request = require('request');
var del = require('delete');

var config = require('../config');
var utils = require('../backend-utils/utils');

function requestAnimation(opts, spConfig) {
  var fileBuffer = fs.readFileSync(spConfig.cwd + '/' + opts.project, {encoding: 'base64'});
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
    utils.logs([
      ['info: 部署完成😊']
    ]);
    
    // remove deflate data
    del.sync(spConfig.cwd + '/' + opts.project);
    
    return body;
  });
}

function errorLog(ex) {
  utils.log(['error: 运行错误', ex]);
  return;
}

module.exports = async function (opts, spConfig) {
  var suffix = opts.project.replace(/.*?\./, '');
  if (suffix === 'zip') {
    await sp('zip -r ' + opts.project + ' ./*', spConfig).catch(ex => errorLog(ex));;
  } else if (suffix === 'tar') {
    await sp('tar -cvf ' + opts.project + ' ./*', spConfig).catch(ex => errorLog(ex));;
  } else if (suffix === 'tar.gz') {
    await sp('tar -zcvf ' + opts.project + ' ./*', spConfig).catch(ex => errorLog(ex));;
  } else {
    throw new Error('不支持【' + suffix + '】的打包形式');
  }
  requestAnimation(opts, spConfig);
};

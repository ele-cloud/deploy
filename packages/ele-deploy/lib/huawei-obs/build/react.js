var fs = require('fs');
var path = require('path');
var sp = require('shell-spawn');
var request = require('request');
var del = require('delete');

var config = require('../../config');
var utils = require('../../backend-utils/utils');
var buildUtils = require('./main')

function errorLog(ex) {
  utils.log(['error: 运行错误', ex]);
  return;
}

module.exports = async function (opts, spConfig) {
  fs.renameSync(path.resolve(spConfig.cwd, 'pages/index.html'), spConfig.cwd + '/index.html');
  del.sync(path.resolve(spConfig.cwd, 'pages'));
  
  var suffix = opts.project.replace(/.*?\./, '');
  if (suffix === 'zip') {
    await sp('zip -r ' + opts.project + ' .', spConfig).catch(ex => errorLog(ex));
  } else if (suffix === 'tar') {
    await sp('tar -cvf ' + opts.project + ' .', spConfig).catch(ex => errorLog(ex));
  } else if (suffix === 'tar.gz') {
    await sp('tar -zcvf ' + opts.project + ' .', spConfig).catch(ex => errorLog(ex));
  } else {
    throw new Error('不支持【' + suffix + '】的打包形式');
  }
  var oldProject = path.resolve(spConfig.cwd, opts.project);
  var payloadSuffix = buildUtils.md5Suffix(fs.readFileSync(oldProject));
  var newName = opts.project.replace(/\..+$/, '') + '_' + payloadSuffix + '.' + suffix;
  var newProject = path.resolve(spConfig.cwd, newName);
  fs.renameSync(oldProject, newProject);
  opts.project = newName;
  buildUtils.upload(opts, spConfig);
};

var fs = require('fs');
var sp = require('shell-spawn');
var request = require('request');
var del = require('delete');
var path = require('path');
var ObsClient = require('../lib/obs');

var config = require('../../config');
var utils = require('../../backend-utils/utils');

function requestAnimation(opts, spConfig) {
  
  /*
 * Initialize a obs client instance with your account for accessing OBS
 */
  var obs = new ObsClient({
    access_key_id: 'MVOABMVMWDH4FNQF46HL',
    secret_access_key: 'FngCx9dfPNjNV4Gh5TAid4Wy3vLPBstzVfN3zv8G',
    server : 'https://obs.cn-north-4.myhuaweicloud.com'
  });
  
  var bucketName = 'dxhy';
  var objectKey = opts.company + '/' + opts.project;
  
  obs.putObject({
    Bucket: bucketName,
    Key: objectKey,
    SourceFile: path.resolve(spConfig.cwd, opts.project)
  }).then((result) => {
    if(result && result.CommonMsg.Status < 300) {
      utils.logs([
        ['info: 部署完成😊，项目地址：http://dxhy.90paw.com:4002/' + opts.company]
      ]);
    } else {
      utils.log(['error: 提交obs服务器时发生错误：']);
      throw new Error(result.CommonMsg.Message);
    }
  
    // remove deflate data
    del.sync(path.resolve(spConfig.cwd, opts.project));
  });
}

function errorLog(ex) {
  utils.log(['error: 运行错误', ex]);
  return;
}

module.exports = async function (opts, spConfig) {
  var suffix = opts.project.replace(/.*?\./, '');
  if (suffix === 'zip') {
    await sp('zip -r ' + opts.project + ' .', spConfig).catch(ex => errorLog(ex));;
  } else if (suffix === 'tar') {
    await sp('tar -cvf ' + opts.project + ' .', spConfig).catch(ex => errorLog(ex));;
  } else if (suffix === 'tar.gz') {
    await sp('tar -zcvf ' + opts.project + ' .', spConfig).catch(ex => errorLog(ex));;
  } else {
    throw new Error('不支持【' + suffix + '】的打包形式');
  }
  requestAnimation(opts, spConfig);
};

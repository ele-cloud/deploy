var crypto = require('crypto');
var path = require('path');
var ObsClient = require('../lib/obs');
var utils = require('../../backend-utils/utils');
var del = require('delete');

module.exports = {
  upload: function (opts, spConfig) {
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
    var deleteKeys = [];
  
    obs.listObjects({
      Bucket: bucketName,
      Prefix: objectKey.replace(/_.+/, '')
    }).then((result) => {
      if (result.CommonMsg.Status < 300) {
        for (let j = 0; j < result.InterfaceResult.Contents.length; j++) {
          deleteKeys.push({
            Key: result.InterfaceResult.Contents[j]['Key']
          });
        }
        return deleteKeys;
      }
    }).then(keys => {
      obs.deleteObjects({
        Bucket: bucketName,
        Objects: keys
      }).then(result => {
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
      })
    })
  },
  md5Suffix(content) {
    // 依据文件内容进行加密后缀，若与之前内容相同则名称相同，同样适用cdn缓存
    return crypto.createHash('md5').update(content).digest('base64');
  }
}

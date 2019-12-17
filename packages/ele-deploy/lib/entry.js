var path = require('path');
var utils = require('./backend-utils/utils')
var config = require('./config')

var react = require('./build/react');
var vue = require('./build/vue');

var entry = {
  /**
   *
   * @param opts {{
   *  isForce: Boolean,
   *  isDebug: Boolean,
   *  isReact: Boolean,
   *  company: String,
   *  project: String,
   * }}
   */
  execute: function (opts) {
    opts = opts || {}
    
    utils.log(['info: 你可以使用 `-d` 选项显示更多信息'])
    
    var spCwd = {
      cwd: config.path.root,
      verbose: opts.isDebug,
    }
    
    if (opts.isReact) {
      react(opts, spCwd);
    } else {
      vue(opts, spCwd);
    }
  }
}

module.exports = entry

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

    if (!opts.isDebug) {
      utils.log(['info: 你可以使用 `-d` 选项显示更多信息'])
    }

    var spConfig = {
      verbose: opts.isDebug
    }

    if (opts.isReact) {
      spConfig.cwd = path.resolve(config.path.root , 'dest/prod')
      react(opts, spConfig);
    } else {
      spConfig.cwd = path.resolve(config.path.root , 'dist')
      vue(opts, spConfig);
    }
  }
}

module.exports = entry

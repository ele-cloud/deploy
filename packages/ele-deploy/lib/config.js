var npath = require('path')

var p = npath.resolve

var config = {
    path: {
        root: p(__dirname + '/../../')
    }
}

config.path.project = p(config.path.root + '/dest/prod/')

module.exports = config

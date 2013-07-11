var _ = require('underscore');
var async = require('async');
var fs = require('fs');

var common = require('./common.js');

var getDaemonStatus = common.getDaemonStatus;

module.exports = function(conf, callback) {
	async.waterfall([
		_.bind(fs.readFile, fs, conf.pidFile, {encoding: 'utf8'}), // read pid file
		getDaemonStatus
	], callback);
}
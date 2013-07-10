var _ = require('underscore');
var async = require('async');
var fs = require('fs');

module.exports = function(conf, callback) {
	async.waterfall([
		_.bind(fs.readFile, fs, conf.pidFile, {encoding: 'utf8'}), // read pid file,
		getDaemonStatus
	], callback);
}

function getDaemonStatus(pid, callback) {
	if (!pid) {
		callback(null, false);
		return;
	}
	try {
		process.kill(pid, 0);
		callback(null, true);
	} catch (e) {
		if (e.code == 'ESRCH') {
			callback(null, false);
		} else {
			callback(e);
		}
	}
}
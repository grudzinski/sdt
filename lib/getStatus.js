var _ = require('underscore');
var async = require('async');
var fs = require('fs');

module.exports = function(conf, callback) {
	async.waterfall([
		_.partial(fs.readFile.bind(fs), conf.pidFile), // read pid file,
		getDaemonStatus
	], callback);
}

function getDaemonStatus(pid, callback) {
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
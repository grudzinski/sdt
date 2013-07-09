var _ = require('underscore');
var async = require('async');
var fs = require('fs');

module.exports = function(conf, callback) {
	async.waterfall([
		_.partial(fs.readFile.bind(fs), conf.pidFile), // read pid file
		stopDaemon,
	], callback);
}

function stopDaemon(pid, callback) {
	try {
		process.kill(pid);
	} catch (e) {
		if (e.code == 'ESRCH') {
			callback(null, true);
			return;
		} else {
			callback(e);
			return;
		}
	}
	callback(null, false);
}
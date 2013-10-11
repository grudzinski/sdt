
var _ = require('lodash');
var async = require('async');
var fs = require('fs');

module.exports = function(conf, callback) {
	async.waterfall([
		_.bind(fs.readFile, fs, conf.pidFile, {encoding: 'utf8'}), // read pid file
		stopDaemon,
	], callback);
}

function stopDaemon(pid, callback) {
	try {
		process.kill(pid);
	} catch (e) {
		if (e.code == 'ESRCH') {
			callback(null, true); // true means already stopped
			return;
		} else {
			callback(e);
			return;
		}
	}
	callback(null, false);
}

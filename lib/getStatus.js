var async = require('async');
var fs = require('fs');

module.exports = function(conf, callback) {

	async.waterfall([
		readPidFile,
		getDaemonStatus
	], callback);

	function readPidFile(callback) {
		fs.readFile(conf.pidFile, callback);
	}

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
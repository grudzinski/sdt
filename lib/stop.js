var async = require('async');
var fs = require('fs');

module.exports = function(conf, callback) {

	async.waterfall([
		readPidFile,
		stopDaemon
	], callback);

	function readPidFile(callback) {
		fs.readFile(conf.pidFile, callback);
	}

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
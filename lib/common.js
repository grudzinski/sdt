
var _ = require('lodash');
var async = require('async');
var fs = require('fs');

module.exports = {
	getDaemonStatus: getDaemonStatus,
	openStdioFiles: openStdioFiles,
	openFile: openFile,
	savePidFile: savePidFile,
	isPidFileExist: isPidFileExist,
	readPidFileIfExists: readPidFileIfExists,
	ensureDaemonDoesNotRunning: ensureDaemonDoesNotRunning,
	openStdioFiles: openStdioFiles
};

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

function openStdioFiles(outFile, errFile, callback) {
	async.parallel({
		out: _.partial(openFile, outFile),
		err: _.partial(openFile, errFile),
	}, callback);
}

function openFile(file, callback) {
	fs.open(file, 'a', callback);
}

function savePidFile(pidFile, pid, callback) {
	fs.writeFile(pidFile, pid, onFileSaved);
	function onFileSaved(err) {
		if (err) {
			callback(err);
			return;
		}
		callback(null, pid);
	}
}

function isPidFileExist(pidFile, callback) {
	fs.exists(pidFile, function(exists) {
		callback(null, exists);
	});
}

function readPidFileIfExists(pidFile, exists, callback) {
	if (exists) {
		fs.readFile(pidFile, {encoding: 'utf8'}, callback);
	} else {
		callback(null, false);
	}
}

function ensureDaemonDoesNotRunning(isRunning, callback) {
	if (isRunning) {
		callback('Daemon is running');
	} else {
		callback(null);
	}
}

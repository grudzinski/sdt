var _ = require('underscore');
var async = require('async');
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

module.exports = function (conf, callback) {
	async.waterfall([
		_.partial(isPidFileExist, conf.pidFile),
		_.partial(readPidFileIfExists, conf.pidFile),
		getDaemonStatus,
		ensureDaemonDoesNotRunning,
		_.partial(openFile, conf.monitorOut),
		_.partial(runWatcherDaemon, conf),
		_.partial(savePidFile, conf.pidFile)
	], callback);
};

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

function runWatcherDaemon(conf, stdOut, callback) {
	var options = {
		detached: true,
		execArgv: [],
		stdio: ['ignore', stdOut, stdOut, 'ipc']
	};
	var uid = conf.uid;
	if (_.isNumber(uid)/* || _.isString(uid)*/) {
		options.uid = uid;
	}
	var gid = conf.gid;
	if (_.isNumber(gid)/* || _.isString(gid)*/) {
		options.gid = gid;
	}
	var pathToMonitor = path.join(__dirname, 'monitor.js');
	var daemon = childProcess.spawn(process.execPath, [pathToMonitor], options);
	daemon.send(conf);
	daemon.disconnect();
	daemon.unref();
	callback(null, daemon.pid);
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

function ensureDaemonDoesNotRunning(isRunning, callback) {
	if (isRunning) {
		callback('Daemon is running');
	} else {
		callback(null);
	}
}
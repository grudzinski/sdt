var _ = require('underscore');
var async = require('async');
var childProcess = require('child_process');
var fs = require('fs');

module.exports = start;

function start(conf, callback, err, stdio) {
	async.waterfall([
		_.partial(isPidFileExist, conf.pidFile),
		_.partial(readPidFileIfExists, conf.pidFile),
		getDaemonStatus,
		ensureDaemonDoesNotRunning,
		_.partial(openStdioFiles, conf.out, conf.err),
		_.partial(runDaemon, conf.cwd, conf.command, conf.args),
		_.partial(savePidFile, conf.pidFile)
	], callback);
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

function runDaemon(cwd, command, args, stdio, callback) {
	var options = {
		stdio: ['ignore', stdio.out, stdio.err],
		detached: true,
		cwd: cwd
	};
	var daemon = childProcess.spawn(command, args, options);
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
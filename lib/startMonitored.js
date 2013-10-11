
var _ = require('lodash');
var async = require('async');
var childProcess = require('child_process');
var path = require('path');

var common = require('./common.js');

module.exports = function(conf, callback) {
	async.waterfall([
		_.partial(common.isPidFileExist, conf.pidFile),
		_.partial(common.readPidFileIfExists, conf.pidFile),
		common.getDaemonStatus,
		common.ensureDaemonDoesNotRunning,
		_.partial(common.openFile, conf.monitorOut),
		_.partial(runWatcherDaemon, conf),
		_.partial(common.savePidFile, conf.pidFile)
	], callback);
};

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
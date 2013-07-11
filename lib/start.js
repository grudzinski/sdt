var _ = require('underscore');
var async = require('async');
var childProcess = require('child_process');

var common = require('./common.js');

module.exports = function (conf, callback) {
	async.waterfall([
		_.partial(common.isPidFileExist, conf.pidFile),
		_.partial(common.readPidFileIfExists, conf.pidFile),
		common.getDaemonStatus,
		common.ensureDaemonDoesNotRunning,
		_.partial(common.openStdioFiles, conf.out, conf.err),
		_.partial(runDaemon, conf),
		_.partial(common.savePidFile, conf.pidFile)
	], callback);
};

function runDaemon(conf, stdio, callback) {
	var options = {
		stdio: ['ignore', stdio.out, stdio.err],
		detached: true,
		cwd: conf.cwd
	}
	var uid = conf.uid;
	if (_.isNumber(uid)/* || _.isString(uid)*/) {
		options.uid = uid;
	}
	var gid = conf.gid;
	if (_.isNumber(gid)/* || _.isString(gid)*/) {
		options.gid = gid;
	}
	var daemon = childProcess.spawn(conf.command, conf.args, options);
	daemon.unref();
	callback(null, daemon.pid);
}

var _ = require('lodash');
var childProcess = require('child_process');
var log4js = require('log4js');

var common = require('./common.js');

var openStdioFiles = common.openStdioFiles;

var logger = log4js.getLogger('Monitor');

function Monitor(conf) {
	this._conf = conf;
	this._stdio = null;
	this._daemon = null;
	this._countOfRestarts = 0;
	this._onDaemonExitBound = _.bind(this._onDaemonExit, this);
	this._runDaemonBound = _.bind(this._runDaemon, this);
}

var p = Monitor.prototype;

p.start = function() {
	var conf = this._conf;
	var onStdIoOpened = _.partial(this._onStdIoOpened, this);
	openStdioFiles(conf.out, conf.err, onStdIoOpened);
};

p.killDaemon = function() {
	var daemon = this._daemon;
	if (daemon) {
		daemon.kill();
	}
};

p._onStdIoOpened = function(err, stdio) {
	if (err) {
		logger.error(err);
		return;
	}
	this._stdio = stdio;
	this._runDaemon();
};

p._runDaemon = function() {
	var stdio = this._stdio;
	var options = {
		stdio: ['ignore', stdio.out, stdio.err],
		cwd: conf.cwd
	}
	var conf = this._conf;
	var command = conf.command;
	var args = conf.args;
	var daemon = childProcess.spawn(command, args, options);
	this._daemon = daemon;
	daemon.on('exit', this._onDaemonExitBoun);
	logger.info('Daemon runned with pid %s: $ %s %s', daemon.pid, command, args.join(' '));
};

p._onDaemonExit = function(stdOut, stdErr, code, signal) {
	logger.error('Daemon exited');
	if ((this._countOfRestarts++) != conf.maxRestarts) {
		logger.error('Restart daemon');
		setTimeout(this._runDaemonBound, 1000);
	} else {
		logger.error('Stop restart daemon');
	}
};

delete p;
var _ = require('underscore');
var async = require('async');
var childProcess = require('child_process');
var fs = require('fs');
var log4js = require('log4js');

var common = require('./common.js');

var openStdioFiles = common.openStdioFiles;

var logger = log4js.getLogger('std-monitor');

process.on('message', start);

var countOfRestarts = 0;

function start(conf) {
	openStdioFiles(conf.out, conf.err, _.partial(onStdIoOpened, conf));
}

function onStdIoOpened(conf, err, stdio) {
	if (err) {
		logger.error(err);
		return;
	}
	runDaemon(conf, stdio.out, stdio.err);
}

function runDaemon(conf, stdOut, stdErr) {
	var options = {
		stdio: ['ignore', stdOut, stdErr],
		cwd: conf.cwd
	}
	var command = conf.command;
	var args = conf.args;
	var daemon = childProcess.spawn(command, args, options);
	daemon.on('exit', _.partial(onDaemonExit, conf, stdOut, stdErr));
	logger.info('Daemon runned: $ %s %s', command, args.join(' '));
}

function onDaemonExit(conf, stdOut, stdErr, code, signal) {
	logger.error('Daemon exited');
	if ((countOfRestarts++) != conf.maxRestarts) {
		logger.error('Restart daemon');
		setTimeout(runDaemon, 1000, [conf, stdOut, stdErr]);
	} else {
		logger.error('Stop restart daemon');
	}
}
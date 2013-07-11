var _ = require('underscore');
var async = require('async');
var childProcess = require('child_process');
var foreverMonitor = require('forever-monitor');
var fs = require('fs');
var log4js = require('log4js');

var logger = log4js.getLogger('std-monitor');

process.on('message', start);

var countOfRestarts = 0;

function start(conf) {
	async.parallel({
		out: _.partial(openFile, conf.out),
		err: _.partial(openFile, conf.err),
	}, _.partial(onStdIoOpened, conf));
}

function openFile(file, callback) {
	fs.open(file, 'a', callback);
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
	if ((countOfRestarts++) != conf.maxRestarts) {
		setTimeout(runDaemon, 1000, [conf, stdOut, stdErr]);
	}
}
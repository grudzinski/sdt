var _ = require('underscore');
var async = require('async');
var childProcess = require('child_process');
var foreverMonitor = require('forever-monitor');
var fs = require('fs');

process.on('message', start);

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
		console.log('Error');
		return;
	}
	runDaemon(conf, stdio.out, stdio.err);
}

function runDaemon(conf, stdOut, stdErr) {
	var options = {
		stdio: ['ignore', stdOut, stdErr],
		cwd: conf.cwd
	}
	var daemon = childProcess.spawn(conf.command, conf.args, options);
	daemon.on('exit', _.partial(onDaemonExit, conf, stdOut, stdErr));
}

function onDaemonExit(conf, stdOut, stdErr, code, signal) {
	setTimeout(runDaemon, 1000, [conf, stdOut, stdErr]);
}
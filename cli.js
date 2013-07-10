#!/usr/local/bin/node

var _ = require('underscore');
var async = require('async');

var getStatus = require('./lib/getStatus.js');
var start = require('./lib/start.js');
var stop = require('./lib/stop.js');
var conf = require('./lib/conf.js');

var args = process.argv;

var commands = {
	status: _.partial(getStatus, conf, onStatusGot),
	start: _.partial(start, conf, onStartComplete),
	stop: _.partial(stop, conf, onStopComplete)
};

if (args.length > 2) {
	var commandName = args[2];
	var command = commands[commandName];
	if (command) {
		command(conf);
	}
} else {
	console.log('Commands: status, start, stop');
}

function handleError(message, err) {
	if (err) {
		console.log(message, err);
		return true;
	}
	return false;
}

function onStartComplete(err, pid) {
	if (handleError('Fail to start daemon: %s', err)) {
		return;
	}
	console.log('Daemon started with pid: ' + pid);
}

function onStopComplete(err, alreadyStopped) {
	if (handleError('Fail to stop: %s', err)) {
		return;
	}
	console.log('Daemon was ' + (alreadyStopped ? 'already stopped' : 'stopped'));
}

function onStatusGot(err, status) {
	if (handleError('Fail to get status: %s', err)) {
		return;
	}
	console.log('Daemon %s', (status ? 'is running' : 'was stopped'));
}
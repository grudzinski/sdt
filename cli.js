var async = require('async');

var getStatus = require('./lib/getStatus.js');
var start = require('./lib/start.js');
var stop = require('./lib/stop.js');
var conf = require('./lib/conf.js');

var args = process.argv;
var commands = {
	status: createCommandFunc(getStatus, onStatusGot),
	start: createCommandFunc(start, onStartComplete),
	stop: createCommandFunc(stop, onStopComplete)
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

function createCommandFunc(func, callback) {
	return function command(conf) {
		func(conf, callback);
	}
}

function onStartComplete(err, pid) {
	if (err) {
		console.log('Fail to start daemon: ', err);
		return;
	}
	console.log('Daemon started with pid: ' + pid);
}

function onStopComplete(err, alreadyStopped) {
	if (err) {
		console.log('Fail to stop: %s', err);
		return;
	}
	console.log('Daemon was ' + (alreadyStopped ? 'already stopped' : 'stopped'));
}

function onStatusGot(err, status) {
	if (err) {
		console.log('Fail to get status: %s', err);
		return;
	}
	console.log('Daemon %s', (status ? 'running' : 'stopped'));
}
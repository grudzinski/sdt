
var _ = require('lodash');

var getStatus = require('./getStatus.js');
var start = require('./start.js');
var startMonitored = require('./startMonitored.js');
var stop = require('./stop.js');

module.exports = runCli;

function runCli(conf) {

	var commands = {
		'status': _.partial(getStatus, conf, onStatusGot),
		'start-monitored': _.partial(startMonitored, conf, onStartMonitoredComplete),
		'start': _.partial(start, conf, onStartComplete),
		'stop': _.partial(stop, conf, onStopComplete)
	};

	var args = process.argv;

	if (args.length > 2) {

		var commandName = args[2];
		var command = commands[commandName];

		if (command) {
			command(conf);
		} else {
			console.log('Command %s not found', command);
		}

	} else {
		console.log('Commands: status, start, stop');
	}

}

function handleError(message, err) {
	if (err) {
		console.log(message, err);
		return true;
	}
	return false;
}

function onStartMonitoredComplete(err, pid) {
	if (handleError('Fail to start monitored daemon: %s', err)) {
		return;
	}
	console.log('Monitored daemon started with pid: ' + pid);
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
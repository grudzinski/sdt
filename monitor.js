
var Monitor = require('./Monitor.js');

process.on('message', start);
process.on('SIGTERM', killDaemonAndExit);

var monitor;

function killDaemonAndExit() {
	if (monitor) {
		monitor.killDaemon();
	}
	process.exit(0);
}

function start(conf) {
	monitor = new Monitor(conf);
	monitor.start();
}
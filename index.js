var getStatus = require('./lib/getStatus.js');
var startDaemon = require('./lib/startDaemon.js');
var stopDaemon = require('./lib/stopDaemon.js');

module.exports = {
	getStatus: getStatus,
	startDaemon: startDaemon,
	stopDaemon: stopDaemon
};
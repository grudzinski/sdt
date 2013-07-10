var getStatus = require('./lib/getStatus.js');
var start = require('./lib/start.js');
var stop = require('./lib/stop.js');

module.exports = {
	getStatus: getStatus,
	start: start,
	stop: stop
};
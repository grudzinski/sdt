var rc = require('rc');

module.exports = rc('daemon-tools', {
	cwd: '/',
	command: 'node',
	args: [],
	out: 'out.log',
	err: 'err.log',
	pidFile: 'daemon.pid'
});
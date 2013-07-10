var rc = require('rc');

module.exports = rc('daemon-tools', {
	cwd: '/',
	command: 'true',
	args: [],
	out: '/dev/null',
	err: '/dev/null',
	pidFile: '/dev/null',
	uid: null,
	gid: null
});
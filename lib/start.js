var _ = require('underscore');
var async = require('async');
var childProcess = require('child_process');
var fs = require('fs');

module.exports = function(conf, callback) {

	var defaultConf = {
		cwd: '/',
		command: 'node',
		args: [],
		out: 'out.log',
		err: 'err.log',
		pidFile: 'daemon.pid'
	};

	_.extend(conf, defaultConf);

	async.parallel({
		out: createOpenFileFunc(conf.out),
		err: createOpenFileFunc(conf.err),
	}, onFileOpened);

	function onFileOpened(err, stdio) {

		async.waterfall([
			runDaemon,
			savePidFile
		], callback);

		function runDaemon(callback) {
			var options = {
				stdio: ['ignore', stdio.out, stdio.err],
				detached: true
			};
			var daemon = childProcess.spawn(conf.command, conf.args, options);
			daemon.unref();
			callback(null, daemon.pid);
		}

		function savePidFile(pid, callback) {

			fs.writeFile(conf.pidFile, pid, onFileSaved);

			function onFileSaved(err) {
				if (err) {
					callback(err);
					return;
				}
				callback(null, pid);
			}
		}

	}

}

function createOpenFileFunc(file) {
	return function openFile(callback) {
		fs.open(file, 'a', onFileOpen);
		function onFileOpen(err, fd) {
			if (err) {
				callback(err);
				return;
			}
			callback(null, fd);
		};
	}
}
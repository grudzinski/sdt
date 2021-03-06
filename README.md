SDT - The Simple Daemon Tools
=============================

How to install?
---------------

```sh
$ npm install sdt -g
```

Default config
--------------

```json
{
	"cwd": "/",
	"command": "true",
	"args": [],
	"out": "/dev/null",
	"err": "/dev/null",
	"monitorOut": "monitor.log",
	"pidFile": "/dev/null"
}
```

How to use it in a command line?
--------------------------------

```sh
$ sdt start --config /etc/myd/conf.json # starts daemon and prints daemon's pid
$ sdt start-monitored --config /etc/myd/conf.json # starts daemon 
$ sdt status --config /etc/myd/conf.json # prints daemon status
$ sdt stop --config /etc/myd/conf.json # stops daemon
```

How to use it in a code?
---------------------

```javascript
var sdt = require('sdt');

var conf = {
    cwd: '/',
	command: 'node',
	args: ['/usr/local/lib/node_modules/myd'],
	out: '/var/log/myd.out.log',
	err: '/var/log/myd.err.log',
	pidFile: '/var/run/myd.pid'
};

sdt.start(conf, function(err, pid) {
    if (err) {
        console.log('Fail to start daemon: %s', err);
		return;
	}
	console.log('Daemon started with pid: %s', pid);
});

sdt.getStatus(conf, function(err, status) {
    if (err) {
        console.log('Fail to get status: %s', err);
		return;
	}
	console.log('Daemon %s', (status ? 'is running' : 'was stopped'));
});

sdt.stop(conf, function(err, alreadyStopped) {
    if (err) {
        console.log('Fail to stop: %s', err)
		return;
	}
	console.log('Daemon was ' + (alreadyStopped ? 'already stopped' : 'stopped'));
});

```

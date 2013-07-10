SDT - The Simple Daemon Tools
=============================

How to install?
---------------

```
# npm install sdt -g
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
	"pidFile": "/dev/null"
}
```

How to use it in a command line?
--------------------------------

```
$ sdt start --config /etc/myd/conf.json # starts daemon and prints daemon's pid
$ sdt status --config /etc/myd/conf.json # prints daemon status
$ sdt status --config /etc/myd/conf.json # stops daemon
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
	pidFile: '/var/run/myd.pid',
    uid: 'myd',
    gid: 'myd'
};

sdt.start(conf, function(err, pid) (err, pid) {
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

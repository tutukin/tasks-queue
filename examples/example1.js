var	TaskQueue	= require('../'),
	util		= require('util'),
	clock, q;

var q = new TaskQueue();
q.setMinTime(500);
q.setVar('time',0);

q.pushTask('quick',{n:1});
q.pushTask('quick',{n:2});
q.pushTask('long',{n:3});
q.pushTask('quick',{n:4});
q.pushTask('quick',{n:5});

q.on('quick',log);
q.on('long',long);
q.on('stop',stop);

clock = setInterval(tick,100);
q.execute();

function stop (jinn) {
	clearInterval(clock);
	util.puts("Queue finished in " + jinn.getQueue().getVar('time') + " ms");
}

function log (jinn, data) {
	var t = jinn.getQueue().getVar('time');
	util.puts("["+t+" ms] " + "Task: "+data.n + " done");
	jinn.done();
}

function long(jinn,data) {
	var timeout = 3*jinn.getQueue().getMinTime(),
		timer,
		t = jinn.getQueue().getVar('time');
	
	util.puts( "[" + t + " ms] " + "Start long Task: "+data.n);
	
	timer = setTimeout(go,timeout);
	
	function go () {
		log(jinn,data);
	}
}

function tick() {
	var tickValue = q.getVar('time')+100;
	q.setVar('time',tickValue);
}
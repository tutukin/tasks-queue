var	TaskQueue	= require('../lib/tasks-queue'),
	util		= require('util'),
	tickValue	= 0,
	clock, q;

var q = new TaskQueue();
q.setMinTime(500);

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

function stop (event) {
	clearInterval(clock);
	util.puts("Queue finished");
}

function log (event, data) {
	util.puts("Task: "+data.n);
	event.done();
}

function long(event,data) {
	var timeout = 3*event.getQueue().getMinTime(),
		timer;
	
	util.puts("Start long Task: "+data.n);
	
	timer = setTimeout(go,timeout);
	
	function go () {
		log(event,data);
	}
}

function tick() {
	tickValue = tickValue+100;
	util.puts("Tick: " + tickValue);
}
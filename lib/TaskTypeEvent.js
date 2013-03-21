module.exports = TaskTypeEvent;

function TaskTypeEvent (queue,task) {
	this.task	= task;
	this.queue	= queue;
}

( function (p) {
	p.getType		= getType;
	p.getQueue		= getQueue;
	p.done			= done;
})(TaskTypeEvent.prototype);

function getType() {
	return this.task.getType();
}

function getQueue () {
	return this.queue;
}

function done () {
	this.getQueue().taskDone();
}
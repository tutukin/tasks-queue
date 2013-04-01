var	util			= require('util'),
	EventEmitter	= require('events').EventEmitter;

module.exports = Jinn;

util.inherits(Jinn,EventEmitter);

function Jinn (queue,task) {
	EventEmitter.call(this);
	this._queue = queue;
	this._task = task;
}

( function (p) {
	p.getQueue	= getQueue;
	p.getType	= getType;
	p.getData	= getData;
	p.done		= done;
})( Jinn.prototype );

function getQueue() {
	return this._queue;
}

function getType() {
	return this._task.getType();
}

function getData() {
	return this._task.getData();
}

function done() {
	this.emit('done');
}
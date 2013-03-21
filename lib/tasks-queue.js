/*
 * tasks-queue
 * 
 *
 * Copyright (c) 2013 Andrei V. Toutoukine
 * Licensed under the MIT license.
 */

var	util	= require('util'),
	events	= require('events'),
	Task	= require('./Task'),
	TaskTypeEvent	= require('./TaskTypeEvent'),
	EventEmitter	= events.EventEmitter;

module.exports = TasksQueue;

util.inherits(TasksQueue,EventEmitter);

function TasksQueue () {
	
	EventEmitter.call(this);
	
	this.queue	= [ ];
	this.flag	= {};
	this.defaultTaskType = 'default';
	
	this.time	= {
			min	: 0
	};
	
	this.timer	= { mintime : null };
	
	this._flagOff('TaskRunning');
	this._flagOff('WaitMinTime');
}

// Instance methods initialization
( function (p) {
	p.getTask		= getTask;
	p.pushTask		= pushTask;
	p.unshiftTask	= unshiftTask;
	p.length		= length;
	
	p.execute		= execute;
	p.taskDone		= taskDone;
	
	p.setMinTime	= setMinTime;
	p.getMinTime	= getMinTime;
	
	p.isTaskRunning		= isTaskRunning;
	p.shouldWaitMinTime	= shouldWaitMinTime;
	
	p._flagOn			= _flagOn;
	p._flagOff			= _flagOff;
})( TasksQueue.prototype );


// methods definition
function getTask (n) {
	return this.queue[n];
}

function pushTask (type, data) {
	var task = _getTaskObject.call(this,type,data);
	this.queue.push(task);
}

function unshiftTask (type,data) {
	var task = _getTaskObject.call(this,type,data);
	this.queue.unshift(task);
}


function length () {
	return this.queue.length;
}


function execute () {
	var task, event, that;
	if ( this.length() > 0 ) {
		task	= this.queue.shift();
		event	= new TaskTypeEvent(this,task);
		
		this._flagOn('TaskRunning');
		
		if ( this.getMinTime() > 0 ) {
			that = this;
			this._flagOn('WaitMinTime');
			this.timer.mintime = setTimeout(
					onMinTimePassed,
					this.getMinTime()
			);
		}
		
		this.emit(task.getType(), event, task.getData());
	}
	else {
		this.emit('stop',{ type : 'stop', queue : this });
	}
	
	function onMinTimePassed (queue) {
		that._flagOff('WaitMinTime');
		if ( that.isTaskRunning() === false ) {
			that.execute();
		}
	}
}

function taskDone () {
	this._flagOff('TaskRunning');
	
	if ( this.length() === 0 ) {
		this._flagOff('WaitMinTime');
		clearTimeout( this.timer.mintime );
	}
	
	if ( ! this.shouldWaitMinTime() ) {
		this.execute();
	}
}

function isTaskRunning () {
	return this.flag['TaskRunning'];
}


function setMinTime (t) {
	this.time.min = t;
}

function getMinTime () {
	return this.time.min;
}

function shouldWaitMinTime () {
	return this.flag.WaitMinTime;
}

function _getTaskObject(type,data) {
	if (typeof data === 'undefined') {
		data = type;
		type = this.defaultTaskType;
	}
	
	return new Task(type,data);
}

function _flagOn(flag) {
	this.flag[flag] = true;
}

function _flagOff(flag) {
	this.flag[flag] = false;
}
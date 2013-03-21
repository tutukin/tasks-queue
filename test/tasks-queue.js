var	expect			= require('expect.js'),
	EventEmitter	= require('events').EventEmitter,
	sinon			= require('sinon'),
	TasksQueue		= require('../lib/tasks-queue.js'),
	TaskTypeEvent	= require('../lib/TaskTypeEvent');


describe('TasksQueue', function() {
	var q;
	
	beforeEach(function(done) {
		q = new TasksQueue();
		done();
	});
	
	it('should be a function', function(done) {
		expect(TasksQueue).to.be.a('function');
		done();
	});
	
	describe('instance', function() {
		it('should be an instance of TaskQueue', function(done) {
			expect(q).to.be.a(TasksQueue);
			done();
		});
		
		it('should be an instance of EventEmitter', function(done) {
			expect(q).to.be.an(EventEmitter);
			done();
		});
	});
	
	
	describe('#getTask(n)', function() {
		it('should be an instance method', function(done) {
			expect(q.getTask).to.be.a('function');
			done();
		});
		
		it('should return undefined if the queue is empty', function(done) {
			expect(q.getTask()).to.be(undefined);
			done();
		});
		
		it('should return undefined if the number of task is lt 0 or gt queue.length()', function(done) {
			var N = 5;
			
			for ( var i = 0; i < N; i++) {
				q.pushTask({});
			}
			
			expect(q.getTask(N)).to.be(undefined);
			expect(q.getTask(-1)).to.be(undefined);
			
			done();
		});
		
		it('should return the n-th task', function(done) {
			var	N = 5,
				tasks	= [],
				type	= q.defaultTaskType,
				data, i;
			
			for ( i = 0; i < N; i++) {
				data = {"i":i};
				tasks.push({type:type,data:data});
				q.pushTask(data);
			}
			
			for ( i = 0; i < N; i++) {
				expect( q.getTask(i).getType() ).to.eql( tasks[i].type );
				expect( q.getTask(i).getData() ).to.eql( tasks[i].data );
			}
			done();
		});
	});
	
	
	
	describe('#length()', function() {
		it('should be an instance method', function(done) {
			expect( q.length ).to.be.a('function');
			done();
		});
		
		it('should return 0 if no tasks were added', function(done) {
			expect( q.length() ).to.equal(0);
			done();
		});
		
		it('should return the number of tasks added', function(done) {
			var N = 5;
			
			for ( var i = 0; i < N; i++) {
				q.pushTask({});
			}
			
			expect( q.length() ).to.equal(N);
			
			done();
		});
		
	});
	
	
	describe('#pushTask(type,task)', function() {
		it('should be an instance method', function(done) {
			expect( q.pushTask ).to.be.a('function');
			done();
		});
		
		it('should use default task type if only data are provided', function(done) {
			q.pushTask({});
			expect( q.getTask(0).getType() ).to.equal( q.defaultTaskType );
			done();
		});
		
		it('should use type if provided', function(done) {
			var type = 'some custom task type';
			q.pushTask(type,{});
			
			expect( q.getTask(0).getType() ).to.equal(type);
			
			done();
		});
		
		it('should insert tasks in FIFO order', function(done) {
			var	N		= 5,
				tasks	= [],
				type	= 'task-type',
				data, i;
			
			for ( i = 0; i < N; i++ ) {
				data = { "i" : i };
				tasks.push({type:type, data:data});
				q.pushTask(type, data);
			}
			
			for ( i = 0; i < tasks.length; i++) {
				expect( q.getTask(i).getData() ).to.equal( tasks[i].data );
			}
			
			done();
		});
	});
	
	
	
	describe('#unshiftTask(type,task)', function() {
		it('should be an instance method', function(done) {
			expect( q.unshiftTask ).to.be.a('function');
			done();
		});
		
		it('should use dafault task type if only data are provided', function(done) {
			q.unshiftTask({});
			expect( q.getTask(0).getType() ).to.equal( q.defaultTaskType );
			done();
		});
		
		it('should use type as task type if provided', function(done) {
			var	type = 'some custom task type';
			q.unshiftTask(type,{});
			expect( q.getTask(0).getType() ).to.equal( type );
			done();
		});
		
		it('should increase the length of the queue', function(done) {
			var N = 5;
			for ( var i = 0; i < N; i++) {
				q.unshiftTask({});
			}
			
			expect( q.length() ).to.equal(N);
			
			done();
		});
		
		it('should insert tasks in FILO order', function(done) {
			var	N = 5,
				tasks = [],
				data, i;
			
			for ( i = 0; i < N; i++ ) {
				data = {"i":i};
				tasks.push({type:q.defaultTaskType,data:data});
				q.unshiftTask(data);
			}
			
			for ( i = 0; i < N; i++ ) {
				expect( q.getTask(i).getData() ).to.equal(tasks[N-i-1].data);
			}
			
			done();
		});
	});
	
	describe('#setMinTime(t)', function() {
		it('should be an instance method', function(done) {
			expect(q.setMinTime).to.be.a('function');
			done();
		});
	});
	
	describe('#getMinTime()', function() {
		it('should be an instance method', function(done) {
			expect( q.getMinTime ).to.be.a('function');
			done();
		});
		it('should return 0 by default', function(done) {
			expect(q.getMinTime()).to.equal(0);
			done();
		});
		it('should return the value <t> set by setMinTime(t)', function(done) {
			var t = 10;
			q.setMinTime(t);
			expect(q.getMinTime()).to.equal(t);
			done();
		});
	});
	
	describe('#execute()', function() {
		var clock, type, data;
		
		beforeEach(function(done) {
			type = 'some type';
			data = {};
			clock = sinon.useFakeTimers();
			done();
		});
		
		afterEach(function(done) {
			clock.restore();
			done();
		});
		
		it('should be an instance method', function(done) {
			expect(q.execute).to.be.a('function');
			done();
		});
		
		it('should emit "stop" event if queue is empty', function(done) {
			var	listener = sinon.spy();
			q.on('stop',listener);
			q.execute();
			
			expect( listener.calledOnce ).to.equal(true);
			
			done();
		});
		
		it('should not emit "stop" event if queue is not empty', function(done) {
			var listener	= sinon.spy();
			
			q.pushTask(type,data);
			q.on('stop',listener);
			q.execute();
			
			expect(listener.called).to.equal(false);
			
			done();
		});
		
		it('should emit <type> event if the top task has type <type>', function(done) {
			var listener	= sinon.spy();
			
			q.pushTask(type,data);
			q.on(type,listener);
			q.execute();
			
			expect(listener.calledOnce).to.equal(true);
			
			done();
		});
		
		it('should decrement the length by one, given the queue is not empty', function(done) {
			var	length;
			
			q.pushTask(type,data);
			length = q.length();
			
			q.execute();
			
			expect(q.length()).to.equal(length-1);
			
			done();
		});
		
		it('should set <TaskRunning> flag to true', function(done) {
			var	length;
			
			q.pushTask(type,data);
			length = q.length();
			
			q.execute();
			
			expect( q.isTaskRunning() ).to.equal(true);
			
			done();
		});
		
		it('should not set <WaitMinTime> flag by default', function(done) {
			q.pushTask(type,data);
			
			q.execute();
			
			expect(q.shouldWaitMinTime()).to.equal(false);
			done();
		});
		
		it('should set <WaitMinTime> flag if minTime > 0', function(done) {
			var t = 10;
			q.setMinTime(t);
			q.pushTask(type,data);
			q.execute();
			expect( q.shouldWaitMinTime() ).to.equal(true);
			done();
		});
		
		it('should start timer that drops <WaitMinTime> flag in <MinTime> milliseconds', function(done) {
			var t = 10;
			q.setMinTime(t);
			q.pushTask(type,data);
			q.execute();
			
			clock.tick(t);
			
			expect( q.shouldWaitMinTime() ).to.equal(false);
			
			done();
		});
		
		it('should call execute() method in <MinTime> milliseconds if <TaskRunning> flag is off', function(done) {
			var t = 10;
			q.setMinTime(t);
			q.pushTask(type,data);
			q.pushTask(type,data);
			q.execute();
			q.taskDone();
			
			expect( q.shouldWaitMinTime() ).to.equal(true);
			expect( q.isTaskRunning() ).to.equal(false);
			
			q.execute = sinon.spy();
			clock.tick(t);
			
			expect( q.execute.calledOnce ).to.equal(true);
			done();
		});
		
		it('should not call execute() unless <TaskDone> === false', function(done) {
			var t = 10;
			q.setMinTime(t);
			q.pushTask(type,data);
			q.execute();
			
			expect( q.shouldWaitMinTime() ).to.equal(true);
			expect( q.isTaskRunning() ).to.equal(true);
			
			q.execute = sinon.spy();
			clock.tick(t);
			
			expect( q.execute.called ).to.equal(false);
			done();
		});
		
		it('should execute tasks in order from the first one in the queue', function(done) {
			var res = '';
			
			q.pushTask(type,{n:2});
			q.unshiftTask(type,{n:1});
			q.pushTask(type,{n:3});
			
			q.on(type, function (e,d) { res = res + d.n; e.done(); });
			q.on('stop',function (e) {
				expect(res).to.equal('123');
				done();
			});
			
			q.execute();
		});
	});
	
	
	
	describe('#taskDone()', function() {
		var type = 'some type', data = {}, clock;
		
		beforeEach(function(done) {
			clock = sinon.useFakeTimers();
			done();
		});
		
		afterEach(function(done) {
			clock.restore();
			done();
		});
		
		
		it('should be an instance method', function(done) {
			expect( q.taskDone ).to.be.a('function');
			done();
		});
		
		
		it('should set the <TaskRunning> flag to false', function(done) {
			var	type	= 'some type',
				data	= {};
			
			q.pushTask(type,data);
			q.execute();
			
			expect( q.isTaskRunning() ).to.equal(true);
			q.taskDone();
			expect( q.isTaskRunning() ).to.equal(false);
			done();
		});
		
		
		it('should not call execute() method if <WaitMinTime> is true', function(done) {
			var t = 10;
			q.setMinTime(t);
			q.pushTask(type,data);
			q.pushTask(type,data);
			q.execute();
			
			expect( q.shouldWaitMinTime() ).to.equal( true );
			
			q.execute = sinon.spy();
			q.taskDone();
			
			expect( q.execute.called ).to.equal(false);
			done();
		});
		
		it('should call execute() method if <WaitMinTime> is false', function(done) {
			var t = 10;
			q.setMinTime(t);
			q.pushTask(type,data);
			q.pushTask(type,data);
			q.execute();
			
			q.execute = sinon.spy();
			clock.tick(t);
			q.taskDone();
			
			expect( q.shouldWaitMinTime() ).to.equal(false);
			expect( q.execute.calledOnce ).to.equal(true);
			done();
		});
		
		it('should emit stop event if the queue is empty, ignoring <MinWaitTime>', function(done) {
			var callback = sinon.spy(),
				t = 10;
			q.setMinTime(t);
			q.pushTask(type,data);
			q.on('stop',callback);
			
			q.execute();
			q.taskDone();
			
			expect(callback.calledOnce).to.equal(true);
			done();
		});
		
		
		it('should clear MinTime timer t if the queue is empty', function(done) {
			var callback = sinon.spy(),
				t = 10;
			q.setMinTime(t);
			q.pushTask(type,data);
			q.on('stop',callback);
			
			q.execute();
			q.taskDone();
			
			expect(callback.calledOnce).to.equal(true);
			
			clock.tick(t);
			clock.tick(t);
			
			expect(callback.calledOnce).to.equal(true);
			
			done();
		});
	});
	
	
	describe('#isTaskRunning', function() {
		it('should be an instance method', function(done) {
			expect(q.isTaskRunning).to.be.a('function');
			done();
		});
		
		it('should return false by default', function(done) {
			expect(q.isTaskRunning()).to.equal(false);
			done();
		});
	});
	
	
	describe('#shouldWaitMinTime()', function() {
		it('should be an instance method', function(done) {
			expect(q.shouldWaitMinTime).to.be.a('function');
			done();
		});
		
		it('should return false by default', function(done) {
			expect(q.shouldWaitMinTime()).to.equal(false);
			done();
		});
	});
	
	
	
	describe('event:stop object', function() {
		var	stopEvent;
		
		beforeEach(function(done) {
			q.on('stop', function(event) { stopEvent=event; } );
			q.execute();
			done();
		});
		
		it('should be passed to the listener as the first argument', function(done) {
			expect(stopEvent).to.be.an(Object);
			done();
		});
		
		it('should have "type" property that equals to "stop"', function(done) {
			expect( stopEvent.type ).to.equal('stop');
			done();
		});
		
		it('should have "queue" property that refers to the queue instance', function(done) {
			expect( stopEvent.queue ).to.equal( q );
			done();
		});
		
	});
	
	
	describe('event:<task type>', function() {
		var type, data, listener;
		
		beforeEach(function(done) {
			type	= 'some type';
			data	= {};
			listener= sinon.spy();
			
			q.pushTask(type,data);
			q.on(type, listener );
			q.execute();
			
			done();
		});
		
		it('should call the listener with the TaskTypeEvent object as the first argument', function(done) {
			var event = listener.firstCall.args[0];
			
			expect(event).to.be.a(TaskTypeEvent);
			expect(event.getType()).to.equal(type);
			expect(event.getQueue()).to.equal(q);
			
			done();
		});
		
		it('should pass data to the listener as the second argument', function(done) {
			var actualData = listener.firstCall.args[1];
			
			expect(actualData).to.equal(data);
			done();
		});
	});
	

});

var	expect			= require('expect.js'),
	EventEmitter	= require('events').EventEmitter,
	sinon			= require('sinon'),
	Jinn, jinn,
	mock			= require('mock'),
	mocks			= {},
	TasksQueue;

Jinn = sinon.stub();
Jinn.prototype.done = sinon.spy();
Jinn.prototype.on	= sinon.spy();
Jinn.prototype.emit = sinon.spy();


mocks[__dirname + '/../lib/Jinn'] = Jinn;

TasksQueue = mock( __dirname + '/../lib/tasks-queue', mocks );

describe('TasksQueue', function() {
	var q, qq;
	
	beforeEach(function(done) {
		var	actions = {};
		
		Jinn.reset();
		Jinn.prototype.done.reset();
		Jinn.prototype.on.reset();
		Jinn.prototype.emit.reset();
		
		q = new TasksQueue();
		qq= new TasksQueue({autostop:false});
		
		q.emit = sinon.spy();
		qq.emit = sinon.spy();

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
	
	
	describe('#shouldAutostop()', function() {
		it('should be an instance method', function(done) {
			expect( q.shouldAutostop ).to.be.a('function');
			done();
		});
		it('should return true by default', function(done) {
			expect( q.shouldAutostop() ).to.equal(true);
			done();
		});
		it('should return false if autostop:false option was passed to a constructor', function(done) {
			expect( qq.shouldAutostop() ).to.equal(false);
			done();
		});
	});
	
	
	describe('#autostop()', function() {
		it('should be an instance method', function(done) {
			expect( q.autostop ).to.be.a('function');
			done();
		});
		
		it('should turn on autostop flag', function(done) {
			expect( qq.shouldAutostop() ).to.equal(false);
			qq.autostop();
			expect( qq.shouldAutostop() ).to.equal(true);
			done();
		});
	});
	
	describe('#noautostop()', function() {
		it('should be an instance method', function(done) {
			expect( q.noautostop ).to.be.a('function');
			done();
		});
		
		it('should turn off autostop flag', function(done) {
			expect( q.shouldAutostop() ).to.equal(true);
			q.noautostop();
			expect( q.shouldAutostop() ).to.equal(false);
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
		
		it('should emit "stop" event if queue is empty, passing Jinn as an argument to listener', function(done) {
			q.execute();
			
			expect( q.emit.calledOnce ).to.equal(true);
			expect( q.emit.firstCall.args[0] ).to.equal('stop');
			expect( q.emit.firstCall.args[1] ).to.be.a(Jinn);
			
			done();
		});
		
		it('should emit <type> event if the top task has type <type>', function(done) {
			q.pushTask(type,data);
			
			q.execute();
			
			expect( q.emit.calledOnce ).to.equal(true);
			expect( q.emit.firstCall.args[0] ).to.equal( type );
			expect( q.emit.firstCall.args[1] ).to.be.a( Jinn );
			expect( q.emit.firstCall.args[2] ).to.equal( data );
			
			done();
		});
		
		it("should create a jinn for <type> event, passing self and Task objecs", function(done) {
			var task;
			q.pushTask(type,data);
			task = q.getTask(0);
			
			q.execute();
			
			expect( Jinn.firstCall.args[0] ).to.equal(q);
			expect( Jinn.firstCall.args[1] ).to.equal(task);
			
			done();
		});
		
		it("should bind a listener to jinn's <done> event, that calls q.taskDone", function(done) {
			q.pushTask(type,data);
			q.taskDone = sinon.spy();
			
			q.execute();

			expect( Jinn.prototype.on.calledOnce).to.equal(true);
			expect( Jinn.prototype.on.firstCall.args[0] ).to.equal('done');
			expect( Jinn.prototype.on.firstCall.args[1] ).to.be.a('function');
			expect( q.taskDone.called ).to.equal(false);
			
			Jinn.prototype.on.firstCall.args[1]();
			
			expect( q.taskDone.calledOnce ).to.equal(true);
			
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
			q.pushTask(type,data);
			
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
			var topTask;
			
			q.pushTask(type+"2",{n:2});
			q.unshiftTask(type+"1",{n:1});
			q.pushTask(type+"3",{n:3});
			
			topTask = q.getTask(0);
			
			q.execute();
			
			expect(q.emit.calledOnce).to.equal(true);
			expect(q.emit.firstCall.args[0]).to.equal( topTask.getType() );
			expect(q.emit.firstCall.args[1]).to.be.a(Jinn);
			expect(q.emit.firstCall.args[2]).to.equal( topTask.getData() );
			
			done();
		});
		
		describe('non-autostop queue', function() {
			it('should not emit "stop" event if queue is empty when autostop:false option was used', function(done) {
				qq.execute();
				expect( qq.emit.calledWith("stop") ).to.equal(false);
				done();
			});
			
			it('should start timer that executes execute() in minTime', function(done) {
				var t = 10;
				qq.setMinTime(t);
				qq.execute();
				qq.execute = sinon.spy();
				
				clock.tick(t);
				
				expect( qq.execute.calledOnce ).to.equal(true);
				
				done();
			});

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
			var t = 10;
			
			q.setMinTime(t);
			q.pushTask(type,data);
			
			q.execute();
			q.taskDone();
			
			expect( q.emit.calledWith('stop') ).to.equal(true);
			done();
		});
		
		
		it('should clear MinTime timer t if the queue is empty', function(done) {
			var t = 10;
			
			q.setMinTime(t);
			q.pushTask(type,data);
			
			q.execute();
			q.taskDone();
			
			q.emit.reset();
			
			clock.tick(t);
			clock.tick(t);
			
			expect(q.emit.calledWith('stop')).to.equal(false);
			
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
	
	
	describe('#setVar(name,object)', function() {
		it('should be an instance method', function(done) {
			expect( q.setVar ).to.be.a('function');
			done();
		});
	});
	
	describe('#getVar(name)', function() {
		it('should be an instance method', function(done) {
			expect(q.getVar).to.be.a('function');
			done();
		});
		
		it('should return an object that was associated with <name> by setVar(name,obj)', function(done) {
			var	name	= 'a var name',
				obj		= {};
			
			q.setVar(name,obj);
			
			expect( q.getVar(name) ).to.equal( obj );
			
			done();
		});
	});
});

var	expect			= require('expect.js'),
	sinon			= require('sinon'),
	Task			= require('../lib/Task'),
	TaskTypeEvent	= require('../lib/TaskTypeEvent');

describe('TaskTypeEvent', function() {
	var queue	= {
			taskDone	: sinon.spy()
		},
		type	= 'some type',
		task,
		e;
	
	beforeEach(function(done) {
		task = new Task();
		task.setType(type);
		
		e = new TaskTypeEvent(queue,task);
		done();
	});
	
	it('should be a function', function(done) {
		expect(TaskTypeEvent).to.be.a('function');
		done();
	});
	
	describe('#getType()', function() {
		it('should be an instance method', function(done) {
			expect(e.getType).to.be.a('function');
			done();
		});
		it('should return the type of the task', function(done) {
			expect(e.getType()).to.equal(type);
			done();
		});
	});
	
	describe('#getQueue()', function() {
		it('should be an instance method', function(done) {
			expect(e.getQueue).to.be.a('function');
			done();
		});
		it('should return the queue', function(done) {
			expect(e.getQueue()).to.equal(queue);
			done();
		});
	});
	
	describe('#done()', function() {
		it('should be an instance method', function(done) {
			expect(e.done).to.be.a('function');
			done();
		});
		
		it('should call queue.taskDone() method', function(done) {
			e.done();
			expect( queue.taskDone.calledOnce ).to.equal(true);
			done();
		});
	});
});
var	expect	= require('expect.js'),
	sinon	= require('sinon'),
	Jinn	= require('../lib/Jinn.js'),
	EventEmitter = require('events').EventEmitter;

describe("Jinn", function() {
	var j, queue, task;
	
	beforeEach(function(done) {
		
		queue	= {
				
		};
		
		task	= {
				
		};
		
		j		= new Jinn(queue, task);
		
		done();
	});
	it("should be a function", function(done) {
		expect(Jinn).to.be.a('function');
		done();
	});
	
	describe("instance", function() {
		it("should be an instance of Jinn", function(done) {
			expect(j).to.be.a(Jinn);
			done();
		});
		it("should be an instance of EventEmitter", function(done) {
			expect(j).to.be.an(EventEmitter);
			done();
		});
	});
	
	describe("#getQueue()", function() {
		it("should be an instance method", function(done) {
			expect(j.getQueue).to.be.a('function');
			done();
		});
		
		it("should return the first argument, passed to the constructor", function(done) {
			expect(j.getQueue()).to.equal(queue);
			done();
		});
	});
	
	describe("#getType()", function() {
		it("should be an instance method", function(done) {
			expect(j.getType).to.be.a('function');
			done();
		});
		it("should call <task>.getType() and return its value", function(done) {
			var type = 'a type of a task',
				res;
			
			task.getType = sinon.stub().returns(type);
			
			res = j.getType();
			
			expect( task.getType.calledOnce ).to.equal(true);
			expect( res ).to.equal( type );
			
			done();
		});
	});
	
	describe("#getData()", function() {
		it("should be an instance method", function(done) {
			expect(j.getData).to.be.a('function');
			done();
		});
		it("should ", function(done) {
			var data = {},
				res;
			
			task.getData = sinon.stub().returns(data);
			
			res = j.getData();
			
			expect(task.getData.calledOnce).to.equal(true);
			expect(res).to.equal(data);
			
			done();
		});
	});
	
	describe("#done()", function() {
		it("should be an instance method", function(done) {
			expect(j.done).to.be.a('function');
			done();
		});
		it("should ", function(done) {
			j.emit = sinon.spy();
			
			j.done();
			
			expect( j.emit.calledOnce ).to.equal(true);
			expect( j.emit.firstCall.args[0] ).to.equal('done');
			
			done();
		});
	});
});
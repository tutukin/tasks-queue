var	expect	= require('expect.js'),
	Task	= require('../lib/Task');

describe('Task', function() {
	var t;
	
	beforeEach(function(done) {
		t = new Task();
		done();
	});
	
	it('should be a function', function(done) {
		expect(Task).to.be.a('function');
		done();
	});
	
	it('should create a Task instance', function(done) {
		expect(t).to.be.a(Task);
		done();
	});
	
	it('should initialize object with type and data if provided as arguments', function(done) {
		var	type = 'task type',
			data = {},
			ti = new Task(type,data);
		
		expect(ti.getType()).to.equal(type);
		expect(ti.getData()).to.equal(data);
		
		done();
	});
	
	
	
	describe('#getType', function() {
		it('should be an instance method', function(done) {
			expect(t.getType).to.be.a('function');
			done();
		});
		
		it('should return undefined by default', function(done) {
			expect(t.getType()).to.be(undefined);
			done();
		});
		
		it('should return the value set by #setType(type)', function(done) {
			var type = 'task type';
			t.setType(type);
			expect(t.getType()).to.equal(type);
			done();
		});
	});
	
	
	
	describe('#setType(type)', function() {
		it('should be an instance method', function(done) {
			expect(t.setType).to.be.a('function');
			done();
		});
	});
	
	
	describe('#setData(data)', function() {
		it('should be an instance method', function(done) {
			expect(t.setData).to.be.a('function');
			done();
		});
	});
	
	
	describe('#getData()', function() {
		it('should be an instance method', function(done) {
			expect(t.getData).to.be.a('function');
			done();
		});
		
		it('should return undefined by default', function(done) {
			expect(t.getData()).to.be(undefined);
			done();
		});
		
		it('should return the value, set by #setData(data)', function(done) {
			var data = {};
			t.setData(data);
			expect(t.getData()).to.equal(data);
			done();
		});
	});
});
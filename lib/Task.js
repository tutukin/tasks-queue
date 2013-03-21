module.exports	= Task;

function Task(type, data) {
	if (typeof type !== 'undefined' && typeof data !== 'undefined') {
		this.setType(type);
		this.setData(data);
	}
}

( function (p) {
	p.getType	= getType;
	p.setType	= setType;
	p.setData	= setData;
	p.getData	= getData;
})(Task.prototype);

function getType() {
	return this._type;
}

function setType(type) {
	this._type = type;
}


function setData(data) {
	this._data = data;
}

function getData() {
	return this._data;
}
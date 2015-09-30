var IntermediateInheritor = function() {};
IntermediateInheritor.prototype = Error.prototype;

function SyntaxError() {
	var tmp = Error.apply(this, arguments);
	tmp.name = this.name = 'SyntaxError';

	this.message = tmp.message;
	Object.defineProperty(this, 'stack', {
		get: function() {
			return tmp.stack;
		}
	});

	return this;
}

SyntaxError.prototype = new IntermediateInheritor();

function ConnectionRefusedError() {
	var tmp = Error.apply(this, arguments);
	tmp.name = this.name = 'ConnectionRefusedError';

	this.message = tmp.message;
	Object.defineProperty(this, 'stack', {
		get: function() {
			return tmp.stack;
		}
	});

	return this;
}

ConnectionRefusedError.prototype = new IntermediateInheritor();

module.exports = {
	SyntaxError: SyntaxError,
	ConnectionRefusedError: ConnectionRefusedError,
};
'use strict';

var IntermediateInheritor = function() {};
IntermediateInheritor.prototype = Error.prototype;

function ISyntaxError() {
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

ISyntaxError.prototype = new IntermediateInheritor();

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
	ISyntaxError: ISyntaxError,
	ConnectionRefusedError: ConnectionRefusedError,
};
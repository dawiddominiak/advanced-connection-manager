'use strict';

function ISyntaxError() {
	var tmp = Error.apply(this, arguments);
	tmp.name = this.name = 'SyntaxError';

	this.message = tmp.message;
	Object.defineProperty(this, 'stack', {
		get: function() {
			return tmp.stack;
		},
		configurable: true
	});

	return this;
}

ISyntaxError.prototype = Object.create(Error.prototype, {
	constructor: {
		value: ISyntaxError,
		writable: true,
		configurable: true
	}
});

function ConnectionRefusedError() {
	var tmp = Error.apply(this, arguments);
	tmp.name = this.name = 'ConnectionRefusedError';

	this.message = tmp.message;
	Object.defineProperty(this, 'stack', {
		get: function() {
			return tmp.stack;
		},
		configurable: true
	});

	return this;
}

ConnectionRefusedError.prototype = Object.create(Error.prototype, {
	constructor: {
		value: ConnectionRefusedError,
		writable: true,
		configurable: true
	}
});;

module.exports = {
	ISyntaxError: ISyntaxError,
	ConnectionRefusedError: ConnectionRefusedError,
};
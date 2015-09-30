'use strict';

var when = require('when');
var whenNode = require('when/node');
var errors = require('./errors');


/**
 * Constructor of advance connection.
 * @param connection_interface {Object} Interface with method connect.
 * @param connection_interface.connect {Function} method which is responsible
 * for async connection. Method should have the following arguments:
 * - params - params below will be passed,
 * - nodeLikeCallback - callback in node like style function(err, result) { }
 *
 * @constructor
 */
function AdvancedConnectionManager(connection_interface)
{
	if(typeof connection_interface !== 'object')
	{

		throw new errors.ISyntaxError('There is no interface in constructor param or interface is not an object.');
	}

	if(typeof connection_interface.connect !== 'function')
	{

		throw new errors.ISyntaxError('Given interface has no method connect.');
	}

	this.connection = null;
	this.connection_interface = connection_interface;

}

/**
 * Connects to connection_interface settings.max_attempts or 3 times.
 * @param params {*} params to be passed to connection_interface.connect method.
 * @param settings
 * @param settings.notify_callback {Function} node like callback to be executed
 * during reconnection attempts and connection.
 * @param settings.max_attempts {Number} - max attempts number.
 * @param settings.time_span_factory {Function} - function returning the following time spans.
 * Can handle index argument as iteration number.
 * @returns {*|Promise} Promises/A+ object - promise for a connection.
 */
AdvancedConnectionManager.prototype.connect = function connect(params, settings) {

	var self = this;

	settings = settings || {};

	settings.notify_callback = settings.notify_callback || function() {};
	settings.max_attempts = settings.max_attempts || 3;
	settings.time_span_factory = settings.time_span_factory || function(i) {

		return 5*i*i*i;
	};

	return when.iterate(function(x) {

		return x+1;
	}, function(x) {

		// -1 means infinity amount of connections
		if(settings.max_attempts === -1) {

			return !!self.connection;
		} else {

			return x >= settings.max_attempts || !!self.connection;
		}
	}, function(x) {

		return when(true)
			.delay(settings.time_span_factory(x)*1000)
			.then(function() {

				return whenNode.call(self.connection_interface.connect, params)
					.tap(function(result) {
						self.connection = result;
						settings.notify_callback(undefined, result);
					})
					.catch(function(error) {
						settings.notify_callback(error);
					});
			});
	}, 0)
		.then(function() {
			if(!self.connection) {

				throw new errors.ConnectionRefusedError(
					'Connection refused despite ' + settings.max_attempts + ' attempts to connect.'
				);
			}

			return self.connection;
		});
};

module.exports = AdvancedConnectionManager;
/* jshint mocha: true */
"use strict";

var expect = require('chai').expect;

var AdvanceConnectionManager = require('./../index');
var errors = require('./../errors');
var connection_interface_factory = require('./mock/test-connection-interface-factory');

describe('AdvanceConnectionManager', function() {
	describe('#connect', function() {
		it('should connect to interface after 0 attempts. NotifyCallback should be executed once.', function() {

			var notify_callback_flag = false;

			var connection_interface = connection_interface_factory.prepare(function responseFactory() {

				return 'Connected to database';
			});

			var notify_callback = function(err, notify) {

				if(err) {
					console.log('Notify callback response contains an error');

					throw err;
				}

				notify_callback_flag = true;
			};

			var test_connection = new AdvanceConnectionManager(connection_interface);

			return test_connection.connect({}, {
				notify_callback: notify_callback,
			})
				.tap(function(response) {

					expect(response).to.equals('Connected to database');
					expect(notify_callback_flag).to.equals(true);
				});

		});

		it('should throw an error after 3 attempts.', function() {

			var notify_callback_counter = 0;

			var connection_interface = connection_interface_factory.prepare(function responseFactory() {

				throw new Error('Connection refused');
			});

			var notify_callback = function(err, notify) {

				if(err) {

					expect(err.message).to.equals('Connection refused');
				}

				notify_callback_counter++;
			};

			var test_connection = new AdvanceConnectionManager(connection_interface);

			return test_connection.connect({}, {
				notify_callback: notify_callback,
				time_span_factory: function() {

					return 0;
				},
			})
				.tap(function(response) {

					throw new Error('Unexpected success');
				})
				.catch(errors.ConnectionRefusedError, function(error) {

					expect(notify_callback_counter).to.equals(3);
				});
		});

		it('should connect after 2 attempts', function() {

			var notify_callback_counter = 0;

			var connection_interface = connection_interface_factory.prepare(function responseFactory() {

				if(notify_callback_counter === 0) {

					throw new Error('Connection refused');
				} else {

					return 'Connected to database';
				}
			});

			var notify_callback = function(err, notify) {

				notify_callback_counter++;
			};

			var test_connection = new AdvanceConnectionManager(connection_interface);

			return test_connection.connect({}, {
				notify_callback: notify_callback,
				time_span_factory: function() {

					return 0;
				},
			})
				.tap(function(response) {

					expect(response).to.equals('Connected to database');
					expect(notify_callback_counter).to.equals(2);
				});
		});
	});
});
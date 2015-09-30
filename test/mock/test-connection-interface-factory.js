"use strict";

module.exports = {
	prepare: function(response_factory) {

		return {
			connect: function(params, callback)
			{
				var response;

				try {
					response = response_factory(params);
				} catch(error) {
					response = error;
				}

				if(response instanceof Error) {
					callback(response);
				} else {
					callback(undefined, response);
				}
			}
		};
	}
};
(function()
{
	'use strict';

    Acme.Collection.runners = function(model)
	{
		this.model = model;
		this.runners = [];
		this.subscriptions = Acme.PubSub.subscribe({
			'Acme.runners_col.listener' : [ "state_changed" ]
		});
		this.listeners = {
			"meeting" : function(data) {
				return this.fetch();
			},
			"user" : function(data) {
				return this.fetch();
			},
			"race" : function(data) {
				return this.fetch();
			},
			"runner_tip" : function(data) {
				return this.fetch();
			},
			"runner" : function(data) {
				if (data.runner == null) {
					return this.fetch();
				}
			}
		};
	};
		Acme.Collection.runners.prototype.url = function()
		{
			var type = (Acme.state.race) ? 'race' : 'meeting';

			var url = "runner/?"+type+"=" + Acme.state[type] + (type === 'race' ? "&form=true" : '');
			if (Acme.state.publication) {
				url += '&publication=' + Acme.state.publication;
			}
			if (Acme.state.group) {
				url += '&supplier=' + Acme.state.group;
			}
			if (Acme.state.user) {
				url += '&user=' + Acme.state.user;
			}
			return url; // can be meetingid or raceid
		};
		Acme.Collection.runners.prototype.listener = function(topic, data)
		{
			var keys = Object.keys(data);
			for (var i = 0; i < keys.length; i++) {
				for (var listener in this.listeners) {
					if ( listener === keys[i] ) {
						this.listeners[listener].call(this, data);
						break;
					}
				}
			}
		};
		Acme.Collection.runners.prototype.fetch = function(url)
		{
			var self = this;
			var url  = (url === undefined) ? this.url() : url;
			var data = Acme.server.request( url );

			data.done( function(response) {
				// console.log(self.model);
				self.runners = _.map(response.data, function(runner) {
					return Object.create(self.model,
						{	'data' : {
								'value': runner,
								'writable': true
							}
						}
					);
				});

				Acme.PubSub.publish('update_state', {'runners': self});

			});
			return data;
		};

})();

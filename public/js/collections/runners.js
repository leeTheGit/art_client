(function()
{
	'use strict';

    Radb.Collection.runners = function(model)
	{
		this.model = model;
		this.runners = [];
		this.subscriptions = Radb.PubSub.subscribe({
			'Radb.runners_col.listener' : [ "state_changed" ]
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
		Radb.Collection.runners.prototype.url = function()
		{
			var type = (Radb.state.race) ? 'race' : 'meeting';

			var url = "runner/?"+type+"=" + Radb.state[type] + (type === 'race' ? "&form=true" : '');
			if (Radb.state.publication) {
				url += '&publication=' + Radb.state.publication;
			}
			if (Radb.state.group) {
				url += '&supplier=' + Radb.state.group;
			}
			if (Radb.state.user) {
				url += '&user=' + Radb.state.user;
			}
			return url; // can be meetingid or raceid
		};
		Radb.Collection.runners.prototype.listener = function(topic, data)
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
		Radb.Collection.runners.prototype.fetch = function(url)
		{
			var self = this;
			var url  = (url === undefined) ? this.url() : url;
			var data = Radb.server.request( url );

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

				Radb.PubSub.publish('update_state', {'runners': self});

			});
			return data;
		};

})();

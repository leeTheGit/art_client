(function()
{
	'use strict';


    Acme.Collection.races = function(model)
	{
		this.model = model;
		this.meetingid = null;
		this.raceid = null;
		this.races = [];
		this.subscriptions = Acme.PubSub.subscribe({
			'Acme.races_col.listener' : [ "state_changed", "race_updated" ]
		});
		this.listeners = {
			"race_updated" : function(data) {
				var self = this;

				console.log(Acme.state);

				return Acme.effects.debounce(
					function() {
						self.fetch();
					},
					250
				)();
			},
			"meeting" : function(data) {
				return this.fetch();
			},
			"meetingTZ" : function(data) {
				return this.fetch();
			},
			"group" : function(data) {
				Acme.PubSub.publish('races/enabled', false);
				return this.fetch();
			},
		};
	};
		Acme.Collection.races.prototype.url = function()
		{
			var url = "race/?meeting=" + Acme.state.meeting;
			if (Acme.state.publication) {
				url += '&portal=true&publication=' + Acme.state.publication;
			}
			if (Acme.state.user) {
				url += '&user=' + Acme.state.user;
			}

			if(Acme.state.raceView == 'raceResults') {
				url += '&tz=Australia/Melbourne';
			}
			return url;
		};
		Acme.Collection.races.prototype.listener = function(topic, data)
		{
			var keys = Object.keys(data);
			for (var i = 0; i<keys.length; i++) {
				for (var listener in this.listeners) {
					if ( listener === keys[i] ) {
						this.listeners[listener].call(this, data);
						break;
					}
				}
			}
		};
		Acme.Collection.races.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			var data = Acme.server.request( url );
			// console.log(url);
			data.done( function(response) {
				self.races = _.map(response.data, function(race) {
					return Object.create(self.model,
						{	'data' : {
								'value': race,
								'writable': true
							}
						}
					);
				});

				Acme.PubSub.publish('update_state', {'races': self});
			});
			return data;
		};
})();

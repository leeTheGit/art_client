(function()
{
	'use strict';


    Radb.Collection.races = function(model)
	{
		this.model = model;
		this.meetingid = null;
		this.raceid = null;
		this.races = [];
		this.subscriptions = Radb.PubSub.subscribe({
			'Radb.races_col.listener' : [ "state_changed", "race_updated" ]
		});
		this.listeners = {
			"race_updated" : function(data) {
				var self = this;

				console.log(Radb.state);

				return Radb.effects.debounce(
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
				Radb.PubSub.publish('races/enabled', false);
				return this.fetch();
			},
		};
	};
		Radb.Collection.races.prototype.url = function()
		{
			var url = "race/?meeting=" + Radb.state.meeting;
			if (Radb.state.publication) {
				url += '&portal=true&publication=' + Radb.state.publication;
			}
			if (Radb.state.user) {
				url += '&user=' + Radb.state.user;
			}

			if(Radb.state.raceView == 'raceResults') {
				url += '&tz=Australia/Melbourne';
			}
			return url;
		};
		Radb.Collection.races.prototype.listener = function(topic, data)
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
		Radb.Collection.races.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			var data = Radb.server.request( url );
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

				Radb.PubSub.publish('update_state', {'races': self});
			});
			return data;
		};
})();

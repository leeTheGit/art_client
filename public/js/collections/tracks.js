(function()
{
	'use strict';


	Acme.Collection.track = function(model)
	{
		this.model 		= model;
		this.track		= [];
	};
		Acme.Collection.track.prototype.url = function()
		{
			return "track/";
		};
		Acme.Collection.track.prototype.update = function(topic, data)
		{
			if (topic === 'track_tz/selected') {
				var val  = data.split('::')
				var data = {};
				data['timezone'] = val[0];
				this.track[val[1]]
					.update(data);
				return;
			};
			if (topic === 'track_state/selected') {
				var val  = data.split('::')
				var data = {};
				data['state'] = val[0];
				this.track[val[1]]
					.update(data);
				return;
			};

			return this.fetch();
		};
		Acme.Collection.track.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			return Acme.server.request( url )
				.done( function(response) {
					self.track = _.map(response.data, function(track) {
						return Object.create(self.model,
							{	'data' : {
									'value': track,
									'writable': true
								}
							}
						);
					});
					Acme.PubSub.publish('track/reloaded', self);
			});
		};
		Acme.Collection.track.prototype.addTrack = function()
		{
			var self = this;
			var updateParams = {
				'name'     : 'unnamed',
				'code' 	   : 'xxx',
				'risa'     : 'unnamed',
				'timezone' : 'Australia/Melbourne',
				'state'    : 'VIC',
				'type'     : 'RA'
			};
			return Acme.server.create("track/", updateParams);
		};

})();

(function()
{
	'use strict';



	Acme.Collection.load = function(model)
	{
		this.date 		= moment();
		this.date       = this.date.add(1, 'days').format("YYYY-MM-DD");
		this.model = model;
		this.meetings = [];

		this.subscriptions = Acme.PubSub.subscribe({
			'Acme.load_col.update' : [ "load/loaded",
									   "load/updated",
									   "load/reloaded",
									   "load/deleted",
								       "load/fetch"]
		});
	};
		Acme.Collection.load.prototype.url = function()
		{
			var url = "load/?from=" + this.date;
			return url;
		};
		Acme.Collection.load.prototype.update = function(topic, data)
		{
			this.fetch();
		};
		Acme.Collection.load.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			var data = Acme.server.request( url );
			// console.log(url);
			data.done( function(response) {
				// console.log(response);
				// console.log(JSON.stringify(response));
				// var response = JSON.parse('');

				self.meetings = _.map(response.data, function(meeting) {
					return Object.create(self.model,
						{	'data' : {
								'value': meeting,
								'writable': true,
								'enumerable': true
							}
						}
					);
				});

				Acme.PubSub.publish('load/fetched', self);
			});
			return data;
		};
		Acme.Collection.load.prototype.delete_old = function()
		{
			var self = this;
			var start = moment().format('YYYY-MM-DD');
			return Acme.server.delete('loadlist/' + start)
			.done(function(r) {
				self.fetch();
			});
		};
})();

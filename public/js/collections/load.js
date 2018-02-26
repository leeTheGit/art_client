(function()
{
	'use strict';



	Radb.Collection.load = function(model)
	{
		this.date 		= moment();
		this.date       = this.date.add(1, 'days').format("YYYY-MM-DD");
		this.model = model;
		this.meetings = [];

		this.subscriptions = Radb.PubSub.subscribe({
			'Radb.load_col.update' : [ "load/loaded",
									   "load/updated",
									   "load/reloaded",
									   "load/deleted",
								       "load/fetch"]
		});
	};
		Radb.Collection.load.prototype.url = function()
		{
			var url = "load/?from=" + this.date;
			return url;
		};
		Radb.Collection.load.prototype.update = function(topic, data)
		{
			this.fetch();
		};
		Radb.Collection.load.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			var data = Radb.server.request( url );
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

				Radb.PubSub.publish('load/fetched', self);
			});
			return data;
		};
		Radb.Collection.load.prototype.delete_old = function()
		{
			var self = this;
			var start = moment().format('YYYY-MM-DD');
			return Radb.server.delete('loadlist/' + start)
			.done(function(r) {
				self.fetch();
			});
		};
})();

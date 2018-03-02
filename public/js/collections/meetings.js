(function()
{
	'use strict';


	Acme.Collection.meetings = function(model)
	{
		this.date 		= moment();
		this.model 		= model;
		this.meetings 	= [];
		this.subscriptions = Acme.PubSub.subscribe({
			'Acme.meeting_col.listener' : [ "timezoneSelect/selected",
										  "state_changed"
										  ]
		});
		this.listeners = {
			"date" : function(data) {
				return this.fetch();
			},
			"currentmeeting": function(data) {
				if(data.currentmeeting == null) {
					return this.fetch();
				}
			}
		};

	};
		Acme.Collection.meetings.prototype.url = function()
		{
			// return "meeting?"+Acme.state.daterange+"=" + Acme.state.date.format("YYYY-MM-DD") + "&results=true";

			var getResults = "";
			if (this.date > Acme.state.date) {
				getResults = "&results=true"
			};

			return "meeting?"+Acme.state.daterange+"=" + Acme.state.date.format("YYYY-MM-DD") + getResults;

		};
		Acme.Collection.meetings.prototype.listener = function(topic, data)
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
		Acme.Collection.meetings.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			// console.log('fetching meetings');
			// console.log(url);
			return Acme.server.request( url )
			 .done( function(response) {
				//  console.log(response);
			 	// console.log(JSON.stringify(response.data));
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

				Acme.PubSub.publish('update_state', {'meetings':self});
			});
		};


})();

(function()
{
	'use strict';


	Acme.Model.meeting = Acme.Model.create({
		'url' 			: 'meeting',
		'alias'         : 'currentmeeting',
		'messages' 		: {'set' : 'fetched'},
		'this' 			: {
			'data' : {}
		}
	});
		Acme.PubSub.subscribe({
			'Acme.Model.meeting.listener' : [ "state_changed", "update_state"]
		});

		Acme.Model.meeting.listeners = {
			"timezoneSelect" : function(data) {
				var self = this;
				var val  = data.timezoneSelect.split('::');
				this.update({'timezone': val[0]}).done(function(r) {
					if (r.data === true) {
						Acme.PubSub.publish('state_changed', {'meetingTZ': self});
					}
				});
			},
			"meeting" : function(data) {
				var self = this;
				this.data.id = data.meeting;
				this.query = ['results', 'true']; //, 'migrate', 'true'
				this.fetch().done(
					function(r) {
						if (r.data.date) {
							self.data = r.data;
							Acme.state.listener('update_state', {'currentmeeting': self});
						}
					}
				);
			}
		};
		Acme.Model.meeting.tab_link = function()
		{
			var self = this;

			return Acme.server.update(self.url(), {'tab_abbr_req':true})
			.done(function(response) {
				console.log(response);
				self.fetch();
			});
		};
		Acme.Model.meeting.ordercolours = function(races)
		{
			var self = this;
			var reqString = "";

			if (races && races.races && races.races.length !== 0) {
				for(var i=0;i<races.races.length;i++) {
					reqString += races.races[i] + ',';
				}
				self.query = ['data', 'silks_req', 'races', reqString];

				self.fetch(false).done(function(r) {
					self.query = [];
					var data = r.data;
					delete r.home;
					delete r.time;

					// silks api looks for an array of a sinlge object
					var datum = {'data':[]};
					datum.data.push(r.data);
					// console.log(datum);

					return Acme.server.create('jockeysilks', datum).done(function(r) {

						if (r.created == true) {
							var jerseys = r.stats.jerseys;
							var races = r.stats.races;
							Acme.effects.message(jerseys + ' jerseys, for ' + races + " races ordered");
							self.update({'require_colours': true});
						}
					});
				});
			} else {
				self.update(); // refreshes button
			}
		};

})();

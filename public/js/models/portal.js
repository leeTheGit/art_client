(function()
{
	'use strict';


	Radb.portal_meeting_model = Radb.Model.create({
		'url' 			: 'meeting',
		'alias'         : 'portalmeeting',
		'messages' 		: {'set' : 'fetched'},
		'this' 			: {
			'data' : {}
		}
	});
		Radb.portal_meeting_model.listeners = {

			"meeting" : function(data) {
				var self = this;
				this.data.id = data.meeting;
				if (!Radb.state.portalwindow) return;
				this.query = ['data', 'portal', 'portal', 'all']; //, 'migrate', 'true'
				this.fetch().done(
					function(r) {
						if (r.data) {
							self.data = r.data;
							Radb.state.listener('update_state', {'portalmeeting': self});
						}
					}
				);
			},
			"portalwindow" : function(data) {
				var self = this;
				this.query = ['data', 'portal', 'portal', 'all']; //, 'migrate', 'true'
				this.fetch().done(
					function(r) {
						if (r.data) {
							self.data = r.data;
							Radb.state.listener('update_state', {'portalmeeting': self});
						}
					}
				);

				console.log('portal window opened');
			}


			// "currentmeeting" : function(data) {
			// 	console.log(data);
			// 	if (data.currentmeeting != null) {
			// 		this.query = ['data', 'portal', 'portal', 'all']; //, 'migrate', 'true'
			// 		this.fetch();
			// 		return;
			// 	}
			// }

		}

		// Radb.portal_meeting_model.listeners = {
		// 	"timezoneSelect" : function(data) {
		// 		var self = this;
		// 		var val  = data.timezoneSelect.split('::');
		// 		this.update({'timezone': val[0]}).done(function(r) {
		// 			if (r.data === true) {
		// 				Radb.PubSub.publish('state_changed', {'meetingTZ': self});
		// 			}
		// 		});
		// 	}
		// };
		//
		// Radb.portal_meeting_model.listener = function(topic, data)
		// {
			// console.log(topic, data);
			// this.data.id = data.data.id;
			// if (topic === 'meeting/fetched') {
			// 	this.query = ['data', 'portal', 'portal', 'all']; //, 'migrate', 'true'
			// 	this.fetch();
			// }

		// 	var keys = Object.keys(data);
		// 	for (var i = 0; i<keys.length; i++) {
		// 		for (var listener in this.listeners) {
		// 			if ( listener === keys[i] ) {
		// 				this.listeners[listener].call(this, data);
		// 				break;
		// 			}
		// 		}
		// 	}
		//
		//
		//
		// };
		Radb.PubSub.subscribe({
			'Radb.portal_meeting_model.listener' : [ "state_changed"]
		});

})();

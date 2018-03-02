(function()
{
	'use strict';





	Acme.View.filter = function(config)
	{
		this.filter 		 = '';
		this.meetingtype  	 = null;
		this.meetingsort     = {
			"Date"          : false
		};
		this.days 			 = [];
		this.hiddendays      = [];
		this.loadStatus      = null;
		this.subscriptions = Acme.PubSub.subscribe({
			'Acme.filter.listener' : ["filter/updated"]
		});
	};
		Acme.View.filter.prototype.listener = function(topic, data) {

			if (data === null) return;

			var self = this;
			$.each(data, function(key, value) {
				self[key] = value;
			});

			if (localStorage['context'] === 'load') {
				Acme.PubSub.publish('load/filter', data);
			} else {
				Acme.PubSub.publish('meetings/filter', data);
			}
			return;
		};


	Acme.groupMenu = function(config)
	{
		this.data 			 = null;
		this.containerEl     = config.el;
		this.container       = null;
		this.name 			 = config.name || 'group';
		this.default 	 	 = config.default || null;
	};
		Acme.groupMenu.prototype.update = function(topic, data)
		{
			if (topic == 'groups/fetched') {
				this.data = data;
				Acme.PubSub.publish('update_state', {"group": this.default})
			}

			if ( Object.keys(data).indexOf('group') > -1) {
				this.default = data.group;
			}

			this.render();
		};
		Acme.groupMenu.prototype.render = function(config)
		{	var self = this;

			if (!this.data) return;

			self.container = $('#' + this.containerEl);

			if (typeof this.pubMenu == 'object') {
				this.pubMenu.remove();
			}
			var theList = [];

			var defaultSelect = null;

			for (var i=0;i<this.data.groups.length; i++) {

				var groupItem = self.data.groups[i];

				theList.push({
					'label' : groupItem.data.value.groupname,
					'value' : groupItem.data.value.groupid
				});

				if (groupItem.data.value.groupid === self.default) {
					defaultSelect = {"label": groupItem.data.value.groupname};
				}
			}

			if (!defaultSelect) {
				defaultSelect = {"label": theList[0].label};
			}

			this.pubMenu = new Acme._listMenu( {
						'parent' 		: this.container,
						'list' 			: theList,
						'defaultSelect' : defaultSelect,
						'name' 			: this.name,
						'listIcon' 		: 'fa-group',
			}).init().render();
		};


	Acme.userMenu = function(config)
	{
		this.data 			 = null;
		this.containerEl     = config.el;
		this.container       = null;
		this.name 			 = config.name || 'user';
		this.default 	 	 = Acme.state.user || null;
		this.defaultStyle 	 = null;
		this.subscriptions 	 = Acme.PubSub.subscribe({
			'Acme.userMenu_view.listener' : [ "update_state" ]
		});
		this.listeners = {
			"group" : function(data) {
				Acme.server.request( 'group/' + data.group ).done(function(response) {
					Acme.PubSub.publish('group/selected', response.data.users);
				});
			},
			"user" : function(data) {
				this.default = data.user;
				$('#' + this.containerEl).children()
					.removeClass(data.user ? 'group_off' : 'group_on')
					.addClass(data.user ? 'group_on' : 'group_off');
			},
		};
	};
		Acme.userMenu.prototype.listener = function(topic, data)
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

		Acme.userMenu.prototype.update = function(topic, data)
		{
			if (topic == 'group/selected') {
				this.data = data;
				this.render();
			}
		};
		Acme.userMenu.prototype.render = function(config)
		{	var self = this;

			if (!this.data || !Acme.state.group) return;

			self.container = $('#' + this.containerEl);

			if (typeof this.pubMenu == 'object') {
				this.pubMenu.remove();
			}
			var theList = [];

			var defaultSelect = null;

			theList.push({
				'label' : 'None selected',
				'value' : null,
			});

			for (var i=0;i<self.data.length; i++) {
				var userItem = self.data[i];

				theList.push({
					'label' : userItem.firstname + ' ' + userItem.lastname,
					'value' : userItem.userid,
				});

				if (userItem.userid === self.default) {
					defaultSelect = {"label": userItem.firstname + ' ' + userItem.lastname};
					Acme.PubSub.publish('update_state', {"user": userItem.userid})
					this.defaultStyle = 'group_on';
				}
			}

			if (!defaultSelect) {
				defaultSelect = {"label": theList[0].label};
				Acme.PubSub.publish('update_state', {"user": null})
				this.defaultStyle = 'group_off';
			}

			console.log(defaultSelect);
			console.log(this.defaultStyle);

			this.pubMenu = new Acme._listMenu( {
						'parent' 		: this.container,
						'list' 			: theList,
						'defaultSelect' : defaultSelect,
						'name' 			: this.name,
						'defaultStyle'  : this.defaultStyle,
						'listIcon' 		: 'fa-user',
			}).init().render();
		};



	Acme.render_meetings = function()
	{
		$('.meeting_editor').html(template('meeting-editor'));
		$('.race-info').html(template('race-info'));
		$('.runners-info').html(template('runner-info'));
		$('#meeting_load_filter').hide();
		$('.meetingsList').empty();
	};

	Acme.render_load = function()
	{
		$('.meeting_editor').html(template('load-editor'));
		$('#meeting_load_filter').show();
		$('.meetingsList').empty();
	};

	Acme.render_results = function()
	{
		$('.meeting_editor').html('');
		$('#meeting_load_filter').hide();
		// $('.meetingsList').empty();
	};




	function numberWithCommas(x)
	{
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	var by = function (path, reverse, primer, then) {
		var get = function (obj, path) {
				path = path.split('.');
				for (var i = 0, len = path.length; i < len - 1; i++) {
					obj = obj[path[i]];
				};
				return obj[path[len - 1]];
			},
			prime = function (obj) {
				return primer ? primer(get(obj, path)) : get(obj, path);
			};

		return function (a, b) {
			var A = prime(a),
				B = prime(b);

			return (
				(A < B) ? -1 : (
					(A > B) ? 1 : (
						(typeof then === 'function') ? then(a, b) : 0
					)
				)
			) * [1,-1][+!!reverse];
		};
	};



		// http://jsfiddle.net/gfullam/sq9U7/
		// x.sort(
	 	// 		by('props.city', false, function (x) { return x.toUpperCase() })
		// );

		// IMPLEMENTS 'THEN':
		// x.sort(
		//     by('props.state', true, null,
		//         by('props.zip', false, parseFloat)
		//     )
		// );



		// var by = function(field, reverse, primer){
		//    var key = function (x) {return primer ? primer(x[field]) : x[field]};

		//    return function (a,b) {
		// 	  var A = key(a), B = key(b);
		// 	  return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];
		//    }
		// }



})();

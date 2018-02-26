(function()
{
	'use strict'
    window.Radb 	  = {};
	Radb.View 	  	  = {};
	Radb.Model 		  = {};
	Radb.Collection   = {};
	Radb.Feed 		  = {};
    Radb.PubSub 	  = {};
	Radb.effects      = {};


	Radb.timezones = ['Australia/Melbourne',
					  'Australia/Sydney',
					  'Australia/Brisbane',
					  'Australia/Perth',
					  'Australia/Hobart',
					  'Australia/Canberra',
					  'Australia/Adelaide',
					  'Australia/Darwin',
					  'Australia/Broken_Hill',
					  'NZ',
					  'Hongkong',
					  'Asia/Singapore',
					  'Africa/Johannesburg',
					  'Europe/London',
					  'Europe/Dublin',
					  'Europe/Paris',
					  ];

	Radb.venueStates = ['VIC', 'NSW', 'QLD', 'WA', 'TAS', 'ACT', 'SA', 'NT', 'NZ', 'Hongkong', 'Singapore', 'South Africa', 'UK']

    window.template   = function(id) {
    	if ($('#' + id).html() == void (0)) {
	        console.log(id, $('#' + id));
	        console.log( $('#' + id).html() );
    	}
        return _.template( $('#' + id).html().trim() );
    }

	$.fn.onEnter = function(func) {
		this.bind('keypress', function(e) {
			if (e.keyCode == 13) func.apply(this, [e]);
		});
		return this;
	}


	// Radb.extend =  function(obj) {
	//
    //     var length = arguments.length;
    //     if (length < 2 || obj === null) return obj;
    //     for (var i = 1; i < length; i++) {
    //         var source = arguments[i],
    //             keys = Object.keys(source),
    //             l = keys.length;
    //         for (var j = 0; j < l; j++) {
    //             var key = keys[j];
    //             if (obj[key] === void 0) obj[key] = source[key];
    //         }
    //     }
    //     return obj;
    // };


	Radb.listen = function() {};

	Radb.listen.prototype.listener = function(topic, data)
	{
		// console.log(topic, data);
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

	Radb.State = function()
	{
		this.page 			= 'meeting';
		this.date           = moment().add(1, 'days');
		this.daterange      = 'from'; // {from} for multiples dates || {date} for single date
		this.publication 	= null;
		this.tipster 		= null;
		this.user 			= null;
		this.country		= 'Australia';
		this.resultsState   = 'vic';
		this.group			= '';

		this.portalmeeting  = null;

		this.meeting	    = null;
		this.currentmeeting = null;
  		this.meetings       = null;

		this.loadmeetings   = null;
		this.loadSelect     = null;

		this.race  			= null;
		this.races          = null;
		this.raceView	 	= 'raceData';

		this.runner 		= null;
		this.runners        = null;


		this.track 			= null;
		this.output 		= null;
		// this.selected 		= null;
		this.raceview       = 'race';
		this.portalwindow   = false;
	};
		Radb.State.prototype.listener = function(topic, data)
		{
			// console.log(topic, data);
			if (topic === 'update_state') {
				if (data.hasOwnProperty('date_rel') || data.hasOwnProperty('date_abs') ) {
					// console.log('DATES');
					if (data.hasOwnProperty('date_rel')) {

						if (data.date_rel === 'Previous') this.date.add(-1, 'days');
						if (data.date_rel === 'Next') this.date.add(1, 'days');
					}
					if (data.hasOwnProperty('date_abs')) {
						this.date = moment(data.date_abs);
					}

					// console.log('publishing state change for date');
					Radb.PubSub.publish('state_changed', {'date':this.date});
				}

				delete data['date_rel'];
				delete data['date_abs'];

				var keys  = Object.keys(data);

				for (var i = 0; i<keys.length;i++) {
					var key = keys[i];

					if (this.hasOwnProperty(key)) {
						this[key] = data[key];
						data = {};
						data[key] = this[key];
						// console.log('publishing state changed for ' + key);
						Radb.PubSub.publish('state_changed', data );
					}
				}

				Radb.PubSub.publish('url/updated', Radb.state);

			}

			if (topic === 'resource/selected') {
				Radb.PubSub.publish('url/updated', Radb.state);
			}


			if (topic === 'resource/updated') {

				Radb.state.track 			= data.track 		|| null;
				Radb.state.publication 		= data.publication  || null;
				Radb.state.output 			= data.output 		|| null;

				if (data.type === 'Horse' || data.type === 'Jockey') {
					Radb.state.meeting 		= data.meetid 		|| null;
					Radb.state.race 		= data.raceid 		|| null;
					Radb.state.runner 		= data.id 			|| null;
				} else {
					Radb.state.meeting 		= data.meetid 		|| null;
					Radb.state.race 		= data.raceid 		|| null;
					Radb.state.runner 		= null;
				}
				Radb.PubSub.publish('url/updated', Radb.state);
				this.loadFromUrl();
			}


			if (topic === 'load_from_url') {
				Radb.url.getParams();
				this.loadFromUrl();
			}
		};
		Radb.State.prototype.loadFromUrl = function()
		{
			console.log('load from url');
			console.log(Radb.state);

			if (Radb.state.meeting) {
				// console.log('state_changed : meeting');
				Radb.PubSub.publish('state_changed', {'meeting' : Radb.state.meeting});
				// var today = moment();
				// var date = r.data.date;
				// if (moment(date) < today ) {
				// 	date = moment().format("YYYY-MM-DD");
				// }
				// Radb.state.listener('update_state', {'date_abs': date, 'daterange': 'from'});

			}
			// else {
				if (localStorage['context'] == 'load') {

					Radb.PubSub.publish('load/fetch');

				} else {

					Radb.PubSub.publish('state_changed', {'date' : Radb.state.date});
				}
			// }

			// if (Radb.state.race) {
			// 	Radb.PubSub.publish('race/selected',  Radb.state.race);
			// }
			// if (Radb.state.runner) {
			// 	Radb.PubSub.publish('runner/selectbyid', Radb.state.runner);
			// }
			if (Radb.state.track) {
				Radb.PubSub.publish('track/selectbyid', Radb.state.track);
			}
			// if (Radb.state.publication) {
			// 	Radb.PubSub.publish('publication/selectbyid', Radb.state.publication);
			// }
			// if (Radb.state.output) {
			// 	Radb.PubSub.publish('output/selectbyid', Radb.state.output);
			// }
		};

	Radb.Url = function()
	{
		this.page = {
			'meeting': {
							'resource': ['meeting'],
						 	'params': ['race', 'runner']
						},
			'tracks'  : {
							'resource': ['track'],
							'params': []
						},
			'outputs' : {
							'resource': ['publication'],
							'params': ['output']
						}
		};
		this.buildResourceFromUrl();
		this.queryString = '';
	};
		Radb.Url.prototype.listener = function(topic, data)
		{
			var query = {};
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					if (data[key]) {
						query[key] = data[key];
					}
				}
			}
			this.updateQuery(query);
			this.generateURL();
		};
		Radb.Url.prototype.generateURL = function() {

			this.buildPath();
			this.buildQuery();
			this.url =  this.path + this.queryString;

			localStorage[Radb.state.page] = this.url;

			this.push();
			return this;
		};
		Radb.Url.prototype.getQueryFromString = function(query)
		{
			return query.split(/[?=&]/);
		};
		Radb.Url.prototype.push = function()
		{
			window.history.pushState("Test", "test2", this.url);
		};
		Radb.Url.prototype.updateQuery = function(query)
		{
			this.query = [];
			var keys = Object.keys(query);
			var schema = this.page[Radb.state.page]['params'];
			keys = _.filter(keys, function(key) {
				if (schema.indexOf(key) > -1) {
					return key;
				}
			});
			for(var j=0;j<keys.length;j++) {
				var update = false;
				for(var i=0;i<this.query.length;i++) {
					if (this.query[i] === keys[j]) { // found key in array
						if (!query[keys[j]]) {
							this.query.splice(i, i+1); // delete key if falsy
							break;
						}
						this.query[i+1] = query[keys[j]]; // update key if already exists
						update = true;
						break;
					}
				}
				if (query[keys[j]] && !update) {
					this.query.push(keys[j]);  // add key to query if not alreay updated and truthy
					this.query.push(query[keys[j]]);  // add value to query if not alreay updated and truthy
				}
			}
		};
		Radb.Url.prototype.buildPath = function()
		{
			var path = '/';
			path += Radb.state.page + '/';
			var schema = this.page[Radb.state.page]['resource'];
			for(var i=0;i<schema.length; i++) {
				if (Radb.state[schema[i]]) {
					path += Radb.state[schema[i]] + '/';
				}
			}
			this.path = path;

			return this;
		};
		Radb.Url.prototype.buildQuery = function()
		{
			var query = '';
			for(var i=0;i<this.query.length; i+=2) {
				if (this.query[i+1] != false ) {
					query += (i===0) ? '?' : '&';
					query += this.query[i] + '=' + this.query[i+1];
				}
			}
			this.queryString = query;
		};
		Radb.Url.prototype.getFullPath = function()
		{
			var path = this.path.split('/');
			path.shift();
			return path.join('/') + this.queryString;
		};
		Radb.Url.prototype.buildResourceFromUrl = function()
		{
			this.url   = window.location;
			this.host  = this.url.host;
			this.path  = this.url.pathname;
			this.query = this.getQueryFromString(this.url.search);
			this.query.shift();
		};
		Radb.Url.prototype.getParams = function()
		{
			this.buildResourceFromUrl();
			var path = this.path.split('/');
			if (path[1] == '') path[1] = 'meeting';
			var state = this.page[path[1]]['resource'];
			for(var i=2;i<path.length; i++) {
				if (path[i] != '') {
					Radb.state[state] = path[i];
				}
			}
			for(var i=0;i<this.query.length; i+=2) {
				if (this.query[i] in Radb.state) {
					Radb.state[this.query[i]] = this.query[i+1];
				}
			}
			this.generateURL();
			return this;
		};



	Radb._listMenu = function(config)
	{
		this.defaultTemp  	  = _.template('<div id="<%= name %>" class="pulldown <%= default_style %>"><div class="flex_row"><div class="flex1 fa fa-lg <%= listIcon %> icon_shift"></div><p class="flex3"></p><i class="fa fa-lg fa-caret-down flex1 icon_shift" /></div><ul></ul></div>');
		this.defaultItemTemp  = _.template('<li class="<%= item_style %>" data-value="<%= value %>"><%= label %></li>');
		this.menuParent		  = config.parent 	 	 || {};
		this.template 		  = config.template  	 || this.defaultTemp;
		this.itemTemp 		  = config.itemTemp 	 || this.defaultItemTemp;
		this.list 			  = config.list 	 	 || [];
		this.defaultSelection = config.defaultSelect || null;
		this.defaultStyle 	  = config.defaultStyle  || '';
		this.name 			  = config.name 	 	 || null;
		this.listIcon 		  = config.listIcon 	 || '';
		this.listContainer	  = null;
		this.defaultItem	  = null;
		return this;
	};
		Radb._listMenu.prototype.init = function(prepend)
		{
			var prepend = prepend || 'append';
			this.menuParent[prepend]( this.template({"name": this.name, "default_style": this.defaultStyle, "listIcon": this.listIcon}) );
			this.defaultItem   = $('#' + this.name+' p');
			this.listContainer = $('#' + this.name+' ul');
			this.events();
			if (this.extendedEvents) this.extendedEvents();
			return this;
		};
		Radb._listMenu.prototype.render = function()
		{
			this.listContainer.empty();
			if (this.defaultSelection != null) {
				this.defaultItem.text(this.defaultSelection.label);
			}
			var html = this.createList();
			this.listContainer.append( html );
			this.listItemEvents();
			return this;
		};
		Radb._listMenu.prototype.events = function()
		{
			var self = this;
			this.defaultItem.parent().on('click', function(e) {
				e.stopPropagation();
				self.listContainer.show();
			});
		};
		Radb._listMenu.prototype.createList = function()
		{
			var itemTemp = this.itemTemp;
			var html = '';
			for (var i=0; i<this.list.length; i++) {
				html += itemTemp({
					'label'	  :  this.list[i].label,
					'value'   :  this.list[i].value,
					'item_style'   :  this.list[i].style || '',
				});
			}
			return html;
		};
		Radb._listMenu.prototype.select = function(item)
		{
			var menuid = '#' + this.name + ' > p';
			$(menuid).text(item);
			return this;
		};
		Radb._listMenu.prototype.listItemEvents = function()
		{
			var self = this;
			this.listContainer.on('click', function(e) {
				var elem = $(e.target);
				var value = elem.data('value');

				var data = {};
				data[self.name] = value;
				Radb.PubSub.publish('update_state', data);
				self.defaultItem.text(elem.text());
				self.defaultSelection.label = elem.text();
				$(self.listContainer).hide(100);
			});
		};
		Radb._listMenu.prototype.remove = function()
		{
			$('#' + this.name).remove();
			return this;
		}
		Radb._listMenu.prototype.clear = function()
		{
			$('#' + this.name).html('');
			return this;
		}
	   	Radb._listMenu.prototype.empty = function()
		{
			this.listContainer.empty();
			return this;
		}
	   	Radb._listMenu.prototype.update = function(list)
		{
			this.list = list;
			this.empty();
			this.render();
			return this;
		}



	Radb.listMenu = function(config)
	{
		this.defaultTemp  	  = _.template('<div id="<%= name %>" class="pulldown"><p></p><span></span><ul></ul></div>');
		this.defaultItemTemp  = _.template('<li data-value="<%= value %>"><%= label %></li>');
		this.menuParent		  = config.parent 	 	 || {};
		this.template 		  = config.template  	 || this.defaultTemp;
		this.itemTemp 		  = config.itemTemp 	 || this.defaultItemTemp;
		this.defaultSelection = config.defaultSelect || null;
		this.name 			  = config.name 	 	 || null;
		this.callback 		  = config.callback 	 || null;
		this.listContainer	  = null;
		this.defaultItem	  = null;
		return this;
	};
		Radb.listMenu.prototype.init = function(data)
		{
			// console.log(data);
			this.list = data.map(function(item) {
				return {
					'label': item,
					'value': item,
				}
			});

			this.menuParent['append']( this.template({"name": this.name}) );
			this.defaultItem   = $('#' + this.name+' p');
			this.listContainer = $('#' + this.name+' ul');
			this.events();
			if (this.extendedEvents) this.extendedEvents();
			return this;
		};
		Radb.listMenu.prototype.render = function()
		{
			this.listContainer.empty();
			if (this.defaultSelection != null) {
				this.defaultItem.text(this.defaultSelection.label);
			}
			var html = this.createList();
			this.listContainer.append( html );
			this.listItemEvents();
			return this;
		};
		Radb.listMenu.prototype.events = function()
		{
			var self = this;
			this.defaultItem.parent().on('click', function(e) {
				e.stopPropagation();
				self.listContainer.show();
			});
		};
		Radb.listMenu.prototype.createList = function()
		{
			var itemTemp = this.itemTemp;
			var html = '';
			for (var i=0; i<this.list.length; i++) {
				html += itemTemp({
					'label'	  :  this.list[i].label,
					'value'   :  this.list[i].value
				});
			}
			return html;
		};
		Radb.listMenu.prototype.select = function(item)
		{
			var menuid = '#' + this.name + ' > p';
			$(menuid).text(item);
			return this;
		};
		Radb.listMenu.prototype.listItemEvents = function()
		{
			var self = this;
			this.listContainer.on('click', function(e) {
				console.log('clicked a list itme');
				var elem = $(e.target);
				var value = elem.data('value');

				var data = {};
				data[self.name] = value;
				console.log(self.callback);
				self.callback(data);

				// Radb.PubSub.publish('update_state', data);
				self.defaultItem.text(elem.text());
				self.defaultSelection.label = elem.text();
				$(self.listContainer).hide(100);
			});
		};
		Radb.listMenu.prototype.remove = function()
		{
			$('#' + this.name).remove();
			return this;
		}
		Radb.listMenu.prototype.clear = function()
		{
			$('#' + this.name).html('');
			return this;
		}
	   	Radb.listMenu.prototype.empty = function()
		{
			this.listContainer.empty();
			return this;
		}
	   	Radb.listMenu.prototype.update = function(list)
		{
			this.list = list;
			this.empty();
			this.render();
			return this;
		}



	Radb.Model.create = function(config)
	{
		var obj = Object.create(
		Radb._Model.prototype, {'resource': {
									'value' : config['url'],
									'enumerable': true,
								},
								'alias' : {
									'value' : config['alias'] || null,
									'enumerable': true,
								},
								'resource_id': {
									'value' : config['resource_id'],
									'enumerable': true,
								},
								'query' : {
									'value': [],
									'writable': true,
								    'enumerable': true,
								}
					 }
		);
		for (var param in config['this']) {
			obj[param] = config['this'][param];
		}
		obj.messages = {
			'set'   : 'updated',
			'delete': 'deleted',
		};

		if (config['messages']) {
			for (var msg in config['messages']) {
				obj.messages[msg] = config['messages'][msg];
			}
		}

		return obj;
	};



	Radb.View.create = function(config)
	{
		function obj() {};
		obj.prototype = Object.create(Radb.listen.prototype,
			{
				'template': {
					'value' : config['temp'] || null,
					'enumerable': true,
				},
				'container' : {
					'value' : config['container'] || null,
					'writable': true,
					'enumerable': true,
				},
				'listeners': {
					'value' : config['listeners'],
					'enumerable':true,
				}
		 	}
		);

		obj.prototype.clear = function()
		{
			$(this.container).empty();
		};
		obj.prototype.soften = function()
		{
			console.log(typeof this.container);
			if (typeof this.container == 'string') {
				this.container.css('opacity', '.4');
			} else {
				$(this.container).css('opacity', '.4');
			}
		};
		obj.prototype.brighten = function()
		{
			if (typeof this.container == 'string') {
				this.container.css('opacity', '1');
			} else {
				$(this.container).css('opacity', '1');
			}
		};

		return new obj();
	}



	Radb._Collection = function() {};
		Radb._Collection.prototype = Object.create(Radb.listen.prototype);



	Radb._Model = function() {};
		Radb._Model.prototype = Object.create(Radb.listen.prototype);
		Radb._Model.prototype.url = function()
		{
			if (this.resource_id) {
				var scope = this;
	            var scopeSplit = this.resource_id.split('.');
	            for (var k = 0; k < scopeSplit.length; k++) {
	                scope = scope[scopeSplit[k]];
	                if (scope == undefined) return;
	            }
	            var resource_id = scope
			}
			var id = resource_id || this.data.id;
			return this.resource + '/' + id + this.buildParams();
		};
		Radb._Model.prototype.buildParams = function()
		{
			var query = '';
			for(var i=0;i<this.query.length; i+=2) {
				if (this.query[i+1] != false ) {
					query += (i===0) ? '?' : '&';
					query += this.query[i] + '=' + this.query[i+1];
				}
			}
			return query;
		};
		Radb._Model.prototype.fetch = function(set)
		{
			var self = this;
			var set = (set === void 0) ? true : set;
			// console.log(self.url());
			return Radb.server.request(self.url())
			.done(function(r) {
				// console.log(r);
				if (set) self.set(r.data);
			});
		};
		Radb._Model.prototype.update = function(data, msg)
		{
			var self = this;

			return Radb.server.update(self.url(), data)
			.done(function(d, status, xhr) {
				if (xhr.status === 200) {
					self.set(data, msg);

					var message = self.resource + '/update';

					Radb.socket.send(JSON.stringify({action: message, value: self.data.id}));

				}
			});
		};

		Radb._Model.prototype.updater = function()
		{
			var self = this;
			var _url = self.url();

			return function(data, msg) {
				return Radb.server.update(_url, data)
				.done(function(d, status, xhr) {
					if (xhr.status === 200) {
						// console.log(data);
						self.set(data, msg);
					}
				});
			}
		};

		Radb._Model.prototype.set = function(value, msg)
		{
			// console.log('setting new data');
			// console.log(msg);
			var suppress = msg || false;
			for (var v in value) {
				this.data[v] = value[v];
			}
			if (!suppress) {
				// console.log(this.resource);
				var resource = {};
				resource[this.resource] = this;
				// Radb.PubSub.publish('state_changed', resource);
				// Radb.PubSub.publish('update_state', resource);
				// console.log(this.resource + '/' + this.messages.set);
				Radb.PubSub.publish(this.resource + '/' + this.messages.set, this);
			}
		};
		Radb._Model.prototype.delete = function()
		{
			var self = this;
			var name = self.alias || self.resource;
			var msg = name + '/delete';

			console.log(Radb.socket.send(JSON.stringify({action: msg, value: self.data.id})));

			return Radb.server.delete(self.url())
			.done(function(response) {
				if (response.data == true) {
					self.data = {};
					var data =  {};
					data[name] = null;
					console.log(data);
					Radb.PubSub.publish('update_state', data);
				}
			});
		};


	Radb.getTimeDuration = function(start, end)
	{
		var difference   = moment.duration(end.diff(start)),
			diffWeeks    = difference.weeks(),
			diffDays     = difference.days(),
			diffHours    = difference.hours(),
			diffMins     = difference.minutes(),
			diffSeconds  = difference.seconds(),

			weekSuffix   = 'weeks',
			daySuffix    = 'days',
			hourSuffix   = 'hrs',
			minSuffix 	 = 'mins',
			secSuffix 	 = 'seconds',


			timeDiffString = '';

		if (diffWeeks > 0 ) {
			if (diffWeeks === 1) {
				weekSuffix = 'week';
			}
			return diffWeeks + ' ' + weekSuffix + ' ';
		}

		if (diffDays > 0 ) {
			if (diffDays === 1) {
				daySuffix = 'day';
			}
			return diffDays + ' ' + daySuffix + ' ';
		}

		if (diffHours > 0 ) {
			if (diffHours === 1) {
				hourSuffix = 'hr';
			}
			timeDiffString = timeDiffString + diffHours + ' ' + hourSuffix + ' ';
		}

		if (diffMins > 0 ) {
			if (diffMins === 1) {
				minSuffix = 'min';
			}
			timeDiffString = timeDiffString + diffMins + ' ' + minSuffix + ' ';
		}

		if (diffMins == 0 && diffSeconds > 0 ) {
			timeDiffString = timeDiffString + diffSeconds + ' ' + secSuffix + ' ';
		}
		return timeDiffString;
	};


    Radb.PubSub = {
        topics : {},
        lastUid : -1,
    };

        Radb.PubSub.publisher = function(topic, data) {
            var self = this;
            var Deferred = function() {
                return {
                    done: function(func) {
                        this.func = func;
                    },
                    resolve: function() {
                        if (this.func) {
                            this.func();
                        }
                    }
                }
            };


            if ( !this.topics.hasOwnProperty( topic ) ){
                return false;
            }

            var dfd = Deferred();

            var notify = function(){
                var subscribers = self.topics[topic];
                for ( var i = 0, j = subscribers.length; i < j; i++ ){
                    // console.log(topic, subscribers[i].context, subscribers[i].func);

                    var scope = window;
                    var scopeSplit = subscribers[i].context.split('.');
                    for (var k = 0; k < scopeSplit.length - 1; k++) {
                        scope = scope[scopeSplit[k]];
                        if (scope == undefined) return;
                    }

                    scope[scopeSplit[scopeSplit.length - 1]][subscribers[i].func]( topic, data );
                }
                dfd.resolve();
            };

            setTimeout( notify , 0 );

            return dfd;
        };

        /**
         *  Publishes the topic, passing the data to it's subscribers
         *  @topic (String): The topic to publish
         *  @data: The data to pass to subscribers
        **/

        Radb.PubSub.publish = function( topic, data ){
            return this.publisher( topic, data, false );
        };


        Radb.PubSub.reset = function( ){
            this.lastUid = -1;
        };

        Radb.PubSub.print = function(){
            // console.log(this.topics);
            var subscribers = this.topics;
            console.log(subscribers);
            for (var sub in subscribers) {
                console.log(sub);
                for ( var i = 0; i < subscribers[sub].length; i++ ) {
                    console.log('    ', subscribers[sub][i].context, subscribers[sub][i].func);
                }
            }
        };

        /**
         *  Subscribes the passed function to the passed topic.
         *  Every returned token is unique and should be stored if you need to unsubscribe
         *  @topic (String): The topic to subscribe to
         *  @func (Function): The function to call when a new topic is published
        **/

        Radb.PubSub.subscribe = function( subscription ) {
            // console.log(subscription);
            var callbacks = Object.keys(subscription);
            // console.log(callbacks);
            var ret_topics = {};

            for (var i=0;i<callbacks.length; i++) {
                // console.log(subscription[callbacks[i]]);
                for(var j=0;j<subscription[callbacks[i]].length;j++) {
                    var topic = subscription[callbacks[i]][j];
                    // console.log(topic);

                    var context = callbacks[i].substring(0, callbacks[i].lastIndexOf('.'));
                    var func = callbacks[i].substring(callbacks[i].lastIndexOf('.') + 1);
                    // console.log(context,func);
                    if ( !this.topics.hasOwnProperty( topic ) ) {
                        this.topics[topic] = [];
                    }

                   for (var k=0;k<this.topics[topic].length; k++) {
                        if (this.topics[topic][k].context === context && this.topics[topic][k].func === func) {
                            return;
                        }
                    }

                    var token = (++this.lastUid).toString();

                    this.topics[topic].push( { token : token, func : func, context : context } );
                    ret_topics[topic] = this.topics[topic];
                }

            }
            return ret_topics;
        };

        /**
         *  Unsubscribes a specific subscriber from a specific topic using the unique token
         *  @token (String): The token of the function to unsubscribe
        **/

        Radb.PubSub.unsubscribe = function( token ){
            for ( var m in this.topics ){
                if ( this.topics.hasOwnProperty( m ) ){
                    for ( var i = 0, j = this.topics[m].length; i < j; i++ ){
                        if ( this.topics[m][i].token === token ){
                            this.topics[m].splice( i, 1 );
                            return token;
                        }
                    }
                }
            }
            return false;
        };





	Radb.server = {

		create: function(uri, queryParams) {return this.call(uri, queryParams, 'post');},
		request: function(uri, queryParams, datatype){return this.call(uri, queryParams, 'get', datatype);},
		update: function(uri, queryParams) {return this.call(uri, queryParams, 'put');},
		delete: function(uri, queryParams) {return this.call(uri, queryParams, 'delete');},
		login: function(uri, queryParams) {return this.callClient(uri, queryParams, 'post');},
		call: function(uri, queryParams, type, datatype) {

			if (!window.location.origin) {
				 window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
			}
			type = (typeof type !== 'undefined') ? type : 'get';

			queryParams = (typeof queryParams !== 'undefined') ? queryParams : {};

			console.log(type + ': ' + window.location.origin + '/api/' + uri);
			if (Object.keys(queryParams).length > 0 ) console.log(queryParams);

			return $.ajax({
				url: window.location.origin + '/api/' + uri,
				data: queryParams,
				dataType: datatype || "json",
				type: type
			}).fail(function(r) {
				console.log(r);
				if (r.status == 501 || r.status == 404) Radb.effects.errorMessage(r.responseText);
				if (r.responseJSON) Radb.effects.message(r.responseJSON);
			});
		},
		callClient: function(uri, queryParams, type) {
			type = (typeof type !== 'undefined') ? type : 'get';
			queryParams = (typeof queryParams !== 'undefined') ? queryParams : '';
			return $.ajax({
				url: window.location.origin + uri,
				data: queryParams,
				dataType: "json",
				type: type
			});
		}
	}

	Radb.by = function (path, reverse, primer, then, dataTransform) {
		var get = function (obj, path) {
				path = path.split('.');
				for (var i = 0, len = path.length; i < len - 1; i++) {
					obj = obj[path[i]];
				};
				return obj[path[len - 1]];
			},
			prime = function (obj) {
				var data = primer ? primer(get(obj, path)) : get(obj, path);
				if (typeof dataTransform === 'function') {
					data = dataTransform(data);
				}
				return data
			};

		return function (a, b) {
			// Radb.counter++;
			// var objindex = Radb.sortObjs.indexOf(a);
			// // console.log(objindex);
			// var key = a.data.venue;
			// if (objindex > -1) {
			// 	// console.log('adding number to sort track');
			// 	// console.log(Radb.ObjCount[key]);
			// 	Radb.ObjCount[key] = Radb.ObjCount[key] + 1;
			// } else {
			// 	Radb.sortObjs.push(a);
			// 	Radb.ObjCount[a.data.venue] = 1;
			// }
			var A = prime(a),
				B = prime(b);
			// console.log(A, B);
			var res = (
				(A < B) ? -1 : (
					(A > B) ? 1 : (
						(typeof then === 'function') ? then(a, b) : 0
					)
				)
			) * [1,-1][+!!reverse];
			// console.log(res);
			return res;
		};
	};


})();

(function()
{
	'use strict';


	var loadList = function(parent, list, meeting)
	{
		this.list 		= list;
		this.parent 	= parent;
		this.meeting    = meeting;
 		this.template 	= template('loadOptionList');
		this.selected   = [];
		var self = this;
		self.parent.append(self.template);
		// self.render();
		this.dfd = $.Deferred();

	};
		loadList.prototype.render = function()
		{

			var listElem = $('#importList');
			var itemTemp = _.template('<li class="<%= theClass %>" data-value="<%= theValue %>"><%= label %></li>');
			var html = '';
			var theClass = '';

			for (var i=0; i<this.list.length; i++) {
				var key = Object.keys(this.list[i])[0];

				var label = this.list[i][key]['label'];
				var value = this.list[i][key]['value'];
				var status = (this.list[i][key]['status'] === 'update') ? 'update' : '';
				var theClass = key + ' ' + status;

				html += itemTemp({
					'theClass' : theClass,
					'label' : label,
					'theValue' : value,
				});
			}
			listElem.empty().prepend(html);
			this.events();
			return this;
		};
		loadList.prototype.close = function()
		{
			$('#importOptWindow').remove();
		};
		loadList.prototype.clearSelected = function()
		{
			$('#importList li').each(function(i,e) {
				var elem = $(e);
				if (elem.hasClass('selectedTask')) {
					elem.removeClass('selectedTask')
					 .removeClass('update');
				}
			});
			this.selected = [];

		};
		loadList.prototype.events = function()
		{
			var self = this;
			$('#importList').on('click', function(e) {
				var $elem = $(e.target);
				var label = $elem.data('value');
				if ($elem.is('ul') ) return;
				if ($elem.hasClass('selectedTask')) {
					$elem.removeClass('selectedTask');
					var index = self.selected.indexOf( label );
					console.log(label);
					console.log(self.selected);
					console.log(index);
					if (index !== -1) self.selected.splice(index, 1);
					console.log(self.selected);
				} else if (label === 'All') {
					$elem.addClass('selectedTask');
					self.selected = ['All'];
					$(this).children().each(function(i,e) {
						var $e = $(e);
						if ($e.text() !== 'All') {
							$e.removeClass('selectedTask');
						}
					});
				} else if ($elem.hasClass('item')) {
					$(this).children().each(function(i,e) {
						var $e = $(e);
						if ($e.text() === 'All') {
							$e.removeClass('selectedTask');
							var index = self.selected.indexOf( 'All' );
							if (index !== -1) self.selected.splice(index, 1);
						}
					});
					$elem.addClass('selectedTask');
					if (self.selected.indexOf(label ) === -1) {
						self.selected.push( label );
					}
				}
			});

			$('#import').on('click', function(e) {
				e.preventDefault();
				Radb.PubSub.publish('update/start');

				var choiceTmp = self.selected.slice();
				// console.log(choiceTmp);
				// console.log('Original Selected', self.selected);
				// console.log('All updates to do', self.meeting.allUpdates);
				var plurals = ['Jockeys', 'Runners', 'Markets', 'Ratings'];

				choiceTmp = choiceTmp.map(function(c) {
					if (plurals.indexOf(c) > -1) {
						return c.replace(' ', '').slice(0, -1);
					}
					return c.replace(' ', '');
				});
				// console.log('Choices with stripped plurals', choiceTmp);

				var leftOvers = self.meeting.allUpdates.filter(function(update) {
					return choiceTmp.indexOf(update) < 0;
				});
				// console.log('Leftovers', leftOvers);
				var params = {};

				for (var i=0;i<self.selected.length;i++) {
					params[self.selected[i]] = true;
				}

				self.meeting.allUpdates = leftOvers.map(function(c) {
					if (plurals.indexOf(c) > -1) {
						return c + 's';
					}
					return c;
				});

				self.clearSelected();

				if (leftOvers.length === 0) {
					self.close();
				}
				// console.log(self.selected);
				self.meeting.update(params).then(function(r) {
					// console.log(self.selected);
					Radb.PubSub.publish('import/done');
				});
			});

			$('#clear').on('click', function(e) {
				e.preventDefault();
				self.close();
				self.meeting.update({'clearupdates':true});
			});

			$('#importClose').on('click', function(e) {
				e.preventDefault();
				self.close();
			});
			$( "#importOptWindow" ).draggable({ cursor: "move"});
		};



	Radb.View.load = function(config)
	{
		this.temp 			 = config.template;
		this.meetings        = [];
		this.container       = config.el;
		this.selected        = null;
		this.selectedId 	 = null;
		this.subscriptions = Radb.PubSub.subscribe({
			'Radb.load_view.update' : [ "load/reloaded",
									 	"load/fetched",
									 	"load/filter",
									 	"track/match",
									 	"update/start",
										"update/end",
										"meeting/selected"]
		});
	};
		Radb.View.load.prototype.update = function(topic, data)
		{

			if (topic === 'update/start') {
				this.progressOn();
				return;
			}
			if (topic === 'track/match') {
				var meeting = this.meetings.meetings[this.selected];
				meeting.update({'trackid':data.data.id}).done(function(r) {
					Radb.effects.message("matched track!!");
				});
				return;
			}

			if (topic === 'load/filter') {
				this.render();
				return;
			}

			if (topic === 'meeting/selected') {
				this.selectedId = null;
				return;
			}

			if (topic != 'load/reloaded') {
				this.meetings = data;
				if (!this.selectedId && Radb.state.meeting) {
					this.selectById(Radb.state.meeting);
				}
			}

			this.render();
			if (topic === 'load/fetched' || topic === 'load/reloaded') {
				this.selectedElem = $('div.meeting-item.selectedLoad');
				if (this.selectedElem.length > 0) Radb.effects.scroll($('.meetingsList'), this.selectedElem);
			}
		};
		Radb.View.load.prototype.render = function(item)
		{
			localStorage['context'] = 'load';
			var self = this;

			$('#meeting').removeClass('selectedTab');
			$('#load').addClass('selectedTab');

			// item renders a single element (based on arrayid)
			if (item !== void 0) {
				var single = true;
				var meetings   = [self.meetings.meetings[item-1]];
				var container = $('.meeting-item:nth-child('+item+')');
			} else {
				var meetings = self.meetings.meetings;
			}

			if (meetings.length === 0 ) {
				self.container.empty().append('<div class="noScheduleData">No data</div>');
				return;
			}

			var filter = Radb.filter.filter.toLowerCase().split(',');


			var sortlabel = Object.keys(Radb.filter.meetingsort)[0];
			if (sortlabel === 'Loaded') {
				meetings = meetings.sort(Radb.by('data.updated', Radb.filter.meetingsort[sortlabel]));
			}
			if (sortlabel === 'Track') {
				meetings = meetings.sort(Radb.by('data.track', Radb.filter.meetingsort[sortlabel]));
			}
			if (sortlabel === 'Date') {
				meetings = meetings.sort(Radb.by('data.date', Radb.filter.meetingsort[sortlabel], null, Radb.by('data.track') ) );
			}
			var sortClass = (Radb.filter.meetingsort[sortlabel]) ? 'ASC': 'DESC';


			$('.meeting_types ul li').each(function(i,e) {
				var $e = $(e);
				$e.removeClass('selectedColour');
				if ($e.text() === Radb.filter.meetingtype) {
					$e.removeClass().addClass('selectedColour');
				}
			});
			$('.meeting_sort ul li').each(function(i,e) {
				var $e = $(e);
				$e.removeClass('selectedColour');
				if ($e.text() === sortlabel) {
					$e.removeClass().addClass(sortClass).addClass('selectedColour');
				}
			});


			var finalTmpl     = '';
			var meetingCount  = meetings.length;
			var visibleMeetings = 0;

			for (var i=0; i<meetingCount; i++) {

				var render = true;

				var meeting_status = meetings[i].data.status;
				// console.log(meeting_status);
				var status = {
					'race': 	{
						'status': '',
						'columns': null
					},
					'runner': 	{
						'status': '',
						'columns': null
					}
				};

				var load_status = 'load';
 				for (var j=0;j<meeting_status.length;j++) {
 					var type = meeting_status[j].type;

 					if(type != 'Warning'){
	 					status[meeting_status[j].type]['status']  = meeting_status[j].status;
	 					status[meeting_status[j].type]['columns'] = meeting_status[j].message;
 					}
 				}

 				if (status['runner']['status'] === 'loaded' && status['race']['status'] === 'loaded') {
 					load_status = 'loaded';
 				}
 				if ((status['runner']['status'] === 'update' || status['race']['status'] === 'update') ||
					((status['runner']['columns'] 			 || status['race']['columns']) &&
					 (status['runner']['status'] != 'load'   && status['race']['status'] != 'load')))
 				{
 					load_status = 'update';
 				}

 				if (status['runner']['status'] === '' || status['race']['status'] === '') {
 					load_status = 'error';
 				}

				var meetDate = moment(meetings[i].data.date);
				var day = +meetDate.format("d")

				if (Radb.filter.hiddendays.indexOf(day) > -1) continue;
				if (Radb.filter.meetingtype != null && Radb.filter.meetingtype !== meetings[i].data.type) continue;
				if (Radb.filter.loadStatus != null && Radb.filter.loadStatus !== load_status) continue;

				visibleMeetings++;
				if (Radb.filter.days.indexOf(day) == -1) Radb.filter.days.push(day);

 				var selected = false;

 				var meetingID = meetings[i].data.id;
 				if (meetingID === self.selectedId) {
 					self.selected = (item !== void 0) ? item-1 : i;
 					selected = true;
 				};

 				var track = meetings[i].data.track

 				var load_status_text = load_status;
 				var button_class = load_status;

 				if (!track) {
 					track = "<span class='textBold brightRed'>MISSING: " + meetings[i].data.code + "</span>";
 					load_status = ' notrack';
 					load_status_text = 'error';
 					button_class = 'brightRed error';
 				}

				if ((meetings[i].data.final_feed) && (load_status === 'update')) {
 					load_status_text = 'final';
 					button_class = 'final';
 				}

				var params = {
					"id"         	: meetingID,
					"track"      	: track,
					"meetingdate"	: meetDate.format("dddd D MMM"),
					"type"		 	: meetings[i].data.type,
					"selected"	 	: selected ? 'selectedLoad' : '',
					"load_status" 	: load_status,
					"load_status_text" : load_status_text,
					"button_class"	: button_class,
					"index" 	 	: (item !== void 0) ? item-1 : i,
				};

				if (filter[0] !== '') {
					render = self.filterList(meetings[i], filter);
				}

				if (render) finalTmpl += self.temp(params);
			}

			if (self.selected !== null) {
				var selectedMeeting = self.meetings.meetings[self.selected];

				selectedMeeting.fetch(null).done(function(r) {
					self.renderLoadInfo(r.data);
					Radb.PubSub.publish('load/selected', r.data);
				});
			}

			if (single != void 0) {
				var parent = container.prev();
				container.remove();
				parent.after(finalTmpl);
			} else {
				$('p.meetingCount').text(visibleMeetings + ' of ' + meetingCount + ' meetings');
				self.container.empty().append(finalTmpl);
			}

			self.renderDays();

			var theList = [];
			var options = ['Delete old'];
			for (var i=0;i<options.length; i++) {
				theList.push({
					'label' : options[i],
					'value' : options[i]
				});
			}
			$('#meetActionsDiv').empty();
			self.meetMenu = new Radb._listMenu( {
						'parent' 		: $('#meetActionsDiv'),
						'list' 			: theList,
						'defaultSelect' : {"label": 'Actions'},
						'name' 			: 'meetActions'
			}).init().render();

			self.events();
			return self;
		};
		Radb.View.load.prototype.renderDays = function(id)
		{
			var self = this;
			var days = $('.meeting_days ul li');
			days.each(function(index, elem) {
				var $elem = $(elem);
				$elem.removeClass('onBlue');
				$elem.removeClass('offBlue');
				if (Radb.filter.days.indexOf(index) > -1 && Radb.filter.hiddendays.indexOf(index) == -1) {
					$elem.addClass('onBlue');
				} else if (Radb.filter.hiddendays.indexOf(index) > -1) {
					$elem.addClass('offBlue');
				}
			});
		};
		Radb.View.load.prototype.filterList = function(meeting, filter)
		{
			var renderArray = [];
			for (var j=0;j<filter.length;j++) {
				filter[j] = filter[j].trim();
				if (filter[j] === '') continue;
				if (meeting.data.track) {
					var name = meeting.data.track.toLowerCase()
					if (name.indexOf(filter[j]) > -1 ) {
						return true;
					}
				}
			}
			return false;
		};
		Radb.View.load.prototype.selectById = function(id)
		{
			var meetings = this.meetings.meetings;
			for (var i=0;i< meetings.length; i++) {
				if (meetings[i].data.loaded === id) {
					this.selectedId = meetings[i].data.id;
					this.selected = i;
					return;
				}
			}
		};
		Radb.View.load.prototype.select = function(id)
		{
			var meetings = $('.meetingsList div.meeting-item');
			meetings.each(function(index, elem) {
				var $elem = $(elem);
				var elemid = $elem.data('id');
				if ($elem.hasClass('selectedLoad')) {
					$elem.removeClass('selectedLoad');
				}
				if (id === elemid) {
					this.selected = index;
					$elem.addClass('selectedLoad');
				}
			});
		};
		Radb.View.load.prototype.renderLoadInfo = function(data)
		{
			if (this.selected === null) return;
			var self = this;

			var runner_status = 'disabled';
			var race_status = 'disabled';

			if (data.status) {
				for (var j=0;j<data.status.length;j++) {
					if (data.status[j].type == 'runner') {
						runner_status = data.status[j].status;
					}
					if (data.status[j].type == 'race') {
						race_status = data.status[j].status;
					}
				}
			}

			var params = {
				'location'		: (data.track) ? data.track : 'MISSING TRACK. Code = ' + data.code,
				'type'			: data.type,
				'date'			: moment(data.date).format('dddd D MMM'),
				'runnercount'	: data.runnercount,
				'load_status'	: (runner_status === 'update' || race_status === 'update') ? 'update' : runner_status,
			}

			$('.load-info').html( template('load-info')(params) );

			$('.load-info').unbind().on('click', function(e) {
				var elem = $(e.target);

				if (elem.hasClass('switchView')) {
					Radb.PubSub.publish('update_state', {'meeting' : data.loaded} );
					Radb.render_meetings();
					Radb.meeting_col.fetch();
					return;
				}

				if (elem.hasClass('delete')) {
					var track = data.track || data.code;
					var message = "Delete " + track + " on " + moment(data.date).format('dddd D MMM') + "?";

					var meeting = self.meetings.meetings[self.selected];

					Radb.dialog.show(message, "Warning", meeting.delete, meeting);
					return;
				};

			});
		};
		Radb.View.load.prototype.progressOn = function()
		{
			$('.status.'+this.selected).addClass('fa-spin').removeClass('fa-circle-o').addClass('fa-circle-o-notch').addClass('blueHilight');
		};
		Radb.View.load.prototype.events = function()
		{
			var self = this;

			self.container.unbind().on('click', function(e) {
				var elem = $(e.target);
				var label = elem.text();
				var parent = elem.closest('div.meeting-item');
				var id = parent.data('arrayid');
				self.selected = id;

				var meeting = jQuery.extend(true, {}, self.meetings.meetings[id]);

				self.selectedId = parent.data('id');
				self.select(self.selectedId);

				var selectedMeeting = self.meetings.meetings[self.selected];

				selectedMeeting.fetch(null).done(function(r) {

					self.renderLoadInfo(r.data);

					Radb.PubSub.publish('load/selected', r.data);

					if (!meeting.data.track) {
						Radb.PubSub.publish('track/needed', meeting);
					}

					if (elem.hasClass('status')) {

						if (elem.hasClass('load')) {

							elem.attr('disabled', true);

							self.progressOn();

							meeting.load({'feed': 'race'}).done(function(r) {
								elem.attr('disabled', false);
								elem.removeClass('load');
							});

						} else if (!elem.hasClass('load') && !elem.hasClass('error')) {

							meeting.allUpdates = [];
							var statuses = {'race': {}, 'runner': {}}
							var runner_status = {};

							var race_status = {};
							var theStatus = 'load';
							var status = r.data.status;

			 				for (var j=0;j<status.length;j++) {
			 					if (status[j].type === 'Warning') continue;
		 						statuses[status[j].type]['header'] = (status[j].status == 'update') ? 'update' : 'loaded';
	 							var msgs = status[j].message ? status[j].message.split(':') : [];
	 							for (var msg in msgs) {
									statuses[status[j].type][msgs[msg]] = 'update';
									meeting.allUpdates.push(msgs[msg]);
	 							}
			 				}

							var list = [
										{'item': {
									  		'label': 'All',
									  		'value': 'All',
									    	'status': ''
									    	}
									  	},


									  	{'header': {
									  		'label': 'Race updates',
									    	'status': ''}
									  	},
										{'item': {
									  		'label': 'Race headers',
									  		'value': 'Raceheaders',
									    	'status': statuses['race']['Raceheader']}
									  	},
										{'item': {
									  		'label': 'Race times',
									  		'value': 'Racetimes',
									    	'status': statuses['race']['Racetimes']}
									  	},
										{'item': {
									  		'label': 'Race names',
									  		'value': 'Racenames',
									    	'status': statuses['race']['Racenames']}
									  	},
										{'item': {
									  		'label': 'Stewards',
									  		'value': 'Stewards',
									    	'status': statuses['race']['Stewards']}
									  	},
										{'item': {
									  		'label': 'Gear Changes',
									  		'value': 'Gearchanges',
									    	'status': statuses['race']['Gearchanges']}
									  	},
										{'item': {
									  		'label': 'Distance',
									  		'value': 'Distance',
									    	'status': statuses['race']['Distance']}
									  	},
										{'item': {
									  		'label': 'Tips',
									  		'value': 'Tips',
									    	'status': statuses['race']['Tips']}
									  	},


										{'header': {
											'label': 'Runner updates',
										    'status': ''}
										},
										{'item': {
									  		'label': 'Runners',
									  		'value': 'Runners',
									    	'status': statuses['runner']['Runner']}
									  	},
										{'item': {
									  		'label': 'Jockeys',
									  		'value': 'Jockeys',
									    	'status': statuses['runner']['Jockey']}
									  	},
										{'item': {
									  		'label': 'Market',
									  		'value': 'Market',
									    	'status': statuses['runner']['Market']}
									  	},
										{'item': {
									  		'label': 'Ratings',
									  		'value': 'Ratings',
									    	'status': statuses['runner']['Rating']}
									  	},
										{'item': {
									  		'label': 'Silks',
									  		'value': 'Silks',
									    	'status': statuses['runner']['Silks']}
									  	},
										{'item': {
									  		'label': 'Formbank',
									  		'value': 'Formbank',
									    	'status': statuses['runner']['Formbank']}
									  	},
										{'item': {
									  		'label': 'Comment',
									  		'value': 'Comment',
									    	'status': statuses['runner']['Comment']}
									  	},
										];

							var loadlist = new loadList($('body'), list, meeting);
							var modal = loadlist.render();
						}
					}


				});
			});


			$('.meeting_sort').unbind().on('click', function(e) {
				var elem = $(e.target);
				if (elem.is('li')) {
					var sorted = [];
					var meetings = self.meetings.meetings;
					var label = elem.text();
					var sortlabel = label.toLowerCase() + 'sort';
					var tabs = elem.siblings();
					tabs.each(function(i,e) {
						var $e = $(e);
						$e.removeClass('selectedColour');
					});
						$('.meeting_sort')
					if (Object.keys(Radb.filter.meetingsort)[0] == label) {
						var val = Radb.filter.meetingsort[label];
						Radb.filter.meetingsort[label] = !val;
					} else {
						Radb.filter.meetingsort = {};
						Radb.filter.meetingsort[label] = false;
					}

					var orderClass = (Radb.filter.meetingsort[label]) ? 'ASC': 'DESC';
					elem.removeClass().addClass(orderClass).addClass('selectedColour');
					self.render();
				}
			});

			$('#meetingfilter').unbind().on({

				input: function(e) {
					Radb.PubSub.publish('filter/updated', {'filter': $(e.target).val() });
				},
				search: function(e) {
					if (!this.value) {
						$(this).animate({
							'width': '0'
						});
					}
				}
			});

			$('.meeting_days').unbind().on('click', function(e) {
				var elem = $(e.target);
				var id = elem.data('id');
				if (elem.hasClass('onBlue')) {
					Radb.filter.hiddendays.push(id);
				} else if (elem.hasClass('offBlue')) {
					var el = Radb.filter.hiddendays.indexOf(id);
					Radb.filter.hiddendays.splice(el, 1);
				}
				self.render();
			});

			$('.meeting_types').unbind().on('click', function(e) {
				var elem = $(e.target);
				if (elem.is('li')) {
					var data = {};
					data.meetingtype = (elem.hasClass('selectedColour')) ?	null : elem.data('type');
					Radb.PubSub.publish('filter/updated', data);
				}
			});

			$('.meeting_load_filter').unbind().on('click', function(e) {
				var elem = $(e.target);
				if (elem.is('li')) {
					var data = {};
					if (elem.hasClass('update')) {
						data.loadStatus = 'update';
					}
					if (elem.hasClass('load')) {
						data.loadStatus = 'load';
					}
					if (elem.hasClass('loaded')) {
						data.loadStatus = null
					}

					Radb.PubSub.publish('filter/updated', data);
				}
			});
		};



	Radb.View.load_history = function(config)
	{
		this.temp 			 = config.template;
		this.meeting         = null;
		this.container       = config.el;
		this.subscriptions = Radb.PubSub.subscribe({
			'Radb.load_history.update' : [  "load/selected"]
		});
	};
		Radb.View.load_history.prototype.update = function(topic, data)
		{
			this.meeting = data;
			this.render();
		}
		Radb.View.load_history.prototype.render = function()
		{
			$(this.container).empty();
			var temp = this.temp
			var finalTmpl = '';
			if (this.meeting.history) {
				for(var i=0;i<this.meeting.history.length; i++) {
					var params = {
						"time"  : moment( this.meeting.history[i].time ).format("ddd D/M HH:mm"),
						"user"  : this.meeting.history[i].firstname + ' ' + this.meeting.history[i].lastname,
						"type"	: this.meeting.history[i].type,
						"message": this.meeting.history[i].message
					};
					finalTmpl = temp(params);
					$(this.container).append(finalTmpl);
				}
			}
		};



	Radb.View.load_source = function(config)
	{
		this.temp 			 = config.template;
		this.meeting         = null;
		this.container       = config.el;
		this.subscriptions   = Radb.PubSub.subscribe({
			'Radb.load_source.update' : [  "load/selected"]
		});
	};
		Radb.View.load_source.prototype.update = function(topic, data)
		{
			console.log(topic, data);
			this.meeting = data;
			this.render();
			this.events();
		}
		Radb.View.load_source.prototype.render = function()
		{
			$(this.container).empty();
			var temp = this.temp;

			if (this.meeting.source) {
				for(var i=0;i<this.meeting.source.length; i++) {
					var time = moment( this.meeting.source[i].time );
					var feed = this.meeting.source[i].feed;
					var feed = feed.replace(/(PMFRM)/, '<span class="brightGreen">$1</span>');
					var feed = feed.replace(/(PMFLB)/, '<span class="onBlue">$1</span>');
					var feed = feed.replace(/(PMSTW)/, '<span class="orange">$1</span>');
					var feed = feed.replace(/(PMBRF)/, '<span class="brightRed">$1</span>');
					var feed = feed.replace(/(PMTRK)/, '<span class="yellow">$1</span>');

					var params = {
						"time"  : time.format("ddd D/M HH:mm"),
						"duration": Radb.getTimeDuration(time, moment()),
						"feed": feed,
						"id"  : i
					};
					var finalTmpl = temp(params);
					$(this.container).append(finalTmpl);
				}
			}
		};
		Radb.View.load_source.prototype.events = function()
		{
			var self = this;
			function htmlPara(string)
			{
				return string.replace(/^(.)/mg, '<p>$1')
							 .replace(/\n/g, '</p>')
							 .replace(/¡/g, '</p>');
			}

			$(this.container).on('click', function(e) {
				var elem = $(e.target);
				var ul = elem.closest('ul');
				var source = ul.data('arrayid');
				var feed = self.meeting.source[source];
				var file = feed.feed.substring(0,5);
				var feedsrc = feed.feedsrc;

				var feedsrc2 = false;
				for (var i=source-1; i>-1; i--) {
					if (self.meeting.source[i].feed.lastIndexOf(file) > -1) {
						feedsrc2 = self.meeting.source[i].feedsrc;
						break;
					}
				}
				if (!feedsrc2) return;

				var finString = "";
				var oArr = feedsrc.split(/\n/g);
				var nArr = feedsrc2.split(/\n/g);

				for (var j=0;j<oArr.length;j++) {
					if (j > nArr.length -1) continue;
					finString += diffString( nArr[j].replace(/!/g, ' ! '), oArr[j].replace(/!/g, ' ! ') );
				}
				finString = finString.replace(/ ! /g, '&emsp;');
 				Radb.PubSub.publish('source/selected', htmlPara( finString ));

			});
		}


	Radb.View.load_feed = function(config)
	{
		this.temp 			 = config.template;
		this.meeting         = null;
		this.container       = config.el;
		this.subscriptions   = Radb.PubSub.subscribe({
			'Radb.load_feed.update' : [  "load/selected"]
		});
	};
		Radb.View.load_feed.prototype.update = function(topic, data)
		{
			this.meeting = data;
			this.render();
		}
		Radb.View.load_feed.prototype.render = function()
		{
			var self = this;
			if (this.meeting.loaded) {
				$(this.container).html(this.temp);

				$('.load-box').children('textarea')[0].value = '';

				var holder = $('.load-box').children('textarea')[0];
				holder.ondrop = function (e) {
				  e.preventDefault();

				  var file = e.dataTransfer.files[0];

				  if (file.name.split(" - ")[1] == 'Gear Changes') {
 					  var feedTrack = file.name.split(" - ")[0];
					  var pageTrack = self.meeting.track;

					  var pageDate = moment(self.meeting.date).format("ddd DD MMM, YYYY");
					  var feedDate = file.name.split(" - ")[2].split(".")[0];
					  
					  if ((feedTrack !== pageTrack) || (feedDate !== pageDate)) {
	  					var message = "Tracks do not match: loading " + feedTrack + " (" + feedDate + ") Gear Changes for " + pageTrack + " (" + pageDate + ")!";
						Radb.confirmation.show("Warning", message);
					  }

				  };

				  var splitCount = file.name.split(" - ").length;
				  var filename = file.name.split(" - ")[splitCount - 2];
				  if (filename == 'TAB Fixed Odds') {
 					  $('.load-box').find("[data-feed='tab_fixed']").removeClass('hidden');
 					  $('.load-box').find("[data-feed='lad_fixed']").addClass('hidden');
 					  $('.load-box').find("[data-feed='ubet_fixed']").addClass('hidden');
				  };

				  if (filename == 'UBET Fixed Odds') {
				  	  $('.load-box').find("[data-feed='tab_fixed']").addClass('hidden');
				  	  $('.load-box').find("[data-feed='lad_fixed']").addClass('hidden');
 					  $('.load-box').find("[data-feed='ubet_fixed']").removeClass('hidden');
				  };
  				
  				  if (filename == 'LADBROKE Fixed Odds') {
  				  	  $('.load-box').find("[data-feed='ubet_fixed']").addClass('hidden');
  				  	  $('.load-box').find("[data-feed='tab_fixed']").addClass('hidden');
   					  $('.load-box').find("[data-feed='lad_fixed']").removeClass('hidden');
  				  };

				  var reader = new FileReader();
				  reader.onload = function (event) {
				    holder.value = event.target.result;
				  };
				  reader.readAsText(file);

				  return false;
				};

				$('.feed_save').unbind().on('click', function(elem) {
					var text 		= $('.load-box').children('textarea')[0].value;
					var feed 		= $(this).data('feed');

					var save 		= {'meeting': self.meeting.loaded, 'text': text, 'feed': feed};

					if (text) Radb.PubSub.publish('load/import', save);
				});

				$('.feed_clear').unbind().on('click', function(e) {
					$('.load-box').children('textarea')[0].value = '';
				});
			}
		};


	Radb.View.load_diff = function(config)
	{
		this.temp 			 = config.template;
		this.feed 	         = null;
		this.container       = config.el;
		this.subscriptions   = Radb.PubSub.subscribe({
			'Radb.source_feed.update' : [  "source/selected"]
		});
	};
		Radb.View.load_diff.prototype.update = function(topic, data)
		{
			this.feed = data;
			this.render();
		}
		Radb.View.load_diff.prototype.render = function()
		{
			if (this.feed) {
				$(this.container).html(this.temp);

				$('#source').html(this.feed);
			}
		};



	Radb.View.track = function(config)
	{

		this.trackTemp		 = config.templates.tracks;
		this.pageTemp 	     = config.templates.trackPage;
		this.track           = [];
		this.container       = config.containers.main;
		this.container_tracks= config.containers.tracks;
		this.selected_array  = null;
		this.selectedElem 	 = null;
		this.selectedResource= null;
		this.filter          = '';
		Radb.PubSub.subscribe({
			'Radb.track_view.update' : [ "track/deleted",
										 "track/reloaded",
									 	 "track/selectbyid",
									 	 "track/added",
									 	 "track/needed"]
		});
	};
		Radb.View.track.prototype.update = function(topic, data)
		{
			console.log(topic, data, this.selected_array);
			if (topic == 'track/deleted') {
				this.selected_array = null;
				this.clear();
			}
			if (topic === 'track/selectbyid') {
				this.selectById(data).visual_select();
				if (this.selected_array) {
					this.renderDetails();
				}
				return;
			}
			if (topic === 'track/added') {
				this.selected_array = null;
				this.selectedResource = data;
				return;
			}
			if (topic === 'track/needed') {
				this.render();
				return;
			}

			this.track = data;

			if (!this.selected_array && this.selectedResource) {
				this.selectById(this.selectedResource);
			}

			this.refresh();
		};
		Radb.View.track.prototype.render = function()
		{
			var self = this;
			var Container = $(self.container);
			Container.empty().append(self.pageTemp);
			this.filterElem = $('#trackFilter');
			this.filterElem.val(this.filter);
			this.refresh();
			this.events();
		};
		Radb.View.track.prototype.refresh = function()
		{
			console.log('ACTION: refreshing');
			var self = this;

			var Container_tracks = $(self.container_tracks);

			var filter = this.filterElem.val().toLowerCase().split(',');

			var track = self.track.track;

			if (!track || track.length === 0 ) {
				return;
			}
			this.selectList = [];
			var finalTmpl   = '';
			var trackCount  = track.length;


			for (var i=0; i<trackCount; i++) {
				var render = true;
				var selected = '';
				if (i === self.selected_array) {
					selected = 'selected';
					self.selectedResource = track[i].data.id;
				}
				var params = {
					"name"     : track[i].data.name,
					"type"	   : track[i].data.type,
					"index"    : i,
				};
				params['theClass'] = selected;

				if (filter[0] !== '') {
					render = self.filterList(track[i], filter);
				}

				if (render) finalTmpl += this.trackTemp(params);
			}

			Container_tracks.empty().append(finalTmpl);

			if (self.selected_array) {
				self.visual_select();
				self.renderDetails();
			} else if (self.selectedResource) {
				self.selectById(self.selectedResource).visual_select();
				self.renderDetails();
			}

			return this;
		};
		Radb.View.track.prototype.filterList = function(track, filter)
		{
			var renderArray = [];
			for (var j=0;j<filter.length;j++) {
				filter[j] = filter[j].trim();
				if (filter[j] === '') continue;
				var name = track.data.name.toLowerCase()
				if (name.indexOf(filter[j]) > -1 ) {
					return true;
				}
			}
			return false;
		};
		Radb.View.track.prototype.clear = function()
		{
			$('#TrackID').val('');
			$('#TrackName').val('');
			$('#TrackCode').val('');
			$('#TrackRISA').val('');
			$('#TrackType').val('');
			$('.timezone').val('');
			$('.state').val('');
		};
		Radb.View.track.prototype.renderDetails = function()
		{

			var track = this.track.track[this.selected_array];

			if (track) {
				$('#TrackID').val(track.data.id);
				$('#TrackName').val(track.data.name);
				$('#TrackCode').val(track.data.code);
				$('#TrackRISA').val(track.data.risa);
				$('#TrackType').val(track.data.type);
				$('.timezone').val(track.data.timezone);
				$('.state').val(track.data.state);

				if (typeof this.tzMenu == 'object') {
					this.tzMenu.remove();
				}

				this.tzMenu = new Radb.listMenu( {
							'parent' 		: $('#timezoneSelect'),
							'defaultSelect' : {"label": track.data.timezone},
							'name' 			: 'timezone',
							'callback'		: track.updater(),
				}).init(Radb.timezones).render();



				if (typeof this.statemenu == 'object') {
					this.statemenu.remove();
				}
				var theList = [];

				this.statemenu = new Radb.listMenu( {
							'parent' 		: $('#stateSelect'),
							'defaultSelect' : {"label": track.data.state},
							'name' 			: 'track_state',
							'callback'		: track.updater(),
				}).init(Radb.states).render();

			} else {
				this.clear();
			}
		};
		Radb.View.track.prototype.selectById = function(id)
		{
			var tracks = this.track.track;

			if (tracks && tracks.length > 0) {

				for (var i=0;i< tracks.length; i++) {

					if (tracks[i].data.id === id) {

						this.selected_array = i;

						break;
					}
				}
			}
			return this;
		};
		Radb.View.track.prototype.visual_select = function()
		{
			$('.list_item').removeClass('selected');

			this.selectedElem = $('#trackList .list_item[data-arrayid="' + this.selected_array + '"]');

			this.selectedElem.addClass('selected');

			if (this.selectedElem.length > 0) Radb.effects.scroll($('#trackList'), this.selectedElem);

			return this;
		}
		Radb.View.track.prototype.events = function()
		{
			var self = this;

			$('#trackList').unbind().on('click', function(e) {

				var elem = $(e.target);
				var id = elem.data('arrayid');

				self.selected_array = id;
				self.visual_select(id);
				self.selectedResource = self.track.track[id].data.id;
				self.renderDetails();
			});
			$('#addTrack').unbind().click(function(e) {
				e.stopPropagation();
				self.track.addTrack()
					.done(function(r) {
						console.log('PUBLISHING: track/added');
						Radb.PubSub.publish('track/added', r.data.id);
					});
			});

			$('#matchTrack').unbind().click(function(e) {
				e.stopPropagation();
				Radb.PubSub.publish('track/match', self.track.track[self.selected_array]);
			});

			$('#deleteTrack').unbind().click(function(e) {
				e.stopPropagation();
				var message = "Delete " + self.track.track[self.selected_array].data.name + "?";
				Radb.dialog.show(message, "Warning", self.track.track[self.selected_array].delete, self.track.track[self.selected_array]);
			});

			$('#TrackInfo input').unbind().on('change', function(e) {
				e.preventDefault();
				e.stopPropagation();

				var elem = $(e.target);
				var field = elem.attr('name');
				var track = self.track.track[self.selected_array],
					data  = {};
				data[field] = elem.val();
				if (field === 'name') {
					self.filterElem.val(data[field]);
					self.selected_array = null;
				}
				track.update(data).fail(function(r) {
					elem.val(track.data[field]);
					Radb.effects.error(elem);
				});
			});

			$('#trackFilter').unbind().on({
				input: function(e) {
					e.preventDefault();
					e.stopPropagation();
					// self.filter = $(e.target).val();
					self.refresh();
				},
				click: function(e) {
					e.stopPropagation();
				}
			});

		};



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


})();

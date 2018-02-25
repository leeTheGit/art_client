(function()
{
	'use strict';



	Radb.View.meetings = function(config)
	{
		this.temp 			 = config.template;;
		this.meetings        = [];
		this.container       = config.el;
		this.selected        = null;
		this.selectedElem    = null; //jquery element
		this.selectedId 	 = null;

		this.filter 		 = '';
		this.meetingtype  	 = null;
		this.meetingsort     = {
			"Date"          : false
		};
		this.days 			 = [];
		this.loadStatus      = null;

		this.subscriptions = Radb.PubSub.subscribe({
			'Radb.meeting_view.listener' : [ "meetings/filter",
									   	     "state_changed"]
		});
		this.listeners = {
			"meetings" : function(data) {
				this.meetings = data.meetings;
				this.render();
			},
			"meeting": function(data) {
				this.selectedId = data.meeting;
				Radb.PubSub.publish('meeting/selected', {'id': data.meeting});
			},
			"meetingtype": function(data) {
				this.render();
			},
			"hold" : function(data) {
				this.toggleHoldLight(data.hold);
			},
			"sync" : function(data) {
				this.toggleSyncLight(data.sync);
			},
			"filter" : function(data) {
				this.filter = data.filter;
				this.render();
			}

		};
	};
		Radb.View.meetings.prototype.listener = function(topic, data)
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
		Radb.View.meetings.prototype.render = function()
		{
			console.time('date');

			this.chromeEvents();

			localStorage['context'] = 'meetings';
			var self = this;
			self.container.empty();

			var meetings = self.meetings.meetings;
			var filter = Radb.filter.filter.toLowerCase().split(',');

			Radb.filter.days = [];
			if (meetings.length === 0 ) {
				self.container.empty().append('<div class="noScheduleData">No Meetings</div>');
				return;
			}

			$('#dayname').text(Radb.state.date.format('dddd'));

			var finalTmpl     = '';
			var meetingCount  = meetings.length;
			var visibleMeetings = 0;

			var sortlabel = Object.keys(Radb.filter.meetingsort)[0];

			if (sortlabel === 'Starttime') {
												// path, 		  reverse, 								primer, then, dataTransform
				meetings = meetings.sort(Radb.by('data.starttime', Radb.filter.meetingsort[sortlabel], null, null, function(d){return d.replace(/:/g, '') }));
			}
			if (sortlabel === 'Track') {
				meetings = meetings.sort(Radb.by('data.venue', Radb.filter.meetingsort[sortlabel]));
			}
			if (sortlabel === 'Date') {
				// meetings = meetings.sort(Radb.by('data.date', Radb.filter.meetingsort[sortlabel]))

				meetings = meetings.sort(Radb.by('data.date', Radb.filter.meetingsort[sortlabel], null, Radb.by('data.venue')));
			}
			var sortClass = (Radb.filter.meetingsort[sortlabel]) ? 'ASC': 'DESC';

			$('.meeting_sort ul li').each(function(i,e) {
				var $e = $(e);
				$e.removeClass('selectedColour');
				if ($e.text() === sortlabel) {
					$e.removeClass().addClass(sortClass).addClass('selectedColour');
				}
			});

			$('#meeting').addClass('selectedTab');
			$('#load').removeClass('selectedTab');

			$('.meeting_types ul li').each(function(i,e) {
				var $e = $(e);
				$e.removeClass('selectedColour');
				if ($e.text() === Radb.filter.meetingtype) {
					$e.removeClass().addClass('selectedColour');
				}
			});

			for (var i=0; i<meetingCount; i++) {

				var meetingDate = moment(meetings[i].data.date);
				var day = +meetingDate.format("d");
				var selected = '';

				if (Radb.filter.hiddendays.indexOf(day) > -1) continue;
				if (Radb.filter.meetingtype != null && Radb.filter.meetingtype != meetings[i].data.type) continue;

				if (filter[0] !== '') {
					if (!self.filterList(meetings[i], filter)) continue;
				}

				visibleMeetings++;
				if (Radb.filter.days.indexOf(day) == -1) {
					Radb.filter.days.push(day);
				}

				if (self.selectedId === meetings[i].data.id) {
					selected = 'selectedLoad';
					self.selected = i;
				}


				var resultCount = "";
				var progPercent = 0;
				var trackmismatch = '';

				if (meetings[i].data.results && meetings[i].data.results.length > 0) {
					resultCount = meetings[i].data.results[0].divs + ' of ' + meetings[i].data.racecount;
					progPercent = self.progPercent(meetings[i].data.results[0].divs, meetings[i].data.racecount);
					var tm = meetings[i].data.trackmatch;

					for(var q = 0; q<tm.length;q++ ) {
						if (tm[q].trackmatched === false) {
							trackmismatch = 'mismatch';
							break;
						}
						// var clientT = tm[q].clienttrackname.replace(/ (D|N|T)$/, '');

						// if (clientT.toLowerCase().indexOf(meetings[i].data.venue.toLowerCase()) < 0 &&
						// 	meetings[i].data.venue.toLowerCase().indexOf(clientT.toLowerCase()) < 0) {
						// 	trackmismatch = 'mismatch';
						// }
					}
				}



				var params = {
					"venue"    : meetings[i].data.venue,
					"raceDate" : meetingDate.format("dddd D MMM"),
					"oldrace"  : '',
					"selected" : selected,
					"type"     :  meetings[i].data.type,
					"sync"     : (meetings[i].data.web_enabled != false) ? "brightGreen" : '',
					"colours"  : (meetings[i].data.require_colours == true) ? "ordered" : '',
					"hold"     : (meetings[i].data.disabled != true) ? "ready" : "hold",
					"index"    : i,
					"id"       : meetings[i].data.id,
					"resultCount" : resultCount,
					"progPercent" : progPercent,
					"trackmismatch": trackmismatch
				};

				finalTmpl += this.temp(params);
			}


			$('p.meetingCount').text(visibleMeetings + ' of ' + meetingCount + ' meetings');
			self.container.append(finalTmpl);

			if (self.selectedId) this.scrolllist();

			this.renderDays();

			this.contentEvents();

			return this;
		};
		Radb.View.meetings.prototype.progPercent = function(one, other)
		{
			var one = parseInt(one);
			var other = parseInt(other);
			return (100 / other) * one ;
		};

		Radb.View.meetings.prototype.scrolllist = function()
		{
			var arrayid = this.selectInArrayById(this.selectedId);
			this.select(arrayid);
			this.selectedElem = $('div.meeting-item.selectedLoad');
			if (this.selectedElem.length > 0) Radb.effects.scroll($('.meetingsList'), this.selectedElem);
		};
		Radb.View.meetings.prototype.filterList = function(meeting, filter)
		{
			var renderArray = [];
			for (var j=0;j<filter.length;j++) {
				filter[j] = filter[j].trim();
				if (filter[j] === '') continue;
				var name = meeting.data.venue.toLowerCase()
				if (name.indexOf(filter[j]) > -1 ) {
					return true;
				}
			}
			return false;
		};
		Radb.View.meetings.prototype.selectInArrayById = function(id)
		{
			if (this.meetings.length === 0) return;
			var meetings = this.meetings.meetings;
			for (var i=0;i< meetings.length; i++) {
				if (meetings[i].data.id === id) {
					return i;
				}
			}
		};
		Radb.View.meetings.prototype.toggleHoldLight = function(toggle)
		{
			var arrayid = this.selectInArrayById(Radb.state.meeting);
			var elem = this.select(arrayid);
			if (toggle) {
				elem.find('i.meeting-hold-light').addClass('fa-lock');
			} else {
				elem.find('i.meeting-hold-light').removeClass('fa-lock');
			}
		};
		Radb.View.meetings.prototype.toggleSyncLight = function(toggle)
		{
			console.log('sync light');
			var arrayid = this.selectInArrayById(Radb.state.meeting);
			var elem = this.select(arrayid);
			if (toggle) {
				elem.find('i.meeting-sync-light').addClass('fa-circle');
			} else {
				elem.find('i.meeting-sync-light').removeClass('fa-circle');
			}
		};
		Radb.View.meetings.prototype.select = function(id)
		{
			var meetings = $('.meetingsList div.meeting-item');
			var selected_elem = [];
			meetings.each(function(index, elem) {
				var $elem = $(elem);
				$elem.removeClass('selectedLoad');
				if (id === $elem.data('arrayid')) {
					selected_elem = $elem;
					$elem.addClass('selectedLoad');
				}
			});
			return selected_elem;
		};
		Radb.View.meetings.prototype.renderDays = function(id)
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
		Radb.View.meetings.prototype.chromeEvents = function(meetingdata)
		{
			var self = this;

			var dPicker = $( "#dTime" );
			dPicker.val(Radb.state.date.format('YYYY-MM-DD'));
			dPicker.datepicker({
			  	// changeMonth: true,
			  	changeYear: true,
			  	showOn:"button",
			  	buttonImage: "/images/icons/calendar.png",
			  	buttonImageOnly: true,
			  	dateFormat: "yy-mm-dd",
				 	beforeShow: function (textbox, instance) {
	            	instance.dpDiv.css({
	                    marginTop: (-textbox.offsetHeight) + 'px',
	                    marginLeft: textbox.offsetWidth + 20 + 'px'
	            	});
				}
			});

			$('#schedDateStart label').unbind().on("click", function(e) {
				var $elem 		= $(e.target);
				var $dateField 	= $elem.siblings('input');
				var theDate = moment($dateField.val());
				if($elem.hasClass('add')) {
					var newDate = 'Next'
					$dateField.val( theDate.add('d', 1).format("YYYY-MM-DD") );
				} else if ($elem.hasClass('minus')) {
					$dateField.val( theDate.subtract('d', 1).format("YYYY-MM-DD") );
					var newDate = 'Previous'
				}
				Radb.state.listener('update_state', {'date_rel': newDate, 'daterange': 'date'});
			});

			$("#dTime").change(function(e) {
				var $elem 		= $(e.target);
				var theDate 	= $elem.val();
				Radb.state.listener('update_state', {'date_abs': theDate, 'daterange': 'date'});
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

			$('#filtericon').unbind().on('click', function(e) {
				e.stopPropagation();
				var box = $(this).siblings('input');
				box.animate({
								'width': '220px',
							});
				box.focus();
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
					(elem.hasClass('selectedColour')) ?	data.meetingtype = null : data.meetingtype = elem.data('type');
					Radb.PubSub.publish('filter/updated', data);
				}
			});

			$('.meeting_dates').unbind().on('click', function(e) {
				var elem = $(e.target);
				if (elem.is('li')) {
					Radb.state.listner('state/change', {'date_rel':elem.text(), 'daterange': 'date'});
				}
			});


		};
		Radb.View.meetings.prototype.contentEvents = function()
		{
			var self = this;

			self.container.unbind().on('click', function(e) {
				var elem = $(e.target);
				var parent = elem.closest('div.meeting-item');
				var id = parent.data('arrayid');
				if (id === undefined) return;
				self.selected = id;
				self.selectedId = parent.data('id');
				self.selectedElem = parent;
				self.select(id);
				self.scrolllist();
				Radb.state.race = null;
				Radb.state.runner = null;
				Radb.url.query = [];
				Radb.PubSub.publish('state_changed', {'clickEvent' : 'meeting'} );
				Radb.PubSub.publish('update_state', {'meeting' : self.selectedId} );
				// Radb.state.listener('state/change', {'meeting': self.selectedId});

				// var mi = Radb.PubSub.publish('resource/selected', Radb.state);
				// if (mi) {
				// 	mi.done(function() {
				// 		console.log('publishing load_from_url');
				// 		Radb.PubSub.publish('load_from_url');
				// 	});
				// }
			});
		};
		Radb.View.meetings.prototype.refreshSelected = function()
		{
			var meeting = this.meetings.meetings[this.selected];
			meeting.query = ['portal', true, 'publication', Radb.state.publication, 'tipster', Radb.state.tipster];
			meeting.fetch();
			meeting.query = ['data', 'all'];
		};


	Radb.View.meeting = Radb.View.create(
	{
		"temp" 			: template('meeting_top'),
		"container" 	: '.meeting-info',
		"listeners"     : {
			"currentmeeting" : function(data) {
				if (data.currentmeeting == null) {
					this.clear();
					return;
				}
				this.meeting = data.currentmeeting;
				this.render();
			},
			"resultsState" : function(data) {
				this.resultsView = data.resultsState;
				this.render();
			},
			"divs" : function(data) {
				Radb.PubSub.publish('state_changed', {'meeting': this.meeting.data.id})
			},
		}
	});
		Radb.View.meeting.subscriptions = Radb.PubSub.subscribe({
			'Radb.View.meeting.listener' : ["state_changed", "meeting_updated"]
		});

		Radb.View.meeting.render = function(id)
		{
			var self = this;

			var meetingdata = self.meeting.data;
			var tabcode = '', ubetcode = '', nzcode = '', tabclass = 'empty', ubetclass = 'empty', nzclass = 'empty', abbrev = '', abbrevClass = 'empty abbrev_empty';

			for (var i = 0; i < meetingdata.betting.length; i++) {
				var agency = meetingdata.betting[i].agency;

				if (agency == 'ubet') {
					ubetcode = meetingdata.betting[i]['betcode'];
					ubetclass = '';
				}
				if (agency == 'tab') {
					tabcode  = meetingdata.betting[i]['betcode'];
					tabclass = '';
				}
				if (agency == 'nz') {
					nzcode  = meetingdata.betting[i]['betcode'];
					nzclass = '';
				}
			}

			if (meetingdata.track_abbrev) {
				abbrev = meetingdata.track_abbrev;
				abbrevClass = '';
			}

			var params = {
				'hold' 	 	  : meetingdata.disabled ? 'hold_on' : '',
				'location' 	  : meetingdata.venue,
				'type' 		  : meetingdata.type,
				'date' 		  : moment(meetingdata.date).format('dddd D MMM'),
				'timezone'	  : meetingdata.timezone,
				'runnercount' : meetingdata.runnercount,
				'rating' 	  : meetingdata.rating,
				'weather' 	  : meetingdata.weather,
				'rail' 		  : meetingdata.rail,
				'tabcode'     : tabcode,
				'ubetcode'    : ubetcode,
				'nzcode'	  : nzcode,
				'tabclass'    : tabclass,
				'ubetclass'   : ubetclass,
				'nzclass'	  : nzclass,
				'abbrev'      : abbrev,
				'abbrclass'   : abbrevClass
			};

			var html = this.template( params );

			$(this.container).empty().html( html );


			if (meetingdata.results) {
				this.renderMultiples(meetingdata);
			}

			self.webButtonToggle(meetingdata);

			self.silksButtonToggle(meetingdata);

			// self.timeZoneMenu(meetingdata);

			self.events();
		};
		Radb.View.meeting.renderMultiples = function(meetingdata)
		{
			var self = this;
			var divs = JSON.parse(JSON.stringify(meetingdata.results.divs));

			if (!divs.hasOwnProperty(self.resultsView)) {
				for (var state in divs) {
					self.resultsView = state;
					break;
				}
			}

			divs = divs[self.resultsView];

			if (undefined === divs) return;

			if (undefined === divs.aapmultiples) divs.aapmultiples = '';


			divs.multiplesStr = divs.multiplesStr.replace(/ ?&lt;/g, '<')
												 .replace(/&gt; ?/g, '>')
												 .replace(/\r\n/g, '<br/>')
												 .replace(/ <br\/>/g, '<br/>')
												 .replace(/<p>/g, '')
												 .replace(/<\/p>/g, '<br/>')
												 .replace(/(NSW|VIC) TAB /g, '')
												 .replace(/<br\/>$/, '')
												 .trim();

			divs.aapmultiples = divs.aapmultiples.replace(/&lt;/g, '<')
												 .replace(/&gt;/g, '>')
												 .replace(/   /g, '')
												 .replace('AAP RESULTS</p>', '')
												 .replace(/<\/p><p>/g, '<br/>')
												 .replace(/<p>/g, '')
												 .replace(/<\/p>/g, '<br/>')
												 .replace(/(NSW|VIC) TAB /g, '')
												 .replace(/<br\/>$/, '')
												 .trim();



			if (divs.aapmultiples.trim() == divs.multiplesStr.trim()) {
				divs.aap = '';



			} else if (divs.aapmultiples != '') {
				divs.aapmultiples = diffString( divs.aapmultiples, divs.multiplesStr);
			}

			$('#multiplestext').html(divs.multiplesStr);
			$('#aapmultiplestext').html(divs.aapmultiples);
		};
		Radb.View.meeting.webButtonToggle = function(meetingdata)
		{
			if (meetingdata.web_enabled) {
				$("button.sync").addClass('sync_on').data('sync', true);
			} else {
				$("button.sync").removeClass('sync_on').data('sync', false);
			}
		};
		Radb.View.meeting.silksButtonToggle = function(meetingdata)
		{
			if (meetingdata.require_colours) {
				$("button.colours").addClass('silks_on').data('colours', true);
			} else {
				$("button.colours").removeClass('silks_on').data('colours', false);
			}
		};
		// Radb.View.meeting.timeZoneMenu = function(meetingdata)
		// {
		// 	var self = this;

		// 	if (typeof self.tzMenu == 'object') {
		// 		self.tzMenu.remove();
		// 	}

		// 	self.tzMenu = new Radb.listMenu( {
		// 				'parent' 		: $('#timezoneSelect'),
		// 				'defaultSelect' : {"label": meetingdata.timezone},
		// 				'name' 			: 'timezone',
		// 				'callback'		: self.meeting.updater(),
		// 	}).init(Radb.timezones).render();

		// };
		Radb.View.meeting.events = function()
		{
			var self = this;
			$('.switchView').unbind().on('click', function(e) {
				Radb.render_load();
				Radb.load_col.fetch();
				return;
			});

			$('button.meeting_track').unbind().on('click', function(e) {
				var elem = $(e.target);

				window.location.assign(window.location.origin + '/tracks/' + self.meeting.data.trackid);
			});

			$('button.hold').unbind().on('click', function(e) {
				var meeting = self.meeting;
				var elem = $(e.target);
				meeting.update({'disabled':!meeting.data.disabled}).done(function(r) {
					console.log(r);
					if(meeting.data.disabled === true) {
						elem.addClass('hold_on');
						// self.selectedElem.children().find('.meeting.track').removeClass('hold');
					} else {
						elem.removeClass('hold_on');
						// self.selectedElem.children().find('.meeting.track').addClass('hold');
					}
					Radb.PubSub.publish('state_changed', {'hold':meeting.data.disabled});
				});
				return;
			});


			$('button.delete').unbind().on('click', function(e) {
				var meeting = self.meeting;
				var message = "Delete " + meeting.data.venue + " on " + meeting.data.date + "?";
				Radb.dialog.show(message, "Warning", meeting.delete, meeting);
				return;
			});

			$('button.colours').unbind().on('click', function(e) {
				var elem = $(e.target);
				var meeting = self.meeting;

				var message = '<div id="races">';

				var dialog = Object.create(Radb.dialog);
				dialog.state = {'races' : []};
				dialog.events = function() {
					$('#races').on("click", function(e) {
						var elem = $(e.target);
						var racenum = parseInt( elem.val() );
						var indx = dialog.state.races.indexOf(racenum);
						dialog.state.races.splice(indx, 1);
					});
				}

				for(var r=0;r<parseInt(meeting.data.racecount);r++) {
					var race = r + 1;
					dialog.state.races.push(race);
					message += '<li><input name="race" type="checkbox" checked value="'+race+'">Race ' + race + '</li>';
				}
				message += '</div>'

				var order = dialog.show(message, "Order colours for " + meeting.data.venue, meeting.ordercolours, meeting)
								  .done(function(r) {
		  							elem.addClass('silks_on');
								  })
				dialog.events();

				return;
			});

			$('button.sync').unbind().on('click', function(e) {
				var elem = $(e.target);
				var meeting = self.meeting;
				var sync = elem.data('sync');

				var obj = sync ? {'sync': false} : {'sync': true};

				meeting.update(obj).done(function(r) {

					if(r.data == true) {
						if ( elem.data('sync') === false ) {
							elem.addClass('sync_on');
							sync = true;
						}
						else {
							elem.removeClass('sync_on');
							sync = false;
						}

						elem.data('sync', sync);

						Radb.PubSub.publish('state_changed', {'sync':sync});
					};

					Radb.PubSub.publish('state_changed', {'hold':meeting.data.disabled});
				});

			});

			$('#tababbrev').unbind().on('click', function(e) {
				var elem = $(e.target);
				self.meeting.tab_link().done(function(r) {
					if (r.data != false) {
						elem.siblings('input').val(r.data);
						elem.parent('div').removeClass('empty');
					}
				});
				return;
			});

			$('.tab_abbrev').unbind().on("change", function(e) {
				e.preventDefault();
				var data  = {};
				var elem  = $(e.target);
				var field = elem.attr('name');
				data[field] =  elem.val();
				if (data[field] == '') {
					elem.parent('div').addClass('empty');
				} else {
					elem.parent('div').removeClass('empty');
				}
				var meeting = self.meeting;
				meeting.update(data)
				.fail(function(r) {
					elem.val(self.meeting.data[field]);
					Radb.effects.error(elem);
				});
			});

			$('.betcode').unbind().on("change", function(e) {
				e.preventDefault();
				var data  = {};
				var elem  = $(e.target);
				var field = elem.attr('name');
				var subfield = elem.data('subname');
				data[field] = subfield + ':' + elem.val().trim();

				self.meeting.update(data)
				.done(function(r) {
					if (r.data === true) {
						if (elem.val() == '') {
							elem.parent('div').addClass('empty');
						} else {
							elem.parent('div').removeClass('empty');
						}

						// for(var i = self.meeting.data.betting.length -1; i > -1; i--) {
						// 	var bet = self.meeting.data.betting[i];
						// 	var agency = bet.agency;
						//
						// 	if ( agency.indexOf(subfield) > -1 ) {
						// 		exists = true;
						// 		if (elem.val() === '') {
						// 			self.meeting.data.betting.splice(i, 1);
						// 			continue;
						// 		}
						// 		bet.code = elem.val();
						// 	}
						// }

						// if (!exists && elem.val() !== '') {
						// 	var newAgency = (subfield === 'tab') ? 'vic_tab' : 'qld_ubet';
						// 	var newData = {}
						// 	newData = {
						// 		"agency": newAgency,
						// 		"code": elem.val(),
						// 		"multiples": null
						// 	}
						// 	self.meeting.data.betting.push(newData);
						// }
					}
				})
				.fail(function(r) {
					elem.val(self.meeting.data[field]);
					Radb.effects.error(elem);
				});
			});

			$('.track-details').unbind().on("change", function(e) {
				e.preventDefault();
				var data  = {};
				var elem  = $(e.target);
				var field = elem.attr('name');
				data[field] = elem.val();

				self.meeting.update(data).fail(function(r) {
					elem.val(self.meeting.data[field]);
					Radb.effects.error(elem);
				});
			});


			$('.multiplesRes').unbind().on("click", function(e) {
				e.preventDefault();
				var elem = $(e.target);

				var state = Radb.state.resultsState;
				var mults = self.meeting.data.results.divs[state].multiples;
				Radb.multEditor.show(mults, state, function(data) {
					console.log(data);
					self.meeting.update({divs: JSON.stringify(data.divs), state: data.state}).done(function(r) {
						Radb.PubSub.publish('meeting_updated', {'divs': true});
						Radb.effects.saved(elem);
					})
				});
			});

		};


	Radb.multEditor = {
		data : {},
		show : function(data, state, callback) {
			var self = this;

			self.data = data;
			self.state = state;

			console.log(self.data);

			var dfd = $.Deferred();

			$('body').append(template('multDivEditor')());

			var dividends = {
				'vic': [
					{key: 'Quaddie', name: 'QUADDIE', runners: 4},
					{key: 'DailyDouble', name: 'DOUBLE', runners: 2},
					{key: 'Earlyquaddie', name: 'EARLY QUADDIE', runners: 4},
					{key: 'Big6', name: 'BIG6', runners: 6},
				],
				'nsw': [
					{key: 'Quaddie', name: 'QUADDIE', runners: 4},
					{key: 'DailyDouble', name: 'DOUBLE', runners: 2},
					{key: 'Earlyquaddie', name: 'EARLY QUADDIE', runners: 4},
					{key: 'Big6', name: 'BIG6', runners: 6},
				],
				'act': [
					{key: 'Quaddie', name: 'QUADDIE', runners: 4},
					{key: 'DailyDouble', name: 'DOUBLE', runners: 2},
					{key: 'Earlyquaddie', name: 'EARLY QUADDIE', runners: 4},
					{key: 'Big6', name: 'BIG6', runners: 6},
				],
				'qld': [
					{key: 'Daily_Double', name: 'DOUBLE', runners: 2},
					{key: 'Extra_Double', name: 'EXTRA DOUBLE', runners: 2},
					{key: 'Treble', name: 'TREBLE', runners: 3},
					{key: 'Quadrella', name: 'QUADDIE', runners: 4},
					{key: 'Trio_Double', name: 'T2', runners: 6},
				],
			}[state]

			var divTypes = '';

			if (!self.data) {
				self.data = {};
			}

			dividends.map(function(div) {
				var key = div.key;

				var dividend = self.data[key];
				var runners = '';
				var prices = '';
				var racenumbers = '';

				console.log(dividend);

				if (dividend && dividend.racenumbers) {
					racenumbers = dividend.racenumbers.join();
				}

				if (dividend && dividend.names.length) {
					for (var i=0; i < dividend.names.length; i++) {
						runners += template('multRunner')({
							index: i,
							number: dividend.numbers[i],
							name: dividend.names[i],
						})
					}
				} else {
					for (var i=0; i < div.runners; i++) {
						runners += template('multRunner')({
							index: i,
							number: '',
							name: '',
						})
					}
				}

				if (dividend && dividend.price.length) {
					for (var i=0; i < dividend.price.length; i++) {
						prices += template('multPrice')({
							index: i,
							price: dividend.price[i],
						})
					};
				} else {
					prices += template('multPrice')({
						index: 0,
						price: '',
					})
				}

				divTypes += template('multDiv')({
					key: key,
					name: div.name,
					racenumbers: racenumbers,
					prices: prices,
					runners: runners,
				})
			})

			$('#multDivList').append(divTypes);

			$('#save_button').on("click", function() {
				callback({
					divs: self.data,
					state: self.state,
				});
				self.closeWindow();
			});

			$('#cancel_button').on("click", function() {
				self.closeWindow();
			});

			$('.multField').change(function(e) {
				var elem = $(e.target);
				var field = elem.data("field");
				var index = elem.closest('li').data("index");
				var key = elem.closest('li.multipleDiv').data('key');

				var payload = elem.val();

				if (payload != '') {
					if (!self.data[key]) {
						self.data[key] = {};
					}

					if (self.data[key]['name'] == "") {
						self.data[key]['name'] = dividends.filter(function(div) {
							return div.key == key;
						})[0].name;

						console.log(self.data[key]['name']);
					}

					if (!self.data[key][field]) {
						self.data[key][field] = [];
					}

					self.data[key][field][index] = payload;
				}
			})

			$('.raceNumField').change(function(e) {
				var elem = $(e.target);
				var key = elem.closest('li.multipleDiv').data('key');

				if (!self.data[key]['racenumbers']) {
					self.data[key]['racenumbers'] = [];
				}

				self.data[key]['racenumbers'] = elem.val().split(',');
			});

			return dfd.promise();
		},
		closeWindow : function() {
			$('#modal_divs').closest('#wrapper').remove();
		},
	};

})();

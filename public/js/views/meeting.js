(function()
{
	'use strict';



	Acme.View.meetings = function(config)
	{
		this.temp 			 = config.template;;
		this.plants          = [];
		this.container       = config.el;
		this.selected        = null;
		this.selectedElem    = null; //jquery element
		this.selectedId 	 = null;

		this.filter 		 = '';
		this.sortBy     	 = {
			"Date" : false
		};
		this.days 			 = [];

		this.subscriptions = Acme.PubSub.subscribe({
			'Acme.meeting_view.listener' : [ "state_changed"]
		});

		this.listeners = {
			"meetings" : function(data) {
				this.meetings = data.meetings;
				this.render();
			},
			"meeting": function(data) {
				this.selectedId = data.meeting;
				Acme.PubSub.publish('meeting/selected', {'id': data.meeting});
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
		// Acme.View.meetings.prototype.listener = function(topic, data)
		// {
		// 	var keys = Object.keys(data);
		// 	for (var i = 0; i<keys.length; i++) {
		// 		for (var listener in this.listeners) {
		// 			if ( listener === keys[i] ) {
		// 				this.listeners[listener].call(this, data);
		// 				break;
		// 			}
		// 		}
		// 	}
		// };
		Acme.View.meetings.prototype.render = function()
		{
			var self = this;
			self.container.empty();


			Acme.filter.days = [];
			if (meetings.length === 0 ) {
				self.container.empty().append('<div class="noScheduleData">No Plants</div>');
				return;
			}


			if (sortlabel === 'Starttime') {
												// path, 		  reverse, 								primer, then, dataTransform
				meetings = meetings.sort(Acme.by('data.starttime', Acme.filter.meetingsort[sortlabel], null, null, function(d){return d.replace(/:/g, '') }));
			}
			if (sortlabel === 'Track') {
				meetings = meetings.sort(Acme.by('data.venue', Acme.filter.meetingsort[sortlabel]));
			}
			if (sortlabel === 'Date') {
				// meetings = meetings.sort(Acme.by('data.date', Acme.filter.meetingsort[sortlabel]))

				meetings = meetings.sort(Acme.by('data.date', Acme.filter.meetingsort[sortlabel], null, Acme.by('data.venue')));
			}
			var sortClass = (Acme.filter.meetingsort[sortlabel]) ? 'ASC': 'DESC';

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
				if ($e.text() === Acme.filter.meetingtype) {
					$e.removeClass().addClass('selectedColour');
				}
			});

			for (var i=0; i<meetingCount; i++) {

				var meetingDate = moment(meetings[i].data.date);
				var day = +meetingDate.format("d");
				var selected = '';

				if (Acme.filter.hiddendays.indexOf(day) > -1) continue;
				if (Acme.filter.meetingtype != null && Acme.filter.meetingtype != meetings[i].data.type) continue;

				if (filter[0] !== '') {
					if (!self.filterList(meetings[i], filter)) continue;
				}

				visibleMeetings++;
				if (Acme.filter.days.indexOf(day) == -1) {
					Acme.filter.days.push(day);
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
		Acme.View.meetings.prototype.progPercent = function(one, other)
		{
			var one = parseInt(one);
			var other = parseInt(other);
			return (100 / other) * one ;
		};

		Acme.View.meetings.prototype.scrolllist = function()
		{
			var arrayid = this.selectInArrayById(this.selectedId);
			this.select(arrayid);
			this.selectedElem = $('div.meeting-item.selectedLoad');
			if (this.selectedElem.length > 0) Acme.effects.scroll($('.meetingsList'), this.selectedElem);
		};
		Acme.View.meetings.prototype.filterList = function(meeting, filter)
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
		Acme.View.meetings.prototype.selectInArrayById = function(id)
		{
			if (this.meetings.length === 0) return;
			var meetings = this.meetings.meetings;
			for (var i=0;i< meetings.length; i++) {
				if (meetings[i].data.id === id) {
					return i;
				}
			}
		};
		Acme.View.meetings.prototype.toggleHoldLight = function(toggle)
		{
			var arrayid = this.selectInArrayById(Acme.state.meeting);
			var elem = this.select(arrayid);
			if (toggle) {
				elem.find('i.meeting-hold-light').addClass('fa-lock');
			} else {
				elem.find('i.meeting-hold-light').removeClass('fa-lock');
			}
		};
		Acme.View.meetings.prototype.toggleSyncLight = function(toggle)
		{
			console.log('sync light');
			var arrayid = this.selectInArrayById(Acme.state.meeting);
			var elem = this.select(arrayid);
			if (toggle) {
				elem.find('i.meeting-sync-light').addClass('fa-circle');
			} else {
				elem.find('i.meeting-sync-light').removeClass('fa-circle');
			}
		};
		Acme.View.meetings.prototype.select = function(id)
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
		Acme.View.meetings.prototype.renderDays = function(id)
		{
			var self = this;
			var days = $('.meeting_days ul li');
			days.each(function(index, elem) {
				var $elem = $(elem);
				$elem.removeClass('onBlue');
				$elem.removeClass('offBlue');
				if (Acme.filter.days.indexOf(index) > -1 && Acme.filter.hiddendays.indexOf(index) == -1) {
					$elem.addClass('onBlue');
				} else if (Acme.filter.hiddendays.indexOf(index) > -1) {
					$elem.addClass('offBlue');
				}
			});
		};



	Acme.View.meeting = Acme.View.create(
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
				Acme.PubSub.publish('state_changed', {'meeting': this.meeting.data.id})
			},
		}
	});
		Acme.View.meeting.subscriptions = Acme.PubSub.subscribe({
			'Acme.View.meeting.listener' : ["state_changed"]
		});

		Acme.View.meeting.render = function(id)
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
		Acme.View.meeting.renderMultiples = function(meetingdata)
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
		Acme.View.meeting.webButtonToggle = function(meetingdata)
		{
			if (meetingdata.web_enabled) {
				$("button.sync").addClass('sync_on').data('sync', true);
			} else {
				$("button.sync").removeClass('sync_on').data('sync', false);
			}
		};
		Acme.View.meeting.silksButtonToggle = function(meetingdata)
		{
			if (meetingdata.require_colours) {
				$("button.colours").addClass('silks_on').data('colours', true);
			} else {
				$("button.colours").removeClass('silks_on').data('colours', false);
			}
		};
		// Acme.View.meeting.timeZoneMenu = function(meetingdata)
		// {
		// 	var self = this;

		// 	if (typeof self.tzMenu == 'object') {
		// 		self.tzMenu.remove();
		// 	}

		// 	self.tzMenu = new Acme.listMenu( {
		// 				'parent' 		: $('#timezoneSelect'),
		// 				'defaultSelect' : {"label": meetingdata.timezone},
		// 				'name' 			: 'timezone',
		// 				'callback'		: self.meeting.updater(),
		// 	}).init(Acme.timezones).render();

		// };
		Acme.View.meeting.events = function()
		{
			var self = this;
			$('.switchView').unbind().on('click', function(e) {
				Acme.render_load();
				Acme.load_col.fetch();
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
					Acme.PubSub.publish('state_changed', {'hold':meeting.data.disabled});
				});
				return;
			});


			$('button.delete').unbind().on('click', function(e) {
				var meeting = self.meeting;
				var message = "Delete " + meeting.data.venue + " on " + meeting.data.date + "?";
				Acme.dialog.show(message, "Warning", meeting.delete, meeting);
				return;
			});

			$('button.colours').unbind().on('click', function(e) {
				var elem = $(e.target);
				var meeting = self.meeting;

				var message = '<div id="races">';

				var dialog = Object.create(Acme.dialog);
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

						Acme.PubSub.publish('state_changed', {'sync':sync});
					};

					Acme.PubSub.publish('state_changed', {'hold':meeting.data.disabled});
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
					Acme.effects.error(elem);
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
					Acme.effects.error(elem);
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
					Acme.effects.error(elem);
				});
			});


			$('.multiplesRes').unbind().on("click", function(e) {
				e.preventDefault();
				var elem = $(e.target);

				var state = Acme.state.resultsState;
				var mults = self.meeting.data.results.divs[state].multiples;
				Acme.multEditor.show(mults, state, function(data) {
					console.log(data);
					self.meeting.update({divs: JSON.stringify(data.divs), state: data.state}).done(function(r) {
						Acme.PubSub.publish('meeting_updated', {'divs': true});
						Acme.effects.saved(elem);
					})
				});
			});

		};


	Acme.multEditor = {
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

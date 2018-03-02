(function()
{
	'use strict';


	Acme.View.race = function(config)
	{
		this.temp 			 	= config.template || null;
		this.data 			 	= {};
		this.selected 		 	= null;
		this.containertmpl   	= config.el;
		this.container       	= null;
		this.view   		 	= 'raceData';
		this.resultsView        = 'act';
		this.showSelectedOnly 	= false;
		this.race_discrepancies = [];
		this.subscriptions = Acme.PubSub.subscribe({
			'Acme.race_list_view.listener' : [ "state_changed", "race/select", "divs_updated" ]
		});
		this.listeners = {
			"clickEvent" : function(data) {
				if (data.clickEvent == 'meeting') {
					this.soften();
				}
			},
			"group" : function(data) {
				this.soften();
			},
			"meeting" : function(data) {
				this.selected = null;
			},
			"races" : function(data) {
				this.data = data.races;
				return this.render();
			},
			"resultsState" : function(data) {
				this.resultsView = data.resultsState;
				this.render();
			},
			"showSelectedOnly" : function(data) {
				this.showSelectedOnly = data.showSelectedOnly;
				this.render();
			},
			"currentmeeting" : function(data) {
				if (data.currentmeeting == null) {
					this.clear();
					return;
				}
			},
			"discrepancy" : function(data) {
				if (this.race_discrepancies.sort() !== data.discrepancy.sort()) {
					this.race_discrepancies = data.discrepancy;
					if(this.data.length > 0) this.render();
				}
			},
		}
	};
		Acme.View.race.prototype.listener = function(topic, data)
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
		Acme.View.race.prototype.clear = function()
		{
			this.container.empty();
		};
		Acme.View.race.prototype.soften = function()
		{
			this.container.css('opacity', '.4');
		};
		Acme.View.race.prototype.brighten = function()
		{
			this.container.css('opacity', '1');
		};
		Acme.View.race.prototype.render = function()
		{
			/**
			* 	Main rendering function that hands off duty
			*   to separate function relating to the current view
			*/

			var self = this;
			self.container = $(this.containertmpl);

			self.brighten();
			var raceCount  = this.data.races.length;

			if (raceCount === 0 ) return;
			$('#racetabs').show();

			var racetablist = $('#raceTabList');

			racetablist.find('li').removeClass('runnertabselect');

			racetablist.find('#' + Acme.state.raceView).addClass('runnertabselect');

 			$('#publish_button').css('display', 'none');

			var finalTmpl = "";

			var headerParams = {};

			if (Acme.state.raceView === 'raceMultiples') {
				headerParams = {
					supplier: '',
				};
			}

			$('#raceHeader').empty().append(template(Acme.state.raceView + 'Header')(headerParams));
			var finalTmpl  = '';

			if (Acme.state.race) {
				self.selectById(Acme.state.race);
			}

			if (Acme.state.raceView === 'raceResults') {
				var divs = [];
				if (this.data.races[0].data.hasOwnProperty('results')) {
					divs = this.data.races[0].data.results.divs;
				}
				Acme.PubSub.publish('raceView/results', {'raceDivs': divs});
			} else {
				Acme.PubSub.publish('raceView/results', {'raceDivs': false});
			}


			for (var i=0; i<this.data.races.length; i++) {

				if ((this.showSelectedOnly && (Acme.state.race === this.data.races[i].data.id))
				|| !this.showSelectedOnly) {

					var temp = template(Acme.state.raceView);
					var params = this.renderRaceData(Acme.state.raceView, this.data.races[i]);
					if (undefined === params) continue;

					params['index'] = i;
					params['selected'] = (Acme.state.race === this.data.races[i].data.id) ? 'raceSelect' : '';
					params['disabled'] = this.data.races[i].data.enabled ? '' : 'scratched';
					finalTmpl += temp(params);
				}
			}

			self.container.empty().append(finalTmpl);

			if (Acme.state.raceView === 'raceMultiples') {
				for (var i=0; i < this.data.races.length; i++) {

					$("div#raceMultiplesPlaceholder" + this.data.races[i].data.id).empty();

					for (var m=0; m < this.data.races[i].data.multiples.length; m++) {
						var multiple = this.data.races[i].data.multiples[m];

						if (multiple.agency === Acme.state.group) {

							$("div#raceMultiplesPlaceholder" + this.data.races[i].data.id).append(template("raceMultipleButton")({
								id: multiple.id,
								name: multiple.multiple,
								enabled: multiple.enabled ? 'multi_on' : '',
								race: this.data.races[i].data.id,
							}));
						}
					}
				}
			}

			if ($('button.multi_on').length > 0) {
				$('#generate_multiples').addClass('clear_multiples');
				$('#generate_multiples').html('Clear All');				
			};

			this.events();
			return true;
		};
		Acme.View.race.prototype.selectById = function(id)
		{
			/**
			* 	Iterates through stored races comparing race id.
			*   Sets the current selection to array index of race
			*/
			if (this.data.races.length > 0) {
				var races = this.data.races;
				for (var i=0;i< races.length; i++) {

					if (races[i].data.id === id) {
						this.selectedId = races[i].data.id;
						this.selected = i;
						return;
					}
				}
			}
		};
		Acme.View.race.prototype.select = function(elem)
		{
			/**
			* 	Purely visible selection for ui.
			*/
			$('.race_data').removeClass('raceSelect');
			elem.addClass('raceSelect');
		};
		Acme.View.race.prototype.events = function()
		{
			/**
			* 	Events loaded upon each render.
			*/

			var self = this;
			$('.raceList').unbind();


			$('li[data-inc]').unbind().on('click',function(e) {
				var elem = $(e.target);
				var data = elem.data('inc');

				if (data === -1 && self.selected === 0) return;
				if (data === 1 && self.selected === self.data.races.length-1) return;
				if (data === 0) {
					self.selected = null;

					Acme.PubSub.publish('update_state', {'race': null});
					return;
				}
				self.selected += (self.selected == null && data === 1) ? 0 :
					( self.selected == null && data === - 1) ? self.data.races.length-1 : data;


				Acme.PubSub.publish('update_state', {'race': self.data.races[self.selected].data.id})
				.done(function(r) {
					self.render();
				});
			});

			$('#publish_button').unbind().on('click', function(e) {
				var elem = $(e.target);
				var mismatch = elem.data('typeMatch');
				if (mismatch) {
					Acme.effects.message("The meeting type does not match");
					return;
				}
				var message = "These are the same tracks?";
				var that = self.data.races[0];
				var divID = that.data.results.divs[Acme.state.resultsState].id;
				Acme.dialog.show(message, "Warning", that.matchDivs, that, divID)
				.done(function(r) {
					console.log(r);
					// self.data.fetch();
				});
			});

			$('#generate_multiples').unbind().on('click', function(e) {

				var elem = $(e.target);

				if (elem.hasClass('approve_on')) {
					elem.removeClass('approve_on').addClass('disabled').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
					$('button.multi_pending').removeClass('multi_pending').trigger('click');
				} else if (elem.hasClass('clear_multiples')) {
					elem.removeClass('clear_multiples').addClass('disabled').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
					$('button.multi_on').trigger('click');					
				} else {
					elem.html("Approve");
					elem.addClass('approve_on');

					// THIS IS TERRIBLE CODE AND I AM ASHAMED
					var allRaceMultis = ['ce167f20-ecee-4403-b931-0e05fdc3c4b1', '3019689c-3e1a-4b92-917d-6645b4a5aac9', '8cdb55ce-aeec-4472-8f5b-c704c801da0f', '4cda1782-b929-4c49-8786-bb61548ff8c5'];

					var TABQuad = '166d9bb6-3b39-496c-8689-466f5f8a6f78';
					var TABEQuad = '33eea52f-42e7-4bde-abb4-dfb6b0d2015e';
					var TABDbl = '5dcd6fcd-9b96-42d5-b3eb-88afd79307b6';

					var UBETQuad = '8e5b0039-316a-429b-85db-6accf9a5ab89';
					var UBETDbl = '8b51d3e7-ddba-4325-9835-064a0e26f446';
					var UBETTbl = '013fd486-46f7-4bf2-a087-535e75481be0';
					var UBETEDbl = '37247507-1c90-4e2e-b180-e5a2f9fde63e';

					var NZDbl = 'b6014a8c-397b-4c54-aaf9-671839ce4b12';
					var NZPL6 = '387b8856-32ae-4b6e-8e44-099622825c59';
					var NZQAD = '164cec8e-bc49-40fd-9ed7-fb1a6bcee663';
					var NZTRB = 'c213ac3c-e1c4-4f25-8d4b-22c4111647b7';

					Acme.server.request('meeting/' + Acme.state.meeting)
					.done(function(r) {

						for (var i=0; i < allRaceMultis.length; i++) {
							$("button[data-multiple='" + allRaceMultis[i] +"']").addClass('multi_pending');
						}

						var numberOfRaces = self.data.races.length;

						switch (r.data.type) {
						case 'RA':
							$("button[data-multiple='" + TABDbl + "'][data-race='" + self.data.races[numberOfRaces - 1].data.id + "']").addClass('multi_pending');
							$("button[data-multiple='" + TABDbl + "'][data-race='" + self.data.races[numberOfRaces - 3].data.id + "']").addClass('multi_pending');

							$("button[data-multiple='" + UBETDbl + "'][data-race='" + self.data.races[numberOfRaces - 1].data.id + "']").addClass('multi_pending');
							$("button[data-multiple='" + UBETDbl + "'][data-race='" + self.data.races[numberOfRaces - 2].data.id + "']").addClass('multi_pending');

							for (var r=(numberOfRaces - 1); r >= (numberOfRaces - 4); r--) {
								$("button[data-multiple='" + TABQuad +"'][data-race='" + self.data.races[r].data.id + "']").addClass('multi_pending');
								$("button[data-multiple='" + UBETQuad +"'][data-race='" + self.data.races[r].data.id + "']").addClass('multi_pending');
							}

							if ((r - 3) < 0) { r = r - (r - 3)};
							for (var eq=r; eq >= (r - 3); eq--) {
								$("button[data-multiple='" + TABEQuad +"'][data-race='" + self.data.races[eq].data.id + "']").addClass('multi_pending');
							}

							// if ((r - 2) < 0) { r = r - (r - 2)};
							for (var ed=(numberOfRaces - 5); ed >= (numberOfRaces - 6); ed--) {
								$("button[data-multiple='" + UBETEDbl +"'][data-race='" + self.data.races[ed].data.id + "']").addClass('multi_pending');
							}

							for (var r=(numberOfRaces - 1); r >= (numberOfRaces - 3); r--) {
								$("button[data-multiple='" + UBETTbl +"'][data-race='" + self.data.races[r].data.id + "']").addClass('multi_pending');
							}

							// NZ BLOCK OF DOOM
							var togglePending = function(multiple, blocks) {
								blocks.forEach(function(races) {
									races.forEach(function(r) {
										$("button[data-multiple='" + multiple + "'][data-race='" + self.data.races[r].data.id + "']").addClass('multi_pending');									
									})
								})
							}

							var maxRaces = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

							togglePending(NZPL6, [ maxRaces.slice(0, numberOfRaces).slice(-6).map(function(x) { return x - 1;}) ]);

							switch(numberOfRaces) {
								case 7:
									togglePending(NZDbl, [ [1, 2], [3, 4], [5, 6] ]);
									togglePending(NZTRB, [ [0, 1, 2], [4, 5, 6] ]);
									togglePending(NZQAD, [ [0, 1, 2, 3], [3, 4, 5, 6 ] ]);
								break;
								case 8:
									togglePending(NZDbl, [ [0, 1], [2, 3], [4, 5], [6, 7] ]);
									togglePending(NZTRB, [ [1, 2, 3], [5, 6, 7] ]);
									togglePending(NZQAD, [ [0, 1, 2, 3], [4, 5, 6, 7 ] ]);
								break;
								case 9:
									togglePending(NZDbl, [ [1, 2], [3, 4], [5, 6], [7, 8] ]);
									togglePending(NZTRB, [ [0, 1, 2], [3, 4, 5], [6, 7, 8] ]);
									togglePending(NZQAD, [ [1, 2, 3, 4], [5, 6, 7, 8 ] ]);
								break;
								case 10:
									togglePending(NZDbl, [ [0, 1], [2, 3], [4, 5], [6, 7], [8, 9] ]);
									togglePending(NZTRB, [ [0, 1, 2], [3, 4, 5], [7, 8, 9] ]);
									togglePending(NZQAD, [ [1, 2, 3, 4], [6, 7, 8, 9 ] ]);

								break;
								case 11:
									togglePending(NZDbl, [ [1, 2], [3, 4], [5, 6], [7, 8], [9, 10] ]);
									togglePending(NZTRB, [ [0, 1, 2], [4, 5, 6], [8, 9, 10] ]);
									togglePending(NZQAD, [ [1, 2, 3, 4], [7, 8, 9, 10 ] ]);

								break;
								case 12:
									togglePending(NZDbl, [ [0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11] ]);
									togglePending(NZTRB, [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11] ]);
									togglePending(NZQAD, [ [1, 2, 3, 4], [8, 9, 10, 11 ] ]);

								break;
								case 13:
								break;
								case 14:
								break;
								case 15:
							break;
							}



							break;
						case 'HA':
							var lastLeg = (numberOfRaces >= 8) ? 8 : numberOfRaces;
							for (var r=(lastLeg - 1); r >= (lastLeg - 4); r--) {
								$("button[data-multiple='" + TABQuad +"'][data-race='" + self.data.races[r].data.id + "']").addClass('multi_pending');
							}

							$("button[data-multiple='" + TABDbl +"'][data-race='" + self.data.races[lastLeg - 2].data.id + "']").addClass('multi_pending');
							$("button[data-multiple='" + TABDbl +"'][data-race='" + self.data.races[lastLeg - 4].data.id + "']").addClass('multi_pending');
							break;
						case 'GR':
							var lastLeg = (numberOfRaces >= 8) ? 8 : numberOfRaces;
							for (var r=(lastLeg - 1); r >= (lastLeg - 4); r--) {
								$("button[data-multiple='" + TABQuad +"'][data-race='" + self.data.races[r].data.id + "']").addClass('multi_pending');
							}

							$("button[data-multiple='" + TABDbl +"'][data-race='" + self.data.races[lastLeg - 1].data.id + "']").addClass('multi_pending');
							$("button[data-multiple='" + TABDbl +"'][data-race='" + self.data.races[lastLeg - 3].data.id + "']").addClass('multi_pending');
						}
					});
				}
			});

			$('.raceList').on('click', function(e) {
				var elem = $(e.target);
				var id = elem.closest('li[data-arrayid]').data('arrayid');

				if (elem.hasClass('race_disable')) {
					var race = self.data.races[id];
					var enabled = (race.data.enabled !== true);

					race.update({'enabled': enabled}).done(function(r) {
						Acme.PubSub.publish('state_changed', {'race_updated': self.data.races[id].data.id});
					});
					return;
				}

				if (elem.closest('li').hasClass('race_divs')) {

					var selectedState = Acme.state.resultsState;

					var stateDivs = {};

					if (self.data.races[id].data.results.divs[selectedState]) {
						stateDivs = self.data.races[id].data.results.divs[selectedState].divs;
					}

					Acme.divEditor.show(stateDivs, function(divs) {
						self.data.races[id].update({'state': selectedState, 'divs': JSON.stringify(divs), 'racenumber': self.data.races[id].data.number}).done(function(r) {
							Acme.PubSub.publish('meeting_updated', {'divs': true});
							Acme.effects.saved(elem);
						});
					});

				}

				if (elem.hasClass('raceMultipleButton')) {
					if (elem.hasClass('multi_pending')) {
						elem.removeClass('multi_pending');
					} else {
						if ($('button.approve_on').length > 0) {
							elem.addClass('multi_pending');
						} else {
							var multiple = elem.data('multiple');
							var race = self.data.races[id];

							race.update({'multiple': multiple}).done(function(r) {
								if (r.data.ok) {
									elem.addClass('multi_on');
								}

								if (r.data.deleted) {
									elem.removeClass('multi_on');
								}

								Acme.PubSub.publish('state_changed', {'race_updated': self.data.races[id].data.id });
							});
						}
					}
				}

				if (!elem.is('li') && (!elem.is('input') && !elem.is('textarea') )) return;

				var ul = elem.closest('.race_data');
				self.select(ul);
				self.selected = id;
				Acme.PubSub.publish('update_state', {'race': self.data.races[id].data.id });
			});

			$('.minimize').unbind().on('click', function(e) {
				e.preventDefault();
				var elem = $(e.target);
				if (elem.hasClass('fa-caret-down')) {
					elem.removeClass('fa-caret-down').addClass('fa-caret-right');
				} else {
					elem.removeClass('fa-caret-right').addClass('fa-caret-down');
				}
				self.showSelectedOnly = !self.showSelectedOnly;

				Acme.PubSub.publish('race/select', self);
			});

			$('.raceList').on("change", function(e) {
				e.preventDefault();

				var data  = {};
				var elem  = $(e.target);

				var id 	  = elem.closest('li[data-arrayid]').data('arrayid');
				var field = elem.attr('name');
				data[field] = elem.val();

				if (data['racetime'] != undefined)
				{
					var racetime = self.data.races[id].data.racetime;

					var newTime = moment(elem.val(), "HH.mm" );
					var changeTime = moment(racetime).hour(newTime.get('hour')).minute(newTime.get('minute'));
					data['racetime'] = changeTime.format('YYYY-MM-DD HH:mm');
				}

				self.data.races[id].update(data).done(function(r) {
					Acme.effects.saved(elem);
				}).fail(function(r) {
					elem.val(self.data.races[id].data[field]);
					Acme.effects.error(elem);
				});
			});

			$('#raceTabList').unbind().on('click', function(e) {
				var elem = $(e.target);
				if (!elem.is('li')) {
					return;
				}
				Acme.state.raceView = elem.attr('id');
				// Acme.state.raceView = elem.attr('id');
				self.render();
			});

		};
		Acme.View.race.prototype.renderRaceData = function(tab, race)
		{
			var raceTime = moment(race.data.racetime);
			var self = this;
			var discrepancy = '';
			if (this.race_discrepancies.indexOf(race.data.number) > -1) {
				discrepancy = 'discrepancy';
			}

			if (tab == 'raceData') {
				var params = {
					"id": 			race.data.id,
					"number": 		race.data.number,
					"time" : 		raceTime.format("HH.mm"),
					"name" : 		race.data.name,
					"name2" : 		race.data.name2,
					"race_class" : 	race.data.class,
					"race_class2" : race.data.class2,
					"distance" : 	race.data.distance,
					"claim" : 		race.data.claims,
					"discrepancy"   : discrepancy
				};
			}

			if (tab == 'racePrizes') {

				var params = {
					"number": 	race.data.number,
					"time" : 	raceTime.format("HH.mm"),
					"name" : 	race.data.name,
					"prize" : 	race.data.prizepool,
					"first" :   race.data.prizeplacings ? race.data.prizeplacings[0] : '',
					"second" :  race.data.prizeplacings ? race.data.prizeplacings[1] : '',
					"third" :   race.data.prizeplacings ? race.data.prizeplacings[2] : '',
					"fourth" :  race.data.prizeplacings ? race.data.prizeplacings[3] : '',
					"fifth" :   race.data.prizeplacings ? race.data.prizeplacings[4] : '',
					"bonus" :   race.data.prizebonus 	? race.data.prizebonus : '',
					"discrepancy"   : discrepancy
				};
			}

			if (tab == 'raceComment') {
				var params = {
					"number": 	race.data.number,
					"time" : 	raceTime.format("HH.mm"),
					"name" : 	race.data.name,
					"comment" : 	race.data.comment,
					"stewards" : 	race.data.stewards,
					"gearchanges" : 	race.data.gearchanges,
					"discrepancy"   : discrepancy
				};
			}

			if (tab == 'raceTips') {
				var params = {
					"number": 	race.data.number,
					"time" : 	raceTime.format("HH.mm"),
					"name" : 	race.data.name,
					"wd_tips" : 	race.data.wd_tips,
					"wd_leader" : 	race.data.watchdog ? race.data.watchdog[0] : '',
					"wd_class" : 	race.data.watchdog ? race.data.watchdog[1] : '',
					"wd_wild" : 	race.data.watchdog ? race.data.watchdog[2] : '',
					"wd_bet" : 		race.data.watchdog ? race.data.watchdog[3] : '',
					"wd_flexi" : 	race.data.watchdog ? race.data.watchdog[4] : '',
					"discrepancy"   : discrepancy
				};
			}

			if (tab == 'raceMultiples') {
				var params = {
					"id": 		race.data.id,
					"number": 	race.data.number,
					"time" : 	raceTime.format("HH.mm"),
					"name" : 	race.data.name,
					"onClick" : function() {
							console.log('whoooooo');
					},
					"discrepancy"   : discrepancy
				};
			}

			if (tab == 'raceResults') {
				if (race.data.hasOwnProperty('results')) {
					var divs = JSON.parse(JSON.stringify(race.data.results.divs));
					divs = divs[Acme.state.resultsState];
				}


				if (undefined === divs) {
					divs = {
						string: '',
					}
				};

				divs.string = divs.string.trim().replace(/^Race \d+: /, '');

				var p_button = $('#publish_button');

				if (race.data.number == 1) {
					var meetingTypeMismatch = false;
					var meetingtype = self.data.races[0].data.type[0];
					if (meetingtype != divs.type) {
						meetingTypeMismatch = true;
					}

					if (divs.type === 'G') divs.type = 'Greyhounds';
					if (divs.type === 'H') divs.type = 'Harness';
					if (divs.type === 'R') divs.type = 'Gallops';


					if (divs.match == false) {
						p_button.css({
								'color': 'red',
								'display': 'inline-block',
								})
								.text(divs.clienttrackname + " :" + divs.type)
								.prop("disabled", false)
								.data("typeMatch", meetingTypeMismatch);
					} else {
						p_button.css({
								'color': 'none',
								'display': 'inline-block',
								})
								.text(divs.clienttrackname + " :" + divs.type)
								.prop("disabled", true)
								.data("typeMatch", meetingTypeMismatch);
					}
				}

				var params = {
					"id" 			: race.data.id,
					"number" 		: race.data.number,
					"time" 			: raceTime.format("HH.mm"),
					"runners_count" : race.data.runners_count,
					"divstring"     : self.colourDivs( divs.string.trim().replace(/^Race \d+: /, '') ),
					"src"     		: divs.src || '',
					"discrepancy"   : discrepancy
				};
			}

			params['theClass'] = "";

			return params;
		};
		Acme.View.race.prototype.colourDivs = function(divs)
		{
			divs = divs.replace(/(FIRST 4|First 4|Sub:|A2|Q:|E:|T:|D:|Scr:|Duets:)/g, '<span class="blueHilight">$1</span>');

			divs = divs.replace(/([0-9]) ([A-Za-z' ]+)(?= (\$|NTD))/g, '$1 <span class="white">$2</span>');

			return divs;
		};





	Acme.resultsStateMenu = function(config)
	{
		this.data 			 = null;
		this.containerEl     = config.el;
		this.container       = null;
		this.name 			 = config.name || 'resultsState';
		this.default 	 	 = Acme.state.resultsState;
		this.subscriptions = Acme.PubSub.subscribe({
			'Acme.resultsStatesMenu_view.listener' : [
											"raceView/results",
										  	"state_changed"
										  ]
		})
		this.listeners = {
			"raceDivs": function(data) {
				if (data.raceDivs !== false) {
					return this.render();
				} else {
					return this.Menu && this.Menu.remove();
				}

			},
			"resultsState" : function(data) {
				this.default = data.resultsState;
				return this.render();
			}
		}
	};

		Acme.resultsStateMenu.prototype.listener = function(topic, data)
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

		Acme.resultsStateMenu.prototype.render = function(config)
		{	var self = this;

			self.container = $('#' + this.containerEl);

			if (typeof this.Menu == 'object') {
				this.Menu.remove();
			}

			this.Menu = new Acme.listMenu( {
						'parent' 		: self.container,
						'defaultSelect' : {"label": self.default},
						'name' 			: self.name,
						'callback'		: function(data) {
							Acme.PubSub.publish('update_state', {'resultsState': data.resultsState})
						}
			}).init(['vic', 'nsw', 'qld', 'act']).render();
		};

	Acme.divEditor = {
		data : {},
		show : function(data, callback) {
			var self = this;

			self.data = data;
			self.selected = Acme.state.resultsState;

			var dead_heat = self.data['dead_heat'];

			var dfd = $.Deferred();

			$('body').append(template('divEditor')());

			$('#save_button').on("click", function() {

				self.data['dead_heat'] = 0;

				$('input[data-field="position"]').map(function(index, elem) {

					var position = elem.value;

					if (position < (index + 1)) {
						self.data['dead_heat'] = +position;
					}
				});

				callback(self.data);
				self.closeWindow();
			});

			$('#cancel_button').on("click", function() {
				self.closeWindow();
			});

			var divList = $('#divList');

			var dividends = {
				qld: {
					'any2': 'Any 2',
					'exacta': 'Exacta',
					'first4': 'First Four',
					'quinella': 'Quinella',
					'trifecta': 'Trifecta',
				},
				act: {
					'Duet': 'Duet',
					'Exacta': 'Exacta',
					'FirstFour': 'First Four',
					'Quinella': 'Quinella',
					'Trifecta': 'Trifecta',
					'RunningDouble': 'Running Double',
				},
				nsw: {
					'Duet': 'Duet',
					'Exacta': 'Exacta',
					'FirstFour': 'First Four',
					'Quinella': 'Quinella',
					'Trifecta': 'Trifecta',
					'RunningDouble': 'Running Double',
				},
				vic: {
					'Duet': 'Duet',
					'Exacta': 'Exacta',
					'FirstFour': 'First Four',
					'Quinella': 'Quinella',
					'Trifecta': 'Trifecta',
					'RunningDouble': 'Running Double',
				},
			}[self.selected];

			console.log(self.data);

			divList.append('<p>Placings</p>');
			var placeTemp = template('placeDiv');

			if (self.data['placings']) {
				self.data['placings'].map(function(placing, index) {

					var position = index + 1;

					if (dead_heat) {
						position = ((dead_heat == index) && (index != 0)) ? dead_heat : index + 1;
					};

					divList.append(placeTemp({
						'index': index,
						'position': position,
						'number': placing.number,
						'name': placing.name,
						'win': placing.win,
						'place': placing.place,
					}))
				})
			} else {
				for (var i = 0; i < 3; i ++) {
					divList.append(placeTemp({
						'index': i,
						'position': '',
						'number': '',
						'name': '',
						'win': '',
						'place': '',
					}))
				}
			}

			for (var key in dividends) {

				divList.append('<p>' + dividends[key] + '</p>');

				if (self.data[key + '_runners'] && self.data[key + '_runners'].length) {
					self.data[key + '_runners'].map(function(current, i) {
						divList.append(template('raceDiv')({
							'field' : key,
							'runners': current,
							'div': self.data[key + '_div'][i],
							'index': i,
						}));
					})
				} else {
					divList.append(template('raceDiv')({
						'field' : key,
						'runners': '',
						'div': '',
						'index': 0,
					}));
				}
			};

			var keys = {
				'scratchings': 'Scratchings',
				'sub': 'Sub',
			};

			for (var key in keys) {
				divList.append('<p>' + keys[key] + '</p>');
				divList.append(template('divMeta')({
					'field' : key,
					'value': self.data[key],
				}));
			};

			$('.metaField').change(function(e) {
				var elem = $(e.target);
				var field = elem.data("field");

				var payload = null;

				if (typeof self.data[field] === 'object' || field == 'scratchings') {
					payload = elem.val().split(',');
				} else {
					payload = elem.val();
				}

				self.data[field] = payload;
			})

			$('.placingField').change(function(e) {
				var elem  	= $(e.target);
				var index 	= $(elem).closest('ul').data("index");
				var field 	= elem.data("field");
				var payload = elem.val();

				if (!self.data['placings']) {
					self.data['placings'] = [];
				}

				if (!self.data['placings'][index]) {
					self.data['placings'][index] = {};
				}

				self.data['placings'][index][field] = payload;
			});

			$('.divField').change(function(e) {
				var elem  = $(e.target);
				var index 	= $(elem).closest('ul').data("index");

				var payload = null;

				if (typeof self.data[elem.data("field")] === 'object') {
					payload = self.data[elem.data("field")];
					elem.val().split(', ').map(function(value, i) {
						payload[index + i] = value;
					});

					payload = payload.filter(function(value) {
						return value != "";
					})

				} else {
					payload = elem.val();
				}

				if (!self.data[elem.data("field")]) {
					self.data[elem.data("field")] = [];
				}

				if (!self.data[elem.data("field")][elem.data("index")]) {
					self.data[elem.data("field")][elem.data("index")] = {};
				}


				self.data[elem.data("field")][elem.data("index")] = payload;
			});

			return dfd.promise();
		},
		closeWindow : function() {
			$('#modal_divs').closest('#wrapper').remove();
		},
	};


})();

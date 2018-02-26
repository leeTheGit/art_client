(function()
{
	'use strict';



	Radb.View.runners = function(config)
	{
		this.containerTmpl   = config.el;
		this.container       = null;
		this.view 			 = 'runnersData';
		this.selectedRunner  = null;
		this.selected        = null;
		this.subscriptions = Radb.PubSub.subscribe({
			'Radb.runners_view.listener' : [ "state_changed" ],
		});
		this.listeners = {
			"clickEvent" : function(data) {
				if (data.clickEvent == 'meeting') {
					this.soften();
				}
			},
			"user" : function(data) {
				this.soften();
			},
			"runners" : function(data) {
				this.data = data.runners;
				return this.render();
			},
			"currentmeeting" : function(data) {
				if (data.currentmeeting == null) {
					this.clear();
					return;
				}
			},

		}
	};
		Radb.View.runners.prototype.listener = function(topic, data)
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
		Radb.View.runners.prototype.clear = function()
		{
			var self = this;
			self.container = $(self.containerTmpl);
			self.container.empty();
		};
		Radb.View.runners.prototype.soften = function()
		{
			this.container.css('opacity', '.4');
		};
		Radb.View.runners.prototype.brighten = function()
		{
			this.container.css('opacity', '1');
		};
		Radb.View.runners.prototype.render = function()
		{
			var self = this;
			this.container = $(this.containerTmpl);
			$('#discrepancy').remove();

			self.container.empty();
			self.brighten();
			var runnersCount  = this.data.runners.length;

			self.selectedRunner = Radb.state.runner;
			if (runnersCount === 0 ) return;
			$('#runnerstabs').show();

			$('#runnerTabList').find('li').removeClass('runnertabselect');

			$('#runnerTabList').find('#' + self.view).addClass('runnertabselect');

			this.selectList = [];
			$('.raceid').text(this.data.raceid);

			var clampInt = function(x) {
				return x ? parseInt(x) : 99
			};

			var sortRunners = function(runners) {
				if (self.view == 'runnersResults') {
					return runners.sort(Radb.by('data.racenumber', false, clampInt, Radb.by('data.result.position', false, clampInt)));			
				} else {
					return runners;
				}
			};

			var finalTmpl = Radb.renderRunnerData(self.view).call(self, sortRunners(self.data.runners.slice()));

			self.container.append(finalTmpl);

			this.selectedElem = $('ul.runnerSelect');
			if (this.selectedElem.length > 0) {
				Radb.effects.scroll($('.runnersList'), this.selectedElem);
			} else {
				Radb.effects.scroll($('.runnersList'), $('.runnersList > li:first-child'));
			}

			var last = self.data.runners.slice(-1)[0];

			this.events();
			return true;
		};
		Radb.View.runners.prototype.selectById = function(id)
		{
			if (this.data.runners.length > 0) {
				var runners = this.data.runners;

				for (var i=0;i< runners.length; i++) {
					if (runners[i].data.id === id) {
						this.selectedId = runners[i].data.id;
						this.selected = i;
						return;
					}
				}
			}
		};
		Radb.View.runners.prototype.select = function(elem)
		{
			$('.runner_data').removeClass('runnerSelect');
			elem.addClass('runnerSelect');
		};
		Radb.View.runners.prototype.events = function()
		{
			var self = this;
			var presstimer;

			$('.runnersList .runnername').unbind().on("mouseup", function(e) {
				clearTimeout(presstimer);
			}).on('mousedown', function(e) {
				var elem  = $(e.target);

				var id 	  = elem.closest('li[data-arrayid]').data('arrayid');

				var runner = self.data.runners[id];

				presstimer = setTimeout(function() {
					var message = "Delete "+runner.data.name+"?";
					Radb.dialog.show(message, "Warning", runner.delete, runner);
					return;
				}, 1000);
				return false;
			});


			$('.runnersList .runner-discrepancy').unbind().on("mouseup", function(e) {
				clearTimeout(presstimer);
			}).on('mousedown', function(e) {
				var elem  = $(e.target);

				var id 	  = elem.closest('li[data-arrayid]').data('arrayid');

				var runner = self.data.runners[id];

				presstimer = setTimeout(function() {
					var message = "Clear discrepancy for "+runner.data.name+"?";
					Radb.dialog.show(message, "Warning", runner.update, runner, {'load_discrepancy': runner.data.load_discrepancy ? 'NULL' : true });
					return;
				}, 1000);
				return false;
			});


			$('.runnersList').unbind().on("click", function(e) {
				e.preventDefault();
				var data  = {};
				var elem  = $(e.target);
				var id 	  = elem.closest('li[data-arrayid]').data('arrayid');
				var ul 	  = elem.closest('.runner_data');

				var runner = self.data.runners[id];

				self.select(ul);
				Radb.PubSub.publish('update_state', {'runner': runner.data.id });

				// Radb.state.runner = runner.data.id;
				// Radb.PubSub.publish('resource/selected', Radb.state);


				if (elem.hasClass('jockeyname')) {
					var edit = {
						text: elem.text(),
						template: '<div class="flex3"><input class="modal_edit" type="text" id="edit_val" autocomplete="off" value="' + elem.text() + '"></div>',
						callback: function(text) {
							Radb.server.update('jockey/' + elem.data('id'), {name: text}).done(function(r) {
								Radb.effects.saved(elem);
								// Radb.PubSub.publish('state_changed', {'runner': r.data});
							})
						},
					};
					Radb.server.request('jockey').done(function(jockeys) {
						Radb.modal.show('Select Jockey', edit, jockeys.data, function(id) {
							runner.update({'jockeyid': id}).done(function(r) {
								Radb.effects.saved(elem);
								// Radb.PubSub.publish('state_changed', {'runner': r.data});
							});
						});
					});

					return;
				}

				if (elem.hasClass('trainername')) {
					var edit = {
						text: elem.text(),
						template: '<div class="flex3"><input class="modal_edit" type="text" id="edit_val" autocomplete="off" value="' + elem.text() + '"></div>',
						callback: function(text) {
							Radb.server.update('trainer/' + elem.data('id'), {name: text}).done(function(r) {
								Radb.effects.saved(elem);
								// Radb.PubSub.publish('state_changed', {'runner': r.data});
							})
						},
					};
					Radb.server.request('trainer').done(function(trainers) {
						Radb.modal.show('Select Trainer', edit, trainers.data, function(id) {
							runner.update({'trainerid': id}).done(function(r) {
								Radb.effects.saved(elem);
								// Radb.PubSub.publish('state_changed', {'runner': r.data});
							});
						});
					});

					return;
				}

				if (elem.hasClass('delete')) {
					self.data.deleteRace(id);
					return;
				}
				if (elem.hasClass('scratch_button')) {
					var scr_value = (runner.data.scratched !== true);
					var tipped = (runner.data.tip) ? true : false;
					runner.update({'scratched': scr_value}).done(function(r) {
						Radb.PubSub.publish('state_changed', {'runner_tip': r.data});
					});
					return;
				}
				if (elem.parent().hasClass('runner_tip')) {
					runner.update({'tip': true, 'user': Radb.state.user ? Radb.state.user : null}).done(function(r) {
						console.log(r);
						Radb.PubSub.publish('state_changed', {'runner_tip': r.data});
					});
					return;
				}
				if (elem.parent().hasClass('runner_market')) {
					elem.select();
					return;
				}
				if (elem.parent().hasClass('runner_trials')) {
					var data = runner.data.latest_barrier;
					var str = '';

					for (var j = 0; j<data.length; j++) {
						for (var d in data[j]) {
							str += data[j][d] + ', ';
						}
					}
					elem.val(str);
					return;
				}
				if (elem.parent().hasClass('runner_form')) {
					var data = runner.data.latest_form;
					var str = '';
					for (var f=0; f<data.length; f++) {
						str += data[f].latest + '\n\n';
					}
					elem.val(str);
					return;
				}
			});

			$('.runnersList').on("change", function(e) {
				e.preventDefault();
				var data  = {};
				var elem  = $(e.target);
				var id 	  = elem.closest('li[data-arrayid]').data('arrayid');
				var field = elem.attr('name');
				var runner = self.data.runners[id];

				data[field] = elem.val();
				if (data['market']) {
					data['supplier'] = Radb.state.group;
				}

				runner.update(data).done(function(r) {
					Radb.effects.saved(elem);
				}).fail(function(r) {
					elem.val(runner.data[field]);
					Radb.effects.error(elem);

				});
			});

			$('#runnerTabList').unbind().on('click', function(e) {
				var elem = $(e.target);
				self.view = elem.attr('id');
				self.render();
			});
		};


		Radb.renderRunnerData = function(tab)
		{
			var temp = template(tab);

			return function(runners) {

				$('.runnersHeader').empty().append(template(tab + 'Header')());

				$('#missing').html('');

				var raceHeader = _.template('<li class="raceHeader"><h3>Race <span class="weight-700"><%= racenumber %></span></h3></li>');

				var finalTmpl = '',
					race_discrepancies = [];

				this.selectById(this.selectedRunner);

				var currentRace = 0;

				var meeting_discrepancy;

				for (var i=0; i<runners.length; i++) {

					var runner = runners[i].data;

					// Add a race header if needed
					if (runner.racenumber != currentRace) {

						var headertmp = raceHeader({"racenumber": runner.racenumber});

						finalTmpl += headertmp;

						currentRace = runner.racenumber;
					}


					if (i !== 0 && tab != "runnersResults") {
						var expectedNumber = runners[i-1].data.number + 1;

						if ((runner.number !== 1) && (runner.number !== expectedNumber)) {
							$('#missing').html('<center><span class="weight-700">MISSING:</span> Race ' + currentRace + ', Runner ' + expectedNumber + '</center>');
						}
					}

					var discrepancy = '';
					if (runner.load_discrepancy) {
						discrepancy = 'discrepancy';
						meeting_discrepancy = true;
						race_discrepancies.push(currentRace);
					}

					if (tab == 'runnersData') {
						var params = {
							"country"		: runner.country,
							"tip"			: runner.tip,
							"record"		: runner.record,
							"jockey"		: runner.jockey,
							"claim"			: runner.claim,
							"jockey2"		: runner.jockey2,
							"weight"		: runner.weight,
							"legend"		: runner.legend,
							"row"			: runner.row,
							"barrier"		: runner.barrier,
							"hcp"			: runner.handicap,
							"trainer"		: runner.trainer,
			 				"trainerlocation": runner.trainerlocation,
			 				"rating"		: runner.rating,
			 				"market"		: (runner.market !== null) ? runner.market : '0',
			 				"id"			: runner.id,
			 				"disabled"		: runner.scratched ? 'disabled' : '',
						};
					};

					if (tab == 'runnersBreeding') {
						var params = {
							"country"		: runner.country,
							"sire"			: runner.sire,
							"dam"			: runner.dam,
							"damsire"		: runner.damsire,
							"livery"		: runner.livery,
							"gear"			: runner.gear,
							"grade"			: runner.grade,
							"age"			: runner.age,
							"born"			: runner.born,
							"gender"		: runner.gender,
			 				"colour"		: runner.colour,
						};
					};

					if (tab == 'runnersForm') {
						var params = {
							"ud"			: runner.updown,
							"sts"			: runner.start,
							"winnings" 		: runner.winnings,
							"record"		: runner.record,
						};

						params['form'] = "";
						params['trials'] = "";

						var latest_form = runners[i].data.latest_form

						var form_string = "";

						if (latest_form) {
							for (var f=0; f<latest_form.length; f++) {
								form_string += latest_form[f].latest;
							}
							params['form'] = form_string;
						}

						var latest_barrier = runners[i].data.latest_barrier

						var trial_string = "";

						if (latest_barrier) {
							for (var f=0; f<latest_barrier.length; f++) {
								trial_string += latest_barrier[f].latest;
							}
							params['trials'] = trial_string;
						}

					};

					if (tab == 'runnersStats') {
						var params = {
							"start"				: runner.start,
							"starts"			: runner.starts 			? runner.starts			 : '-',
							"placings" 			: runner.placings 			? runner.placings		 : '-',
							"firsts" 			: runner.firsts 			? runner.firsts			 : '-',
							"seconds"			: runner.seconds 			? runner.seconds		 : '-',
							"thirds" 			: runner.thirds 			? runner.thirds			 : '-',
							"track_firm" 		: runner.track_firm 		? runner.track_firm		 : '-',
							"track_good" 		: runner.track_good 		? runner.track_good		 : '-',
							"track_soft" 		: runner.track_soft 		? runner.track_soft		 : '-',
							"track_heavy" 		: runner.track_heavy 		? runner.track_heavy	 : '-',
							"track_synthetic" 	: runner.track_synthetic 	? runner.track_synthetic : '-',
							"trackform" 		: runner.trackform 			? runner.trackform		 : '-',
							"distform"			: runner.distform 			? runner.distform		 : '-',
							"trackdistform" 	: runner.trackdistform 		? runner.trackdistform	 : '-',
							"firstup"			: runner.firstup 			? runner.firstup		 : '-',
							"secondup" 			: runner.secondup 			? runner.secondup		 : '-',
							"thirdup" 			: runner.thirdup 			? runner.thirdup		 : '-',
							"fourthup" 			: runner.fourthup 			? runner.fourthup		 : '-',
							"jumps" 			: runner.jumps 				? runner.jumps			 : '-',
							"night"				: runner.night 				? runner.night			 : '-',
							"wet" 				: runner.wet 				? runner.wet			 : '-',

							"best"				: runner.best,
							"speed"				: runner.speed,
						};
					}

					if (tab == 'runnersComment') {
						var params = {
							"record"		: runner.record,
			 				"comment"		: runner.comment,
			 				"brief" 		: runner.brief,
			 				"gear"			: runner.gear,
						};
					}


					if (tab == 'runnersResults') {
						if (runner.result != null) {
							var params = {
								"position"				: runner.result.position,
								"betting"				: runner.result.betting,
								"weight"				: runner.result.weight,
								"jockey"				: runner.result.jockey,
								"favourite"				: runner.result.favourite,
								"racetime"				: runner.result.racetime,
								"sectional"				: runner.result.sectional,
								"sectionaldistance"		: runner.result.sectionaldistance,
								"lengths"				: runner.result.lengths,
								"claim"					: runner.result.claim,
							}
						} else {
							var params = {
								"position"				: "",
								"betting"				: "",
								"weight"				: "",
								"jockey"				: "",
								"favourite"				: "",
								"racetime"				: "",
								"sectional"				: "",
								"sectionaldistance"		: "",
								"lengths"				: "",
								"claim"					: "",
							}
						}
					}

					params['discrepancy']		= discrepancy;

					params['runnerid'] 			= runner.runnerid;
					params['jockeyid'] 			= runner.jockeyid;
					params['trainerid'] 		= runner.trainerid;

					params['lastfive'] 			= runner.record ? runner.record.slice(-5) : '-';

					params['theClass'] 			= "";
					params['emergency']			= runner.emergency;
					params['scratched'] 		= runner.scratched ? 'scratched' : '';
					params['market_missing']	= runner.market ? '' : 'missing_value';
					params['market_unset']		= Radb.state.group ? ((runner.market_supplier === Radb.state.group) ? '' : 'unset_value') : '';
					params['market_aap']		= Radb.state.group ? ((runner.market_supplier === Radb.state.group) ? '' : params['market']) : '';
					params['race_number'] 		= runner.racenumber;
					params['number'] 			= runner.number;
					params['name']				= runner.name;
					params['selected'] 			= (runner.id === this.selectedRunner) ? 'runnerSelect' : '';
					params['index']	   			= i;

					if (params['market_aap'] !== '') {
						params['market'] = '';
					}

					finalTmpl += temp(params);
				}

				if (meeting_discrepancy) {

					var race_discrepancies = race_discrepancies.filter(function onlyUnique(value, index, self) {
					    return self.indexOf(value) === index;
					});


					$('.race-info').prepend('<h1 id="discrepancy" class="runner_discrepancy">Runner Discrepancy</h1>');

				}

				Radb.PubSub.publish("state_changed", {'discrepancy' : race_discrepancies});

				return finalTmpl;
			}
		};


})();

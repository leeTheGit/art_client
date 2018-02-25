$(function() {
	'use strict';



	Radb.Model.track = Radb.Model.create({
		'url' 			: 'track',
	});



/*
------------------------------------------------
				COLLECTIONS
------------------------------------------------
*/


	Radb.Collection.track = function(model)
	{
		this.model 		= model;
		this.track		= [];
	};
		Radb.Collection.track.prototype.url = function()
		{
			return "track/";
		};
		Radb.Collection.track.prototype.update = function(topic, data)
		{
			if (topic === 'track/added') {
				Radb.state.track = data;
				Radb.PubSub.publish('resource/selected', Radb.state);
			};
			return this.fetch().done(function(data) {
				// console.log('publishing: track/selectbyid');
				// Radb.PubSub.publish('track/selectbyid', Radb.state.track);
				return data;
			});
		};
		Radb.Collection.track.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			var data = Radb.server.request( url );

				data.done( function(response) {
				self.track = [];
				var track = response.data;
				for (var i=0;i<track.length;i++) {
					self.track.push( Object.create(self.model,
										{	'data' : {
												'value': track[i],
												'writable': true
											}
										}
					));
				}

				Radb.PubSub.publish('track/reloaded', self);
			});
			return data;
		};
		Radb.Collection.track.prototype.addTrack = function()
		{
			var self = this;
			var updateParams = {
				'name'     : 'unnamed',
				'code' 	   : 'xxx',
				'risa'     : 'unnamed',
				'timezone' : 'Australia/Melbourne',
				'state'    : 'VIC',
				'type'     : 'RA'
			};
			Radb.server.create("track/", updateParams)
				.done(function(r) {
					Radb.PubSub.publish('track/added', r.data.id);
				});
		};


/*
------------------------------------------------
				VIEWS
------------------------------------------------
*/

	Radb.View.track = function(config)
	{
		this.temp 			 = config.template;;
		this.track           = [];
		this.container       = config.el;
		this.selected        = null;
		this.selectedTrack 	 = null;
		this.selectedElem 	 = null;
		this.filter          = '';
	};
		Radb.View.track.prototype.update = function(topic, data)
		{
			console.log(topic, data);
			if (topic == 'track/deleted') {
				this.clear();
			} else if (topic === 'track/selectbyid') {
				this.selectById(data);
				if (this.selected) {
					this.renderDetails();
				}

				return;
			} else {
				this.track = data;
				this.render();
			}
		};
		Radb.View.track.prototype.render = function()
		{
			Radb.PubSub.publish('load_from_url');

			var self = this;
			self.container.empty();
			var filter = this.filter.toLowerCase().split(',');

			var track = self.track.track;

			if (track.length === 0 ) {
				self.container.empty().append('<div class="noScheduleData">No data</div>');
				return;
			}
			this.selectList = [];
			var finalTmpl     = '';
			var trackCount  = track.length;

			for (var i=0; i<trackCount; i++) {
				var render = true;
				var selected = (i === self.selected) ? 'selected' : '';
				var params = {
					"name"     : track[i].data.name,
					"type"	   : track[i].data.type,
					"index"    : i,
				};
				params['theClass'] = selected;

				if (filter[0] !== '') {
					render = self.filterList(track[i], filter);
				}

				if (render) finalTmpl += this.temp(params);
			}
			self.container.append(finalTmpl);
			this.events();
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
			var track = this.track.track[this.selected];

			this.selectedTrack = track.data.id;

			Radb.state.page = 'tracks';
			Radb.state.track = track.data.id;
			Radb.PubSub.publish('resource/selected', Radb.state);

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

				this.statemenu = new Radb.listMenu( {
							'parent' 		: $('#stateSelect'),
							'defaultSelect' : {"label": track.data.state},
							'name' 			: 'state',
							'callback'		: track.updater(),
				}).init(Radb.venueStates).render();


			} else {
				this.clear();
			}
		};
		Radb.View.track.prototype.selectById = function(id)
		{
			if (this.track.track.length > 0) {
				var tracks = this.track.track;
				for (var i=0;i< tracks.length; i++) {
					if (tracks[i].data.id === id) {
						this.selected = i;
						$('.list_item').removeClass('selected');
						this.selectedElem = $('.list_item[data-arrayid="' + this.selected + '"]');
						this.selectedElem.addClass('selected');

						if (this.selectedElem.length > 0) Radb.effects.scroll($('#trackList'), this.selectedElem);

						return;
					}
				}
			}
		};
		Radb.View.track.prototype.select = function(id)
		{
			var track = $('#trackList li');
			track.each(function(index, elem) {
				var $elem = $(elem);
				var elemindx = $elem.data('arrayid');
				if ($elem.hasClass('selected')) {
					$elem.removeClass('selected');
				}
				if (id === elemindx) {
					$elem.addClass('selected');
				}
			});
		};
		Radb.View.track.prototype.events = function()
		{
			var self = this;

			self.container.unbind().on('click', function(e) {

				var elem = $(e.target);
				var id = elem.data('arrayid');

				self.selected = id;
				self.select(self.selected);

				if (elem.hasClass('delete')) {
					var message = "Delete " + self.track.track[id].data.name + "?";
					Radb.dialog.show(message, "Warning", self.track.track[id].delete, self.track.track[id]);
					return;
				}
				self.renderDetails();
			});
			$('#addTrack').unbind().click(function() {
				self.track.addTrack();
			});
			$('#deleteTrack').unbind().click(function() {
				var message = "Delete " + self.track.track[self.selected].data.name + "?";
				Radb.dialog.show(message, "Warning", self.track.track[self.selected].delete, self.track.track[self.selected]);
			});
			$('#TrackInfo input').unbind().on('change', function(e) {
				e.preventDefault();
				var elem = $(e.target);
				var field = elem.attr('name');
				var track = self.track.track[self.selected],
					data   = {};
				data[field] = elem.val();
				track.update(data).fail(function(r) {
					elem.val(self.track.track[self.selected].data[field]);
					Radb.effects.error(elem);
				});
			});

			$('#meetingfilter').unbind().on('input', function(e) {
				self.filter = $(e.target).val();
				self.render();
			});

		};


	Radb.start = function()
	{
		Radb.state.page = 'tracks';

		// ***************************************
					// LOAD VIEWS
		// ***************************************
		Radb.track_view = new Radb.View.track({'template': template('trackListTemp'), 'el': $('#trackList')});
		Radb.PubSub.subscribe({
			'Radb.track_view.update' : [ "track/deleted",
										 "track/reloaded",
									 	 "track/selectbyid"]
		});


		// // ***************************************
		// 			// LOAD COLLECTIONS
		// // ***************************************

		Radb.track_col = new Radb.Collection.track(Radb.Model.track);
		Radb.PubSub.subscribe({
			'Radb.track_col.update' : [ "track/added",
										 "track/deleted",
										 "track/updated",
										 "track_tz/selected",
									 	 "track_state/selected"]
		});

		Radb.track_col.fetch();

		Radb.PubSub.publish('load_from_url');

	}



});

$(function() {
	'use strict';

	Radb.typeMenu = null;



/*
------------------------------------------------
				MODELS
------------------------------------------------
*/

	Radb.Model.publication = Radb.Model.create({
		'url' : 'publication'
	});

	Radb.Model.output = Radb.Model.create({
		'url' : 'output'
	});
		Radb.Model.output.copyOutput = function()
		{
			var self = this;
				var updateParams = {
					'name' 		: self.data.name + ' Copy',
					'publication' : self.data.publication,
					'header' 	: self.data.header,
					'runner' 	: self.data.runner,
					'scratched' : self.data.scratched,
					'tip' 		: self.data.tip,
					'comment' 	: self.data.comment
				};
				Radb.server.create("output/", updateParams)
					.done(function(r) {
						Radb.PubSub.publish('output/added', self);
					});
		};

	Radb.Model.portal_publication = Radb.Model.create({
		'url' : 'group'
	});



/*
------------------------------------------------
				COLLECTIONS
------------------------------------------------
*/


	Radb.Collection.PortalPublications = function(model)
	{
		// this.date 		= "2014-06-06";
		this.model 		  = model;
		this.publications = [];
	};
		Radb.Collection.PortalPublications.prototype.url = function()
		{
			return "group/";
		};
		Radb.Collection.PortalPublications.prototype.update = function(topic, data)
		{
			return this.fetch();
		};
		Radb.Collection.PortalPublications.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			return Radb.server.request( url )
			 .done( function(response) {
			 	// console.log(response);
				self.publications = [];
				var publications = response.data;
				for (var i=0;i<publications.length;i++) {
					self.publications.push( Object.create(self.model,
										{	'data' : {
												'value': publications[i],
												'writable': true
											}
										}
					));
				}
				Radb.PubSub.publish('portalPublications/fetched', self);
			});
		};
		Radb.Collection.PortalPublications.prototype.find = function(id)
		{
			for(var i=0; this.publications.length > i; i++) {
				if (this.publications[i].data.groupid === id) return i;
			}
			return false;
		};



	// All tipsters from selected portal group used in pulldown menu
	Radb.Collection.PortalTipsters = function(config)
	{
		this.tipsters 		= [];
		this.resource 		= config['resource'];
		this.id       		= '';
		this.publication 	= '';
	};
		Radb.Collection.PortalTipsters.prototype.url = function()
		{
			return 'group/' + this.publication;
		};
		Radb.Collection.PortalTipsters.prototype.update = function(topic, data)
		{
			if (topic === 'update_state') {
				if (data['portPubSelect']) {
					this.publication = data;
				}
			}
			return this.fetch();
		};
		Radb.Collection.PortalTipsters.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;

			return Radb.server.request( url )
			 .done( function(response) {
				self.tipsters = [];
				// console.log(response.data);
				var tipsters = response.data.users;
				if (tipsters) {
					for (var i=0;i<tipsters.length;i++) {
						self.tipsters.push( Object.create(
							Radb._Model, { 'resource':
												{ 'value': 'tipster'},
											'data':
												{'value' : tipsters[i]}
											})
										);
					}
					Radb.PubSub.publish('portalTipsters/reloaded', self);
				}
			});
		};




	// All tips panels available for selected portal group
	Radb.Collection.tipsPanel = function(config)
	{
		this.publication 	= '';
		this.panels 		= [];
		this.query 			= [];
		this.id 			= '';
		this.resource 		= config['resource'];
	};
		Radb.Collection.tipsPanel.prototype.url = function()
		{
			return this.resource + '/' + this.id + this.buildParams();
		};
		Radb.Collection.tipsPanel.prototype.buildParams = function()
		{
			var query = '';
			for(var i=0;i<this.query.length; i+=2) {
				if (this.query[i+1] != false ) {
					query += (i===0) ? '?' : '&';
					query += this.query[i] + '=' + this.query[i+1];
				}
			}
			return query;
		},
		Radb.Collection.tipsPanel.prototype.update = function(topic, data)
		{
			var self = this;
			console.log(topic, data);
			if (topic === 'update_state') {
				if (data['portPubSelect']) {
					Radb.state.publication = data['portPubSelect'];
					console.log(Radb.state);
					this.query = ['publication', data['portPubSelect']];
				}
			}	
			return this.fetch().done(function(){self.query=[];});
		};
		Radb.Collection.tipsPanel.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;

			return Radb.server.request( url )
			 .done( function(response) {
				self.panels = [];
				var panels = response.data;
				for (var i=0;i<panels.length;i++) {
					self.panels.push( Object.create(
						Radb._Model, {'resource':
											{ 'value': 'tipsterspanels'},
									  'data':
											{'value' : panels[i]}
										})
									);
				}
				Radb.PubSub.publish('portalTipsPanel/reloaded', self);
			});
		};
		Radb.Collection.tipsPanel.prototype.create = function(publication, panel)
		{
			var self = this;
			var data = {'publication': publication, 'name': panel};
			return Radb.server.create(this.url(), data)
			.done(function(r) {
				self.query = ['publication', publication];
				self.fetch().done(function(){self.query=[];});
			});
		};



	// All tipsters from selected tips panel
	Radb.Collection.PanelTipsters = function(config)
	{
		this.tipsters 	 = [];
		this.panelid 	 = null;
		this.resource 	 = config['resource'];
		this.query   	 = [];
		this.id 	 	 = '';
		this.subresource = [];
	};
		Radb.Collection.PanelTipsters.prototype.url = function()
		{
			return this.resource + '/' + this.id + this.buildPath() + this.buildParams();
		};
		Radb.Collection.PanelTipsters.prototype.buildPath = function()
		{
			var path = '';
			for(var i=0;i<this.subresource.length; i++) {
				path += '/' + this.subresource[i];
			}
			return path;
		};
		Radb.Collection.PanelTipsters.prototype.buildParams = function()
		{
			var query = '';
			for(var i=0;i<this.query.length; i+=2) {
				if (this.query[i+1] != false ) {
					query += (i===0) ? '?' : '&';
					query += this.query[i] + '=' + this.query[i+1];
				}
			}
			return query;
		},
		Radb.Collection.PanelTipsters.prototype.update = function(topic, data)
		{
			if (topic === 'update_state') {
				if (data['portTipSelect']) {
					this.addTipster(data['portTipSelect']);
				}
			}

			if (topic === 'update_state') {
				if (data['portPanelSelect']) {
					this.id = data['portPanelSelect'];
				}
			}
			return this.fetch().done(function(){this.query=[];});
		};
		Radb.Collection.PanelTipsters.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			return Radb.server.request( url )
			 .done( function(response) {
				self.tipsters = [];
				var tipsters = response.data.tipsters;
				console.log(response.data);
				if (tipsters) {
					for (var i=0;i<tipsters.length;i++) {
						self.tipsters.push( Object.create(
							Radb._Model, {'resource':
												{ 'value': 'tipster'},
											'data':
												{ 'value': tipsters[i]}
											})
										);
					}
					Radb.PubSub.publish('panelTipsters/reloaded', self);
				}
			});
		};
		Radb.Collection.PanelTipsters.prototype.addTipster = function(tipster)
		{
			var self = this;
			var data = {'tipster':tipster};
			return Radb.server.create(self.url(), data)
			.done(function(r) {
				self.subresource = [];
				self.fetch();
			});
		};
		Radb.Collection.PanelTipsters.prototype.deleteTipster = function(tipster)
		{
			var self = this;
			self.subresource = ['tipster', tipster];
			return Radb.server.delete(self.url())
			.done(function(r) {
				self.fetch();
			});
		};
		Radb.Collection.PanelTipsters.prototype.sort = function(tipsters)
		{
			var self = this;
			var data = {'tipsters':tipsters};

			return Radb.server.update(self.url(), data)
			.done(function(r) {
				console.log(r);
				self.fetch();
			});
		};









	// Print publications and outputs
	Radb.Collection.publication = function(model)
	{
		this.model 			= model;
		this.publication	= [];
	};
		Radb.Collection.publication.prototype.url = function()
		{
			return "publication/?data=all";
		};
		Radb.Collection.publication.prototype.update = function(topic, data)
		{
			if (topic === 'publication/added') {
				Radb.state.output = null;
				Radb.state.publication = data;
				Radb.PubSub.publish('resource/selected', Radb.state);
			};
			return this.fetch();
		};
		Radb.Collection.publication.prototype.fetch = function(url)
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			var data = Radb.server.request( url );

			data.done( function(response) {
				// console.log(response);
				self.publication = [];
				var publication = response.data;
				for (var i=0;i<publication.length;i++) {
					self.publication.push( Object.create(self.model,
										{	'data' : {
												'value': publication[i],
												'writable': true
											}
										}
					));
				}
				Radb.PubSub.publish('publication/fetched', self);
			});
			return data;
		};
		Radb.Collection.publication.prototype.addPublication = function()
		{
			var self = this;
			var updateParams = {
				'name' : 'unnamed',
				'timezone' : 'Australia/Melbourne',
			};
			return Radb.server.create("publication/", updateParams)
				.done(function(r) {
					self.fetch();
				});
		};

	Radb.Collection.output = function(model)
	{
		this.model 			= model;
		this.output			= [];
		this.publication 	= null;
	};
		Radb.Collection.output.prototype.url = function()
		{
			return "output/?pid=" + this.publication;
		};
		Radb.Collection.output.prototype.update = function(topic, data)
		{
			// console.log(topic, data);
			if (topic === 'output/added') {
				Radb.state.output = data;
				Radb.url.updateQuery({'output':Radb.state.output});
				Radb.PubSub.publish('resource/selected', Radb.state);
			};

			if (topic === 'publication/selected') {
				this.publication = data.id;
			}
			if (this.publication != null ) {
				return this.fetch();
			}
		};
		Radb.Collection.output.prototype.fetch = function(url)
		{
			var self = this;

			var url = (url === undefined) ? this.url() : url;
			var data = Radb.server.request( url );

			data.done( function(response) {
				self.output = [];
				var output = response.data;
				for (var i=0;i<output.length;i++) {
					self.output.push( Object.create(self.model,
						{	'data' : {
								'value': output[i],
								'writable': true
							}
						}
					));
				}

				Radb.PubSub.publish('output/fetched', self);
			});
			return data;
		};
		Radb.Collection.output.prototype.addOutput = function()
		{
			var self = this;
			var params = {
				'name' : 'unnamed',
				'publication' : this.publication
			};
			Radb.server.create("output/", params)
				.done(function(r) {
					console.log(r);
					self.fetch();
				});
		};
		Radb.Collection.output.prototype.copyOutput = function(id)
		{
			var self = this;
			var params = {
				'output' : id,
				'publication' : this.publication
			};
			Radb.server.create("output/", params)
				.done(function(r) {
					console.log(r);
					self.fetch();
				});
		};


/*
------------------------------------------------
				VIEWS
------------------------------------------------
*/

	Radb.View.publicationList = function(config)
	{
		this.temp 			 = config.template;;
		this.publication     = [];
		this.container       = config.el;
		this.selected        = null;
		this.db_id 			 = null;
		this.events();
	};
		Radb.View.publicationList.prototype.update = function(topic, data)
		{
			var self = this;
			if (topic === 'publication_market/selected') {
				var payload = {};

				if (self.selected) {
					var publication = self.publication.publication[self.selected];

					payload['default_market'] = data;
					publication.update(payload).done(function(r) {
							console.log(r);
					});
				}
			} else if (topic == 'publication/deleted') {
				this.clear();
			}  else if (topic == 'publication/selectbyid') {
				this.selectById(data);
				if (this.selected) {
					this.renderDetails();
				}

				return;
			} else {
				this.publication = data;
				this.render();
			}
		};
		Radb.View.publicationList.prototype.render = function()
		{
			Radb.PubSub.publish('load_from_url');

			var self = this;
			self.container.empty();
			var publication = self.publication.publication;
			if (publication.length === 0 ) {
				self.container.empty().append('<div class="noScheduleData">No data</div>');
				return;
			}
			this.selectList = [];
			var finalTmpl     = '';
			var publicationCount  = publication.length;
			for (var i=0; i<publicationCount; i++) {
				var selected = '';
				if (publication[i].data.id === self.db_id) {
					selected = 'selected';
					self.selected = i;
				}
				var params = {
					"name"     : publication[i].data.name,
					"selected" : selected,
					"index"    : i,
				};
				params['theClass'] = selected;
				finalTmpl += this.temp(params);
			}
			self.container.append(finalTmpl);
			this.events();
			return this;
		};
		Radb.View.publicationList.prototype.clear = function()
		{
			$('.publication_id').val('');
			$('.publication_name').val('');
			$('.publication_timezone').val('');
		};
		Radb.View.publicationList.prototype.renderDetails = function()
		{
			var self = this;
			var publication = this.publication.publication[this.selected];

			if (publication) {
				Radb.state.publication = publication.data.id;
				Radb.PubSub.publish('resource/selected', Radb.state);

				$('.publication_id').val(publication.data.id);
				$('.publication_name').val(publication.data.name);
				$('.publication_timezone').val(publication.data.timezone);

				var timezone = publication.data.timezone;
				var state = publication.data.state;

				if (typeof this.tzMenu == 'object') {
					this.tzMenu.remove();
				}

				this.tzMenu = new Radb.listMenu( {
							'parent' 		: $('#timezoneSelect'),
							'defaultSelect' : {"label": timezone},
							'name' 			: 'timezone',
							'callback'		: publication.updater(),
				}).init(Radb.timezones).render();

				var timezone = publication.data.timezone;

				if (typeof this.stateMenu == 'object') {
					this.stateMenu.remove();
				}

				this.stateMenu = new Radb.listMenu( {
							'parent' 		: $('#stateSelect'),
							'defaultSelect' : {"label": state},
							'name' 			: 'state',
							'callback'		: publication.updater(),
				}).init(Radb.venueStates).render();

			} else {
				this.clear();
			}
		};
		Radb.View.publicationList.prototype.selectById = function(id)
		{
			if (this.publication.publication.length > 0) {
				var publications = this.publication.publication;
				for (var i=0;i< publications.length; i++) {
					if (publications[i].data.id === id) {
						this.selected = i;
						this.db_id = id;

						$('.list_item').removeClass('selected');
						this.selectedElem = $('.list_item[data-arrayid="' + this.selected + '"]');
						this.selectedElem.addClass('selected');

						if (this.selectedElem.length > 0) Radb.effects.scroll($('#publicationList'), this.selectedElem);
						Radb.PubSub.publish('publication/selected', this.publication.publication[this.selected].data);

						return;
					}
				}
			}
		};
		Radb.View.publicationList.prototype.select = function(id)
		{
			var self = this;
			var publication = $('#publicationList li');
			publication.each(function(index, elem) {
				var $elem = $(elem);
				var elemindx = $elem.data('arrayid');
				if ($elem.hasClass('selected')) {
					$elem.removeClass('selected');
				}
				if (id === elemindx) {
					$elem.addClass('selected');
				}
			});

			Radb.PubSub.publish('publication/selected', self.publication.publication[self.selected].data);
		};
		Radb.View.publicationList.prototype.events = function()
		{
			var self = this;

			self.container.unbind().on('click', function(e) {
				var elem = $(e.target);
				var id = elem.data('arrayid');
				self.selected = id;
				self.db_id = self.publication.publication[id].data.id;
				self.select(self.selected);

				Radb.state.output = null;
				Radb.url.query = [];

				self.renderDetails();
			});

			$('#addPublication').unbind().on('click', function(e) {
				self.publication.addPublication();
			});

			$('#deletePublication').unbind().on('click', function(e) {
				var message = "Delete " + self.publication.publication[self.selected].data.name + "?";
				Radb.dialog.show(message, "Warning", self.publication.publication[self.selected].delete, self.publication.publication[self.selected])
				.done(function(r) {
					Radb.state.publication = null;
					Radb.url.query = '';
					Radb.PubSub.publish('resource/selected',  Radb.state);
				});
			});

			$('.publication_info input').unbind().on('change', function(e) {
				e.preventDefault();
				var elem = $(e.target);
				var field = elem.attr('name');
				var publication = self.publication.publication[self.selected],
					data   = {};
				data[field] = elem.val();

				publication.update(data).fail(function(r) {
					elem.val(publication.data[field]);
					Radb.effects.error(elem);
				});
			});

		};

	Radb.View.outputList = function(config)
	{
		this.temp 			 = config.template;;
		this.output          = [];
		this.container       = config.el;
		this.selected        = null;
		this.selectedOutput  = null;
		this.clipboard 		 = null;
		this.events();
		this.fields 		 = {};
	};
		Radb.View.outputList.prototype.update = function(topic, data)
		{
			// console.log(topic, data);
			if (topic === 'output/selectbyid') {
				this.selectedOutput = data;
				// this.render();
				return;
			}

			if (topic === 'output/deleted') {
				this.selectedOutput = null;
				this.selected = null;
				return;
			}

			this.output = data;
			this.render();
		};
		Radb.View.outputList.prototype.render = function()
		{
			var self = this;
			self.container.empty();

			var output = self.output.output;
			if (output.length === 0 ) {
				self.container.empty().append('<div class="noScheduleData">No data</div>');
				return;
			}

			self.selectById(Radb.state.output);

			this.selectList = [];
			var finalTmpl     = '';
			var publicationCount  = output.length;

			for (var i=0; i<publicationCount; i++) {
				var selected = (i === self.selected) ? 'selected' : '';
				var params = {
					"name"     : output[i].data.name,
					"index"    : i,
				};
				params['theClass'] = selected;
				finalTmpl += this.temp(params);
			}
			self.container.append(finalTmpl);
			// this.events();
			return this;
		};
		Radb.View.outputList.prototype.selectById = function(id)
		{
			$('outputList.list_item').removeClass('selected');
			if (this.output.output.length > 0) {
				var outputs = this.output.output;
				for (var i=0;i < outputs.length; i++) {
					if (outputs[i].data.id === id) {
						this.selected = i;
						this.selectedElem = $('outputList.list_item[data-arrayid="' + this.selected + '"]');
						this.selectedElem.addClass('selected');
						Radb.PubSub.publish('output/selected', this.output.output[this.selected]);

						if (this.selectedElem.length > 0) Radb.effects.scroll($('#outputList'), this.selectedElem);

						return;
					}
				}
			}
		};
		Radb.View.outputList.prototype.select = function(id)
		{
			var output = $('#outputList li');
			output.each(function(index, elem) {
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
		Radb.View.outputList.prototype.events = function()
		{
			var self = this;
			self.container.unbind();
			$('#addOutput').unbind();
			$('#deleteOutput').unbind();
			$('#duplicateOutput').unbind();
			$('#copyOutput').unbind();
			$('#pasteOutput').unbind();

			// This saves the cursor position for each of the text editable fields
			self.container.on('click', function(e) {
				var elem = $(e.target);
				var id = elem.data('arrayid');
				self.selected = id;
				self.select(self.selected);
				// self.renderDetails();
				Radb.state.output = self.output.output[self.selected].data.id;
				Radb.url.updateQuery({'output':Radb.state.output});
				Radb.PubSub.publish('resource/selected', Radb.state);

				Radb.PubSub.publish('output/selected', self.output.output[self.selected]);
			});

			$('#addOutput').on('click', function(e) {
				self.output.addOutput();
			});
			$('#copyOutput').on('click', function(e) {
				self.clipboard = self.output.output[self.selected].data.id;
			});
			$('#pasteOutput').on('click', function(e) {
				self.output.copyOutput(self.clipboard);
			});
			$('#deleteOutput').on('click', function(e) {
				var message = "Delete " + self.output.output[self.selected].data.name + "?";
				Radb.dialog.show(message, "Warning", self.output.output[self.selected].delete, self.output.output[self.selected])
				.done(function(r) {
					Radb.state.output = null;
					Radb.url.query = '';
					Radb.PubSub.publish('resource/selected', Radb.state);
				});
			});
			$('#duplicateOutput').on('click', function(e) {
				self.output.copyOutput(self.output.output[self.selected].data.id);
			});
		};

	Radb.View.outputRace = function(config)
	{
		this.temp 			 = config.template;;
		this.output          = null;
		this.container       = config.el;
		this.clipboard 		 = null;
		this.events();
		this.cursors         = {
			'output_header': 	 0,
			'output_runner': 	 0,
			'output_scratched': 0,
			'output_tip': 		 0,
			'output_comment': 	 0,
		};
		this.fields 		 = {};
	};
		Radb.View.outputRace.prototype.update = function(topic, data)
		{
			var self = this;

			if (topic == 'output/deleted' || topic == 'publication/selected') {
				this.clear();
			}
			else if (topic == 'addTag') {
				if (this.output.data.type && this.output.data.type !== 'race') return;
				this.addTag(data);
			}
			else {
				this.output = data;
				if (this.output.data.type && this.output.data.type !== 'race') return;
				this.render();
			}
		};
		Radb.View.outputRace.prototype.render = function()
		{
			var self = this;
			self.container.empty();
			var output = self.output;
			if (output.length === 0 ) {
				self.container.empty().append('<div class="noScheduleData">No data</div>');
				return;
			}
			var finalTmpl     = '';

			var params = {
				"header"   : output.data.header,
				"runner"   : output.data.runner,
				"scratched": output.data.scratched,
				"tip"      : output.data.tip,
				"comment"  : output.data.comment,
			};
			finalTmpl += this.temp(params);
			self.container.append(finalTmpl);
			$('#output_type')		.text(output.data.type);
			$('#output_id')		    .text(output.data.id);
			$('#output_name')		.val(output.data.name);
			$('#import_script')		.val(output.data.import_script);

			if (Radb.typeMenu) {
				Radb.typeMenu.select(output.data.type)
			}
			else {

				Radb.typeMenu = new Radb.listMenu({
							'parent' 		: $('#outputTypeSelectorContainer'),
							'defaultSelect' : {"label": output.data.type},
							'name' 			: 'type',
							'callback'		: self.output.updater(),
				}).init([ 'race', 'tips' ]).render();
			}



			this.events();
			return this;
		};
		Radb.View.outputRace.prototype.clear = function()
		{
			$('#output_name').html('');
			$('#output_header').html('');
			$('#output_runner').html('');
			$('#output_scratched').html('');
			$('#output_tip').html('');
			$('#output_comment').html('');
			$('#header_style').text('');
			$('#runner_style').text('');
			$('#scratched_style').text('');
			$('#tip_style').text('');
			$('#comment_style').text('');
		};
		Radb.View.outputRace.prototype.renderDetails = function()
		{
			var output = this.output.output[this.selected];
			if (output) {
				$('#output_type')		.text(output.data.output_type);
				$('#output_id')		    .text(output.data.id);
				$('#output_name')		.val(output.data.name);
				$('#output_header')		.val(output.data.header);
				$('#output_runner')		.val(output.data.runner);
				$('#output_scratched')	.val(output.data.scratched);
				$('#output_tip')		.val(output.data.tip);
				$('#output_comment')	.val(output.data.comment);
				$('#import_script')		.val(output.data.import_script);
			} else {
				this.clear();
			}
		};
		Radb.View.outputRace.prototype.select = function(id)
		{
			var output = $('#outputList li');
			output.each(function(index, elem) {
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
		Radb.View.outputRace.prototype.saveOutput = function(id)
		{
			var self = this;
			var data = {};

			var output = self.output;

			if (output) {
				data['name'] 			= $('#output_name').val().trim();
				data['header'] 			= $('#output_header').val();
				data['runner'] 			= $('#output_runner').val();
				data['scratched'] 		= $('#output_scratched').val();
				data['tip'] 			= $('#output_tip').val().trim();
				data['comment'] 		= $('#output_comment').val().trim();
				data['import_script'] 	= $('#import_script').val().trim();
				console.log(data);
				if (data['name']) {
					console.log('updating!!');
					output.update(data).fail(function(r) {
					var elem = $('#output_name');
					Radb.effects.error(elem);
				});
				}
			}
		};
		Radb.View.outputRace.prototype.events = function()
		{
			var self = this;
			self.container.unbind();
			$('.edit-block').unbind();
			$('#output_header').unbind();
			$('input[name=name]').unbind();
			$('.outputHeaders').unbind();
			$('.tagextra').unbind();
			$('#import_script').unbind();
			$('#saveOutput').unbind();

			$('.edit-block').on('click', function(e) {
				var output = self.output;
				var block = this.id;

				$('div[name='+block+']').removeClass('hidden');
				$('div.outputHeaders > div').not('div[name='+block+']').addClass('hidden');

				$('button.button[for="' + block + '"]').show();
				$('button.field.button').not('[for="' + block + '"]').hide();
				var data = {'output': output, 'field': block};
				Radb.PubSub.publish('field/selected', data);
			});
			$('.outputHeaders').on('click', function(e) {
				var elem = $(e.target);
				if (!elem.is('button')) return;
				var button = elem.text();
				var block = $('#' + elem.attr('for'));

				if (button == 'Copy') {
					self.clipboard = block.text();
				}
				if (button == 'Paste') {
					block.text(self.clipboard);
				}
			});

			$('#saveOutput').on('click', function(e) {
				self.saveOutput();
			});

			$('input[name=name]').on('change', function(e) {
				var name = $(this).val();
				self.output.update({"name":name});
			});
		};

	Radb.View.outputTips = function(config)
	{
		this.temp 			 = config.template;;
		this.output          = null;
		this.container       = config.el;
		this.clipboard 		 = null;
		this.events();
		this.cursors         = {
			'header': 	 0,
			'runner': 	 0,
			'scratched': 0,
			'tip': 		 0,
			'comment': 	 0,
		};
		this.fields 		 = {};
	};
		Radb.View.outputTips.prototype.update = function(topic, data)
		{
			if (topic == 'output/deleted' || topic == 'publication/selected') {
				this.clear();
			}
			else if (topic === 'output/selected') {
				this.output = data;
				if (this.output.data.type && this.output.data.type !== 'tips') return;
				this.render();
			}
			else if (topic == 'addTag') {
				if (this.output.data.type && this.output.data.type !== 'tips') return;
				this.addTag(data);
			}
		};
		Radb.View.outputTips.prototype.render = function()
		{
			var self = this;
			self.container.empty();

			var output = self.output;
			if (output.length === 0 ) {
				self.container.empty().append('<div class="noScheduleData">No data</div>');
				return;
			}
			var finalTmpl     = '';

			var params = {
				"cell0"   		: output.data.tips_cell0,
				"tipster_head"  : output.data.tips_tipster_head,
				"race_head" 	: output.data.tips_race_head,
				"picks"      	: output.data.tips_picks,
			};
			finalTmpl += this.temp(params);
			self.container.append(finalTmpl);
			$('#output_type')		.text(output.data.type);
			$('#output_id')		    .text(output.data.id);
			$('#output_name')		.val(output.data.name);
			$('#import_script')		.val(output.data.import_script);





			if (Radb.typeMenu) {
				Radb.typeMenu.select(output.data.type)
			}
			else {

				Radb.typeMenu = new Radb.listMenu({
							'parent' 		: $('#outputTypeSelectorContainer'),
							'defaultSelect' : {"label": output.data.type},
							'name' 			: 'type',
							'callback'		: self.output.updater(),
				}).init([ 'race', 'tips' ]).render();
			}


			this.events();
			return this;
		};
		Radb.View.outputTips.prototype.clear = function()
		{
			$('#output_name').html('');
			$('#output_header').html('');
			$('#output_runner').html('');
			$('#output_scratched').html('');
			$('#output_tip').html('');
			$('#output_comment').html('');
			$('#header_style').text('');
			$('#runner_style').text('');
			$('#scratched_style').text('');
			$('#tip_style').text('');
			$('#comment_style').text('');
		};
		Radb.View.outputTips.prototype.saveOutput = function(id)
		{
			var self = this;
			var data = {};
			var output = self.output;

			if (output) {
				data['name']  				= $('#output_name').val().trim();
				data['tips_cell0']  		= $('#output_cell0').val();
				data['tips_tipster_head']	= $('#output_col1').val();
				data['tips_race_head']  	= $('#output_row1').val();
				data['tips_picks']  		= $('#tips_picks').val().trim();
				if (data['name']) {
					output.update(data);
				}
			}
		};
		Radb.View.outputTips.prototype.events = function()
		{
			var self = this;
			self.container.unbind();
			$('.edit-block').unbind();
			$('#output_header').unbind();
			$('#output_name').unbind();
			$('.outputHeaders').unbind();
			$('.tagextra').unbind();
			$('#import_script').unbind();
			$('#saveOutput').unbind();

			// This saves the cursor position for each of the text editable fields
			$('.tagextra').on('change', function(e) {
				var elem     = $(e.target);
				var parent 	 = elem.closest('div.outputHeaders');
				var name 	 = parent.attr('name');
				var elemname = elem.attr('name');
				var value 	 = elem.val();
				var sel 	 = window.getSelection();
				if (elemname == 'pre') {
					var prev = self.cursors[name].startContainer.previousSibling;
					var newRange = self.cursors[name].cloneRange();
					var parent = newRange.startContainer.parentNode;
					if (prev) parent.removeChild(prev);
					if (value != '') {
						var parentEl = document.createElement("span");
						parentEl.className = 'blueHilight';
						parentEl.appendChild(newRange.createContextualFragment(value));
						newRange.setStartBefore(self.cursors[name].startContainer);
						newRange.collapse(true);
						newRange.insertNode(parentEl);
					}
				}
				if (elemname == 'post') {
					var next = self.cursors[name].startContainer.nextSibling;
					var newRange = self.cursors[name].cloneRange();
					var parent = newRange.startContainer.parentNode;
					if (next) parent.removeChild(next);
					if (value != '') {
						var parentEl = document.createElement("span");
						parentEl.className = 'navyHilight';
						parentEl.appendChild(newRange.createContextualFragment(value));
						newRange.setStartAfter(self.cursors[name].startContainer);
						newRange.collapse(true);
						newRange.insertNode(parentEl);
					}
				}
			});
			// $('.tipsgrid').on('click keyup', function(e) {
			// 	var elem     = $(e.target);
			// 	var name 	 = elem.attr('name');
			// 	var tag_pre  = $('#'+name+'_pre');
			// 	var tag_post = $('#'+name+'_post');
			// 	tag_pre.val('');
			// 	tag_post.val('');

			// });

			$('#saveOutput').on('click', function(e) {
				self.saveOutput();
			});

			$('#output_name').on('change', function(e) {
				var name = $(this).val();
				self.output.update({"name":name});
			});

		};



	Radb.View.Format_view_collection = function(config, views)
	{
		this.views 			= views || {};
		this.parent 		= config.parent || null;
		this.container 		= $('#formatList');
		this.view 			= 'formatting';
		this.publications 	= [];
		this.tipsters 		= [];
		this.tipstersPanels = [];
		this.panelTipsters 	= [];
		this.tabLabels 		= $('#formattinglinks label');
		this.events();
	};
		Radb.View.Format_view_collection.prototype.update = function(topic, data)
		{

			// if (topic === 'portPubSelect/selected') {
			// 	Radb.state.publication = data;
			// 	return;
			// }
			if (topic === 'portalPublications/fetched') {
				this.publications = data;
				return;
			}
			if (topic === 'portalTipsters/reloaded') {
				this.tipsters = data;
				return;
			}
			if (topic === 'portalTipsPanel/reloaded') {
				this.tipstersPanels = data;
				return;
			}
			if (topic === 'panelTipsters/reloaded') {
				this.panelTipsters = data;
				this.render(this);
				return;
			}

			this.output = data;
			this.output.data.publications 		= this.publications.publications;
			this.output.data.tipsters 	  		= this.tipsters.tipsters;
			this.output.data.tipstersPanels   	= this.tipstersPanels;
			this.render();
		};
		Radb.View.Format_view_collection.prototype.render = function()
		{
			var self = this;

			this.views[this.view].render(this);
			this.tabLabels.removeClass('selectedTab');

			$.each( this.tabLabels, function(i,e) {
				var elem = $(e);
				if ( elem.text().toLowerCase().replace(' ', '') === self.view) {
				 	elem.addClass('selectedTab');
				 }
			});

			return this;
		};
		Radb.View.Format_view_collection.prototype.events = function()
		{
			var self = this;
			$('#formattinglinks > label').unbind().on('click', function(e) {
				self.view = $(e.target).text().replace(' ', '').toLowerCase();
				self.render();
			});
		};

		Radb.View.formatting = function(config)
		{
			this.temp 		  = config.templates;
			this.field 		  = '';
			this.output 	  = '';
			this.tagList   	  = {};
			this.container    = config.el;
			this.view 		  = 'Formatting';
			this.output       = {};
			this.hidden       = {
				'000s_pane': true,
				'comment_pane':true,
				'emergencies_pane': true,
				'formbank_pane': true,
				'header_pane': true,
				'market_pane': true,
				'prizemoney_pane':true,
				'runners_pane':true,
				'second_row_pane':true,
				'silks_pane':true,
				'stats_pane':true,
				'time_pane': true,
				'tips_pane': true,
				'tipspanel_pane':true,
				'weight_pane': true,
				'results_pane': true,
			};
			this.events();
		};
			Radb.View.formatting.prototype.update = function(topic, data)
			{
				if (topic == 'output/selected') {
					this.output = data;
					this.render();
				}

				if (topic == 'field/selected') {
					this.output = data['output'];
					this.field = data['field'];
				}

			};
			Radb.View.formatting.prototype.render = function(output)
			{
				var self = this;
				self.container.empty().append(self.temp());

				if (output.output) {
					self.output = output.output;
					output = self.output.data;

					var stat = output.stats_format;
					$('#stats_' + stat)			.prop('checked', true);

					$('#output_type')			.val(output.type);
					$('#output_id')		    	.text(output.id);

					var val_options = ['favourite_pre', 'favourite_post', 'record_spell', 'weight_decimal', 'market_places', 'tips_length',
									   'tips_separator', 'emergency_single', 'emergency_plural', 'record_length', 'second_row', 'prizemoney_decimal', 'tips_cell_style',
									   'tips_pick1', 'tips_picks', 'tips_missing', 'tips_col1_width', 'tips_col2_width', 'comment_firststart',
									   'table_zero_character', 'nil_prizemoney', 'time_string', 'date_format', 'tips_poll_max', 'tips_poll_cell', 'tips_poll_best',
									   'poll_list_raceheader', 'poll_list_best', 'poll_list_item', 'meeting_header', 'meeting_footer', 'runner_sort',
									   'toprater_pre', 'toprater_post', 'tips_best_1', 'tips_best_2', 'tips_best_3', 'runner_form', 'silks_variant', 'silks_library', 'tips_bests_head', 'tips_bests_cell', 'results'
									   ];

					for (var i=0; i < val_options.length; i++) {
						$('#' + val_options[i]).val(output[val_options[i]]);
					}

					// TIPS

					if (output.tips_orientation) {
						$('#horizontal').prop('checked', true);
					} else {
						$('#vertical').prop('checked', true);
					}

					var tip_elem = ['name', 'number', 'rank'];

					var tip_button = _.template('<li><label class="button <%= selected %>" id="tips_format_<%= tag %>" name="tips_<%= tag %>"><%= tag %></label></li>');

					var tips_format_array = (output.tips_format) ? output.tips_format.toLowerCase().split(' ') : [];

					// iterate over tags in tips_format, add them in correct order and highlight
					for (var i = 0; i < tips_format_array.length; i++) {
						$('#tipsformat').append( tip_button({tag: tips_format_array[i], selected: 'onBlue'}) );
					}

					// iterate over remaining tags, only append if they don't match tips_format
					for (var i = 0; i < tip_elem.length; i++) {
						if ($.inArray(tip_elem[i], tips_format_array) == -1 ) {
							$('#tipsformat').append( tip_button({tag: tip_elem[i], selected: ''}) );
						}
					}

					var bool_options = ['emergency_supress', 'updown_arrow', 'comment_fractions', 'comment_clearform', 'formbank_suppress_200m', 'market_strip_zero', 'tips_poll', 'tips_poll_list', 'wide_runners', 'blank_scratchings', 'race_silks', 'runner_silks', 'tips_panel', 'bests_as_row', 'results_full', 'results_owner'];

					for (var i = 0; i < bool_options.length; i++) {
						if (output[bool_options[i]]) {
							$('#' + bool_options[i]).addClass('onBlue');
						}
					}

					for (var prop in self.hidden) {
						if (self.hidden[prop] == true) {
							$('#' + prop).toggleClass('hidden');
						};
					}
				}
				this.events();
				return this;
			};

			Radb.View.formatting.prototype.events = function()
			{
				var self = this;
				self.container.unbind();

				var navlinks   = $('#formattinglinks > label');
				var alltags    = $('#allTags');
				var tag        = $('#tag');
				var formatHeaders = $('.outerformat h3');
				var formatWindow = $('.outerformat');
				var formatbuttons = $('#formatingViewButtons ul');
				var tipsformat = $( "#tipsformat" );
				var statsformat = $( "#statsformat" );

				function tips_format() {
					var tips_format_order = [];
					$.each( $('#tipsformat > li'), function(i,e) {
						var elem = $(e);
						var value = elem.children('label').hasClass('onBlue');
						if (value) {
							tips_format_order.push( elem.children('label').text() );
						}
					});
					return tips_format_order.join(' ');
				}

				alltags.unbind();
				tag.unbind();
				formatHeaders.unbind();
				formatWindow.unbind();
				formatbuttons.unbind();
				statsformat.unbind();

				formatbuttons.on('click', function(e) {
					var elem = $(e.target);
					var button = elem.attr('name');

					formatHeaders.each(function(i,e) {
						if (button ==='plus') {
							$('.innerformat').removeClass('hidden');
							var bool = false;
						} else {
							$('.innerformat').addClass('hidden');
							var bool = true;

						}
						for (var hidden in self.hidden) {
							if (self.hidden.hasOwnProperty(hidden)) {
								self.hidden[hidden] = bool;
							}
						}
					});
				});


				tipsformat.on('click', function(e) {
					var elem = $(e.target), data={};
					elem.toggleClass('onBlue');
					data['tips_format'] = tips_format();
					self.output.update(data);
				});

				tipsformat.sortable({
				  axis: "x",
				  stop: function() {
					var data = {};
					data = tips_format();
					if(data) self.output.update({'tips_format': data});
				  }
				});

				tag.on('click', function(e) {
					var elem = $(e.target);
					var name = self.field;
					var tag = elem.text();
					var obj = {};
					obj[name] = tag;
					Radb.PubSub.publish('addTag', obj);
				});

				formatHeaders.on('click', function(e) {
					var elem = $(e.target);
					var section = elem.data('pane');
					$('#' + section).toggleClass('hidden');
					self.hidden[section] = !self.hidden[section];
				});


				// This saves each change to the formats
				formatWindow.on('change', function(e) {
					var data  = {};
					var elem  = $(e.target);
					var input = elem.attr('name');
					var val   = elem.val();
					console.log(input);

					function getTimeFormat(val) {
						console.log(val);
						if (val === '3.45') return '';
						if (val === '3.45 pm') return ' a';
						if (val === '3.45pm') return 'a';
						if (val === '3.45 PM') return ' A';
						if (val === '3.45PM') return 'A';
					}

					if (input == 'stat') {
						data['stats_format'] = val;
					}
					else if (input == 'colwidths') {
						var val = elem.val();
						if (val === 'horizontal') {
							data['tips_orientation'] = true;
						} else {
							data['tips_orientation'] = false;
						}
					}
					else {
						data[input] = val;
					}
					if (input === 'tips_col1_width') data[input] = parseInt(data[input]);
					console.log(data);
					self.output.update(data);

				});
				$('.toggle').on('click', function(e) {
					var elem = $(e.target), data={};
					elem.toggleClass('onBlue');
					var input = elem.attr('name');
					data[input] = elem.hasClass('onBlue');
					self.output.update(data);
				});

			};

		Radb.View.tags = function(config)
		{
			this.field 		  = 'output_runner';
			this.tagList   	  = {};
			this.container    = config.el;
			this.view 		  = 'Formatting';
			this.output       = {};
			this.events();
		};
			Radb.View.tags.prototype.update = function(topic, data)
			{
				if (topic == 'output/selected') {
					this.output = data;
				}
				if (topic == 'field/selected') {
					this.output = data['output'];
					this.field = data['field'];
				}
				this.render();
			};
			Radb.View.tags.prototype.render = function(output)
			{
				this.container.empty();

				var finalTmpl = template('tags_' + this.field)();
				this.container.append(finalTmpl);
				this.events();
				return this;
			};
			Radb.View.tags.prototype.events = function()
			{
				var self = this;
				self.container.unbind();

				var alltags    = $('#allTags');
				var tag        = $('.tag');

				alltags.unbind();
				tag.unbind();

				tag.on('click', function(e) {
					var elem = $(e.target);
					var name = self.field;
					var tag = elem.text();
					var obj = {};
					obj[name] = tag;
					Radb.PubSub.publish('addTag', obj);
				});
			};


		Radb.View.tipsgrid = function(config, menus)
		{
			this.temp 		  = config.templates;
			this.field 		  = '';
			this.container    = config.el;
			this.output       = {};
			this.pubMenu      = menus['pubMenu'];
			this.panelMenu    = menus['panelMenu'];
			this.tipMenu      = menus['tipMenu'];
			this.publications = [];
			this.events();
		};
			Radb.View.tipsgrid.prototype.update = function(topic, data)
			{
				console.log(topic, data);
				if (topic == 'output/selected') {
					this.output = data;
				}
				if (topic == 'field/selected') {
					this.output = data['output'];
					this.field = data['field'];
				}

				this.render();
			};
			Radb.View.tipsgrid.prototype.render = function(output)
			{

				var self = this;
				self.output = output;
				self.container.empty();
				var finalTmpl = template('tipsgrid')();
				self.container.append(finalTmpl);

				self.pubMenu.render(self.output.publications);
				self.panelMenu.render(self.output.tipstersPanels.panels);
				self.tipMenu.render(self.output.tipsters.tipsters);

				var tipsters = output.panelTipsters.tipsters;
				if (tipsters)
					this.renderTipsterList(tipsters);

				self.events();
				return this;
			};
			Radb.View.tipsgrid.prototype.renderTipsterList = function(tipsters)
			{
				var finalTmpl  = '';
				var temp = _.template('<li data-id="<%= id %>" data-tipster="<%= name %>" data-arrayid="<%= index %>"><ul data-tipster="<%= name %>"><li><%= rank %></li><li><%= name %></li><li data-action="delete" class="delete">Delete</li></ul></li>');
				for (var i=0; i<tipsters.length; i++) {

					var params = {
						"name": tipsters[i].data.tipster,
						"rank": tipsters[i].data.rank,
						"id"  : tipsters[i].data.id,
						"index": i,
					};
					finalTmpl += temp(params);
				}
				$('.paneltipsters').empty().append(finalTmpl);

			};
			Radb.View.tipsgrid.prototype.events = function()
			{
				var self = this;

				var panelTipsters = $('#panelTipsters');
				panelTipsters.unbind();
				panelTipsters.sortable({
					'axis':"y",
					update: function( e, ui ) {
						var tipsterElems = $(e.target).children();
						var tipsorder = [];
						$.each(tipsterElems, function(i,e) {
							tipsorder.push($(e).data('id'));
						});
						self.output.panelTipsters.sort(tipsorder);

					}
				});
				panelTipsters.on('click', function(e) {
					var elem = $(e.target);
					var tipster = elem.parent().data('tipster');

					if (elem.data('action') == 'delete') {
						self.output.panelTipsters.deleteTipster(tipster);
						return;
					}
				});


				$('#newpanelbutton').unbind().on('click', function(e) {
					var elem = $(this).siblings('input');
					if (Radb.state.publication) {
						self.panelMenu.data.create(Radb.state.publication, elem.val());
					}
				});


			};



/*
------------------------------------------------
				MENUS
------------------------------------------------
*/


	// Portal groups and tips menus
	Radb.View.publicationMenu = function(config)
	{
		// this.temp 			 = config.template;
		this.menu            = null;
		this.publications 	 = null;
		this.containerEl     = config.el;
	};
		Radb.View.publicationMenu.prototype.update = function(topic, data)
		{
			if (topic == 'publications/reloaded') {
				this.data = data;
			}
			this.render();
		};
		Radb.View.publicationMenu.prototype.render = function(publications)
		{
			var self = this;
			self.publications = publications.publications;
			this.container = $('#'+this.containerEl);

			if (this.menu && typeof this.menu == 'object') {
				this.menu.empty();
			}
			var theList = [];

			if (publications) {

				for (var i=0;i<self.publications.length;i++) {
					theList.push( {
						'label': self.publications[i].data.groupname,
						'value': self.publications[i].data.groupid
					});
				}
			}

			this.menu = new Radb._listMenu({
						'parent' 		: this.container,
						'list' 			: theList,
						'defaultSelect' : {"label": 'publication'},
						'name' 			: 'portPubSelect'
			}).init().render();

		}

	Radb.View.tipstersMenu = function(config)
	{
		// this.temp 			 = config.template;
		this.data 			 = {};
		this.containerEl     = config.el;
	};
		Radb.View.tipstersMenu.prototype.update = function(topic, data)
		{
			if (topic == 'portalTipsters/reloaded') {
				this.data = data;
				this.render(this.data.tipsters);
			} else if (topic == 'tipster/remoteSelect') {
				Radb.state.tipster = data.name;
				this.menu.select(data.fullname);
				return;
			} else {
				this.render();
			}
		};
		Radb.View.tipstersMenu.prototype.render = function(tipsters)
		{
			if (!tipsters) return;

			var self = this;
			this.container = $('#'+this.containerEl);

			var theList = [];

			for (var i=0;i<tipsters.length;i++) {
				theList.push( {
					'label': tipsters[i].data.firstname + " " + tipsters[i].data.lastname,
					'value': tipsters[i].data.username
				});
			}

			if (this.menu && typeof this.menu == 'object') {
				this.menu.remove();
			}

			this.menu = new Radb._listMenu({
				'parent' 		: this.container,
				'list' 			: theList,
				'defaultSelect' : {"label": 'Tipsters'},
				'name' 			: 'portTipSelect',
			}).init().render();
		}

	Radb.View.tipstersPanelMenu = function(config)
	{
		this.data 			 = {};
		this.containerEl     = config.el;
	};
		Radb.View.tipstersPanelMenu.prototype.update = function(topic, data)
		{
			if (topic == 'portalTipsPanel/reloaded') {
				this.data = data;
				this.render(this.data.panels);
			} else if (topic == 'tipster/remoteSelect') {
				Radb.state.tipster = data.username;
				this.menu.select(data.fullname);
				return;
			} else {
				this.render();
			}
		};
		Radb.View.tipstersPanelMenu.prototype.render = function(panels)
		{
			var self = this;
			this.container = $('#'+this.containerEl);
			var theList = [];
			if (!panels) return;

			if (this.menu && typeof this.menu == 'object') {
				this.menu.remove();
			}

			for (var i=0;i<panels.length;i++) {
				theList.push( {
					'label': panels[i].data.name,
					'value': panels[i].data.id
				});
			}
			this.menu = new Radb._listMenu({
						'parent' 		: this.container,
						'list' 			: theList,
						'defaultSelect' : {"label": 'Panels'},
						'name' 			: 'portPanelSelect'
			}).init().render();
		}







	Radb.start = function()
	{
		Radb.state.page = 'outputs';

		$('html').click(function(e) {
			// e.preventDefault();
			$('.pulldown ul').hide();
			$('p.tooltip').remove();
		});

		// ***************************************
					// LOAD VIEWS
		// ***************************************
		Radb.publicationList_view = new Radb.View.publicationList({'template': template('publicationListTemp'), 'el': $('#publicationList')});
		Radb.PubSub.subscribe({
			'Radb.publicationList_view.update' : [ "publication/fetched",
										 		   "publication/deleted",
										 		   "output/refresh",
										 		   "publication/selectbyid",
										 		   "publication_market/selected"]
		});




		Radb.outputList_view = new Radb.View.outputList({'template': template('outputListTemp'), 'el': $('#outputList')});
		Radb.PubSub.subscribe({
			'Radb.outputList_view.update' : [ "output/fetched",
										 	  "output/deleted",
										 	  "output/selectbyid"]
		});


		Radb.outputRace_view = new Radb.View.outputRace({'template': template('outputRace'), 'el': $('#outputContent')});
		Radb.PubSub.subscribe({
			'Radb.outputRace_view.update' : [ "output/selected",
										 	  "addTag",
										 	  "publication/selected",
										 	  "outputTypeSelector/selected"]
		});


		Radb.outputTips_view = new Radb.View.outputTips({'template': template('outputTips'), 'el': $('#outputContent')});
		Radb.PubSub.subscribe({
			'Radb.outputTips_view.update' : [ "output/selected",
										 	  "addTag",
										 	  "publication/selected"]
		});


		Radb.format_view = new Radb.View.formatting({'templates': template('formatListTemp'), 'el': $('#formatList')});
		Radb.PubSub.subscribe({
			'Radb.outputTips_view.update' : [ "field/selected"]
		});


		Radb.tags_view = new Radb.View.tags({'el': $('#formatList')});
		Radb.PubSub.subscribe({
			'Radb.tags_view.update' : [ "field/selected"]
		});




		/*
		------------------------------------------------
						MENUS
		------------------------------------------------
		*/

		//  Publications
		Radb.publication_menu = new Radb.View.publicationMenu({'el': 'publicationMenuContainer'});
		Radb.PubSub.subscribe({
			'Radb.publication_menu.update' : [ "publications/reloaded"]
		});


		//  Tips Panels
		Radb.tipstersPanel_menu = new Radb.View.tipstersPanelMenu({'el': 'gridMenuContainer'});
		Radb.PubSub.subscribe({
			'Radb.tipstersPanel_menu.update' : [ "portalTipsPanel/reloaded"]
		});

		Radb.pubMarketMenu = new Radb.groupMenu({'el': 'marketSelect', 'name': 'publication_market', 'default': '98d58f70-69b3-4966-859b-b5bc2d2876cd'});
		Radb.PubSub.subscribe({
			'Radb.pubMarketMenu.update' : [ "groups/fetched", "publication/selected" ]
		});


		//  Tipsters
		Radb.tipsters_menu = new Radb.View.tipstersMenu({'el': 'tipsterMenuContainer'});
		Radb.PubSub.subscribe({
			'Radb.tipsters_menu.update' : [ "portalTipsters/reloaded",
										 	"tipster/remoteSelect"]
		});



		var menus = {'pubMenu': Radb.publication_menu, 'tipMenu': Radb.tipsters_menu, 'panelMenu': Radb.tipstersPanel_menu};
		Radb.tipsgrid_view = new Radb.View.tipsgrid({'templates': template('tipsgrid'), 'el': $('#formatList')}, menus);


		var views = {"formatting" : Radb.format_view, "tags": Radb.tags_view, "tipsgrid": Radb.tipsgrid_view};
		Radb.formatCollection_view = new Radb.View.Format_view_collection({"parent": "formattingColumn"}, views);
		Radb.PubSub.subscribe({
			'Radb.formatCollection_view.update' : [ "output/selected",
										 	  		"portalPublications/fetched",
										 	  		"portalTipsters/reloaded",
										 	  		"portalTipsPanel/reloaded",
										 	  		"panelTipsters/reloaded"]
		});





		// // ***************************************
		// 			// LOAD COLLECTIONS
		// // ***************************************

		Radb.publication_col = new Radb.Collection.publication(Radb.Model.publication);
		Radb.PubSub.subscribe({
			'Radb.publication_col.update' : [ "publication/deleted",
										 	  "publication/added",
										 	  "publication/updated",
										 	  "publication_tz/selected"]
		});


		Radb.output_col = new Radb.Collection.output(Radb.Model.output);
		Radb.PubSub.subscribe({
			'Radb.output_col.update' : [ "output/deleted",
										 "output/added",
										 "output/updated",
										 "publication/selected"]
		});

		Radb.groups_col = new Radb.Groups(Radb._Model);
		Radb.groups_col.fetch();


		//  Portal Publications
		Radb.portalPublications = new Radb.Collection.PortalPublications(Radb.Model.portal_publication);


		// //  Portal Tipsters
		Radb.portalTipsters = new Radb.Collection.PortalTipsters({'resource':'portal/tipsters'});
		Radb.PubSub.subscribe({
			'Radb.portalTipsters.update' : [ "portPubSelect/selected", "update_state"]
		});



		// //  Tips panels
		Radb.tipsPanel = new Radb.Collection.tipsPanel({'resource':'tipspanel'});
		Radb.PubSub.subscribe({
			'Radb.tipsPanel.update' : [ "portPubSelect/selected", "update_state"]
		});


		// //  Tips panels Tipsters
		Radb.panelTipsters = new Radb.Collection.PanelTipsters({'resource':'tipspanel'});
		Radb.PubSub.subscribe({
			'Radb.panelTipsters.update' : [ "portPanelSelect/selected",
										 	"portTipSelect/selected",
										 	"update_state"]
		});

		Radb.publication_col.fetch();
		Radb.portalPublications.fetch();
		Radb.formatCollection_view.render();
		// Radb.PubSub.print();
	}



	Function.prototype.clone = function() {
	    var that = this;
	    var temp = function temporary() { return that.apply(this, arguments); };
	    for(var key in this) {
	        if (this.hasOwnProperty(key)) {
	            temp[key] = this[key];
	        }
	    }
	    return temp;
	};


		function pasteHtmlAtCaret(html)
		{
		    var sel, range;
		    if (window.getSelection) {
		        // IE9 and non-IE
		        sel = window.getSelection();
		        if (sel.getRangeAt && sel.rangeCount) {
		            range = sel.getRangeAt(0);
		            range.deleteContents();

		            // Range.createContextualFragment() would be useful here but is
		            // only relatively recently standardized and is not supported in
		            // some browsers (IE9, for one)
		            var el = document.createElement("div");
		            el.innerHTML = html;
		            var frag = document.createDocumentFragment(), node, lastNode;
		            while ( (node = el.firstChild) ) {
		                lastNode = frag.appendChild(node);
		            }
		            range.insertNode(frag);
		            // Preserve the selection
		            if (lastNode) {
		                range = range.cloneRange();
		                range.setStartAfter(lastNode);
		                range.collapse(true);
		                sel.removeAllRanges();
		                sel.addRange(range);
		                return range;
		            }

		        }
		    }
		}


		function deleteTag(start)
		{
			var newEnd = start.parentNode;
			var newRange = document.createRange();
			newRange.setStart(start.parentNode.nextSibling, 0);
			newRange.setEnd(newEnd, 0);
			newRange.deleteContents();
			newEnd.removeChild(start);
		}
		function placeHTML_before(range, html)
		{
			var sel = window.getSelection();
			var parent = range.endContainer.parentNode;
			range.setStartBefore(parent);
	        range.selectNode(parent.previousSibling);
	        range.collapse(true);
	        sel.removeAllRanges();
			sel.addRange(range);
			pasteHtmlAtCaret(html);
		}
		function placeHTML_after(range, html)
		{
			var sel = window.getSelection();
			var parent = range.endContainer.parentNode;
			range.setStartAfter(parent);
	        range.selectNode(parent.nextSibling);
	        range.collapse(true);
	        sel.removeAllRanges();
			sel.addRange(range);
			pasteHtmlAtCaret(html);
		}
		function placeSpan_after(parent, range, charStr)
		{
			var sel = window.getSelection();
			var parentEl = document.createElement("span");
			parentEl.appendChild(range.createContextualFragment(charStr));
		    range.setStartAfter(parent);
		    range.insertNode(parentEl);
		    if (parentEl.nextSibling) {
				range.selectNode(parentEl.nextSibling);
		    } else {
		    	range.setStartAfter(parentEl);
		    }
		    range.collapse(true);
		    sel.removeAllRanges();
			sel.addRange(range);
		}
		function placeSpan_before(parent, range, charStr)
		{
			var sel = window.getSelection();
			var parentEl = document.createElement("span");
			parentEl.appendChild(range.createContextualFragment(charStr));
		    range.setStartBefore(parent);
		    range.insertNode(parentEl);
		    range.selectNode(parentEl.nextSibling);
		    range.collapse(true);
		    sel.removeAllRanges();
			sel.addRange(range);
		}
		function pasteHtmlAtCaret_withRange(html, range)
		{
	        // range = sel.getRangeAt(0);
	        range.deleteContents();

	        var el = document.createElement("div");
	        el.innerHTML = html;
	        var frag = document.createDocumentFragment(),
	        	node,
	        	lastNode;
	        while ( (node = el.firstChild) ) {
	            lastNode = frag.appendChild(node);
	        }
	        range.insertNode(frag);

	        // Preserve the selection
	        // if (lastNode) {
	        // 	console.dir(lastNode);
	        // 	var sel = window.getSelection();
	        //     range = range.cloneRange();
	        //     range.setStartAfter(lastNode);
	        //     range.collapse(true);
	        //     sel.removeAllRanges();
	        //     sel.addRange(range);
	        //     console.log(sel.getRangeAt(1));
	        // }
	        return range;
		}
		function insertTextAtCursor(text)
		{
		    var sel, range, html;
		    if (window.getSelection) {
		        sel = window.getSelection();
		        if (sel.getRangeAt && sel.rangeCount) {
		            range = sel.getRangeAt(0);
		            range.deleteContents();
		            range.insertNode( document.createTextNode(text) );
		        }
		    } else if (document.selection && document.selection.createRange) {
		        document.selection.createRange().text = text;
		    }
		}
		function insertTextAtCursor_withRange(text, range)
		{
			if (!range) return;
			range.deleteContents();
			range.insertNode( document.createTextNode(text) );
		}
		function getCursor(text)
		{
		    var sel, range, html;
		    if (window.getSelection) {
		        sel = window.getSelection();
		        var range = sel.getRangeAt(0);
		        return range;
		    }
		    return false;
		}
		function getCaretCharacterOffsetWithin(element) {
		    var caretOffset = 0;
		    // element = element[0]
		    var doc = element.ownerDocument || element.document;

		    var win = doc.defaultView || doc.parentWindow;
		    var sel;
		    if (typeof win.getSelection != "undefined") {
		        sel = win.getSelection();
		        if (sel.rangeCount > 0) {
		            var range = win.getSelection().getRangeAt(0);
		            var preCaretRange = range.cloneRange();
		            preCaretRange.selectNodeContents(element);
		            preCaretRange.setEnd(range.endContainer, range.endOffset);
		            caretOffset = preCaretRange.toString().length;
		        }
		    } else if ( (sel = doc.selection) && sel.type != "Control") {
		        var textRange = sel.createRange();
		        var preCaretTextRange = doc.body.createTextRange();
		        preCaretTextRange.moveToElementText(element);
		        preCaretTextRange.setEndPoint("EndToEnd", textRange);
		        caretOffset = preCaretTextRange.text.length;
		    }

		    return caretOffset;
		}
	    function setCaretPosition(element, offset) {
	        var range = document.createRange();
	        var sel = window.getSelection();
	        // element = element[0];
	        //select appropriate node
	        var currentNode = null;
	        var previousNode = null;

	        for (var i = 0; i < element.childNodes.length; i++) {
	            //save previous node
	            previousNode = currentNode;

	            //get current node
	            currentNode = element.childNodes[i];
	            //if we get span or something else then we should get child node
	           while(currentNode.childNodes.length > 0){
	              currentNode = currentNode.childNodes[0];
	           }

	            //calc offset in current node
	            if (previousNode != null) {
	                offset -= previousNode.length;
	            }
	            //check whether current node has enough length
	            if (offset <= currentNode.length) {
	                break;
	            }
	        }
	        //move caret to specified offset
	        if (offset > currentNode.length) offset = currentNode.length -1;

	        if (currentNode != null) {
	            range.setStart(currentNode, offset);
	            range.collapse(true);
	            sel.removeAllRanges();
	            sel.addRange(range);
	        }
	    }



	// function selectText(element)
	// {
	//     var doc  = document,
	//         text = element,
	//         range, selection;
	//     if (doc.body.createTextRange) { //ms
	//         range = doc.body.createTextRange();
	//         range.moveToElementText(text);
	//         range.select();
	//     } else if (window.getSelection) { //all others
	//         selection = window.getSelection();
	//         range = doc.createRange();
	//         range.selectNodeContents(text);
	//         selection.removeAllRanges();
	//         selection.addRange(range);
	//     }
	// }


});

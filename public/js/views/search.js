(function()
{
	'use strict';


	Radb.View.search = function(model, config)
	{
		this.model 			 = model;
		this.containertemp	 = config.template;
		this.temp 		     = template('search_item');
		this.data 			 = {};
		this.selected 		 = null;
		this.visited		 = [];
		this.container       = config.el;
		this.subscriptions = Radb.PubSub.subscribe({
			'Radb.search_view.listener' : ["search/maximize", "search/fetched"]
		});
		this.mainEvent();
	};
		Radb.View.search.prototype.listener = function(topic, data)
		{
			console.log(topic);
			if(topic === 'search/maximize') {
				this.render();
			}
		};
		Radb.View.search.prototype.clear = function()
		{
			this.container.empty();
		};
		Radb.View.search.prototype.render = function()
		{
			var self = this;
			var resCount  = this.data.length;
			var finalTmp = '';
			if (resCount === 0 ) {
				// self.container.empty().append('<div class="noScheduleData">No data</div>');
				return;
			}

			if ($('#search_result').length == 0) {
				this.container.append(self.containertemp());
			}

			for (var i=0;i<self.data.length;i++) {
				self.data[i].arrayid = i;
				self.data[i].visited = (self.visited.indexOf(i) > -1) ? "visited" : "";
				finalTmp += self.temp(self.data[i]);
			}
			$('#search_results').empty().append(finalTmp);
			this.events();
			return true;
		};
		Radb.View.search.prototype.select = function(elem)
		{
			$('.race_data').removeClass('raceSelect');
			elem.addClass('raceSelect');
		};
		Radb.View.search.prototype.mainEvent = function()
		{
			var self = this;
			$('#meetingsearch').onEnter(function(e) {
				var elem = $(e.target);
				self.model.search = elem.val();

				if (!self.model.search) {return;}
				self.model.fetch(false).done(function(r) {
					console.log(r);
					self.data=r.data;
					self.visited = [];
					$('#minified').css('visibility', 'hidden');
					self.render();
				});
			});
		};
		Radb.View.search.prototype.minimize = function()
		{
			var elem = $('#search_result');
			var clone = elem.clone();
			elem.remove();
			$('#minified').css('visibility', 'visible');
		};
		Radb.View.search.prototype.events = function()
		{
			var self = this;

			$('.search_result button').unbind().on('click', function(e) {
				var elem = $(e.target);
				if (elem.text() == 'Close') {
					self.visited = [];
					$('#search_result').remove();
				} else {
					self.minimize();
				}
			});
			$('ul.searchresults').unbind().on('click', function(e) {
				var elem = $(e.target);
				var info = elem.closest('ul.searchitem');
				var id = info.data('id');
				var type = info.data('type');
				var arrayid = info.data('arrayid');
				self.visited.push(arrayid);
				Radb.PubSub.publish('resource/updated', self.data[arrayid]);
				self.minimize();
			});
		};

})();

(function()
{
	'use strict';



	Acme.View.portal = Acme.View.create(
	{
		"temp" 			: {
			'main' 			: template('portalData'),
			'bests' 		: template('portalbests'),
			'publications' 	: template('portalpublications'),
		},
		"container" 	: {
			'main' 			: $('#portalMeeting'),
			'bests' 		: 'bestlist',
			'tips'  		: 'tips',
			'publications' 	: $('#publicationsList')
		},
		"listeners"     : {
			"portalmeeting" : function(data) {
				if (data.portalmeeting == null) {
					this.clear();
					return;
				}
				this.meeting = data.portalmeeting;
				this.render();
			},
			"clickEvent" : function(data) {
				if (data.clickEvent == 'meeting') {
					this.clear();
				}
			},

		}
	});
		Acme.View.portal.filterpub       = null;
		Acme.View.portal.filterrunners 	 = false;
		Acme.View.portal.filtertips 	 = false;
		Acme.View.portal.$bestscontainer = Acme.View.portal.container.bests;
		Acme.View.portal.$tipscontainer  = Acme.View.portal.container.tips;
		Acme.View.portal.$pubscontainer	 = Acme.View.portal.container.publications;
		Acme.View.portal.container 		 = Acme.View.portal.container.main;
		Acme.View.portal.subscriptions   = Acme.PubSub.subscribe({
			'Acme.View.portal.listener' : ["meeting/portalupdated", "state_changed"]
		});


	// Acme.View.portal = function(config)
	// {
		// this.mainTemp        = config.templates.main;
		// this.maincontainer   = config.containers.main;
		// this.bestsTemp       = config.templates.bests;
		// this.bestscontainer  = config.containers.bests;
		// this.tipscontainer   = config.containers.tips;
		// this.pubscontainer   = config.containers.publications;
		// this.data 			 = {};
		// this.view   		 = 'portal';
		// this.filterpub       = null;
		// this.filterrunners 	 = false;
		// this.filtertips 	 = false;
		// Acme.View.portal.subscriptions = Acme.PubSub.subscribe({
		// 	'Acme.portal_view.listener' : ["meeting/portalupdated", "state_changed"]
		// });
		// this.listeners = {
		// 	"currentmeeting" : function(data) {
		// 		if (data.currentmeeting != null) {
		// 			this.render();
		// 			return;
		// 		}
		// 	},
		//
		//
		// }

		// Acme.View.portal.prototype.listener = function(topic, data)
		// {
		// 	console.log(topic, data);
		// 	if (topic == 'meeting/portalupdated')
		// 	{
		// 		this.data = data.data;
		// 		this.render();
		// 	}
		// 	// if (topic == 'meeting/selected')
		// 	// {
		// 	// 	this.clear();
		// 	// 	this.filterpub       = null;
		// 	// 	this.filterrunners 	 = false;
		// 	// 	this.filtertips 	 = false;
		// 	// }
		// };
		// Acme.View.portal.prototype.clear = function()
		// {
		// 	this.maincontainer.empty();
		// };
		Acme.View.portal.render = function()
		{
			var self = this;
			console.log(self);

			self.container.empty().append(self.template.main);
			var bests = this.meeting.data.portal;

			var races = this.meeting.data.races;
			var bestsTmpl = "";
			var publications = Object.keys(bests);

			for(var i=0; i<races.length;i++) {
				var portal = races[i].portal;
				for (var publication in portal) {
					if( portal.hasOwnProperty( publication ) ) {
						if (publications.indexOf(publication) === -1) {
							publications.push(publication);
						}
					}
				}
				var runners = races[i].runners;
				for(var k=0; k<runners.length;k++) {
					var runnerportal = runners[k].portal;
					for (var publication in runnerportal) {
						if( runnerportal.hasOwnProperty( publication ) ) {
							if (publications.indexOf(publication) === -1) {
								publications.push(publication);
							}
						}
					}

				}
			}

			for (var pub=0;pub<publications.length;pub++) {
			  	if( bests.hasOwnProperty( publications[pub] ) ) {
					if (self.filterpub && self.filterpub != publications[pub]) {continue;}

					bestsTmpl += '<p class="publication">'+ publications[pub] + '</p>';
					bestsTmpl += '<div class="tipsList">';

					for (var tipster in bests[publications[pub]]) {
						if( bests[publications[pub]].hasOwnProperty( tipster ) ) {
							if (self.filtertipster && self.filtertipster != tipster) {continue;}

				  			var tips = _.filter(bests[publications[pub]][tipster]['bests'], function(tip) {
				  				if (tip.name !== null) return tip;
				  			});
				  			if (tips.length > 0) {
								bestsTmpl += '<ul class="p_tipster"><p class="tipster">'+ tipster.replace(/_/, ' ') + '</p>';

								for (var i=0; i<tips.length; i++) {
									var scrClass = (tips[i].scratched) ? 'scratchedTip' : '';
									var params = {
										"name"		: tips[i].name,
										"number" 	: tips[i].number,
										"scratched" : scrClass
 									};
									bestsTmpl += self.template.bests(params);
						  		}
								bestsTmpl += '</ul>';
							}

					  	}
			  		}
			  		bestsTmpl += '</div>';
			  	}
			}

			$('#' + self.$bestscontainer).append(bestsTmpl);






			var tipsTmpl = '';

			for(var i=0; i<races.length;i++) {
				var portal = races[i].portal;
				var raceno = i+1;
				tipsTmpl += '<h3 class="p_race">Race ' + raceno + '</h3>';

				for (var pub=0;pub<publications.length;pub++) {

					if( portal.hasOwnProperty( publications[pub] ) ) {

						if (self.filterpub && self.filterpub != publications[pub]) {continue;}


						tipsTmpl += '<p class="publication">'+ publications[pub] + '</p>';
						tipsTmpl += '<div class="tipsList">';

						for (var tipster in portal[publications[pub]]['tips']) {
							if( portal[publications[pub]]['tips'].hasOwnProperty( tipster ) ) {

								if (self.filtertips || (self.filtertipster && self.filtertipster != tipster)) {continue;}


								tips = portal[publications[pub]]['tips'][tipster];
								tipsTmpl += '<ul class="p_tipster"><p class="tipster" title="@#">'+ tipster.replace(/_/, ' ') + '</p>';
								var last = null;
								for (var j=0; j<tips.length; j++) {
									var scrClass = (tips[j].scratched) ? 'scratchedTip' : '';
									var time = moment( tips[j].created.substr(0,19), 'YYYY-MM-DD HH:mm:ss' );
									if (last === null || last.isBefore(time)) {
										last = time;
									}

									var params = {
										"name"		: tips[j].name,
										"number" 	: tips[j].rank,
										"scratched" : scrClass
									};

									tipsTmpl += self.template.bests(params);
								}
								tipsTmpl = tipsTmpl.replace('@#', last.fromNow());
								tipsTmpl += '</ul>';
							}
						}

						tipsTmpl += '</div><div class="p_comment">';
						var comment = portal[publications[pub]]['comment'] || '';
						if (!self.filtertipster && !self.filterrunners && comment) {
							tipsTmpl += '<p class="p_comment">'+ comment + '</p>';
						}
					}




					if (!self.filtertipster && !self.filterrunners) {
						var runners = races[i].runners;
						for(var k=0; k<runners.length;k++) {

							var rportal = runners[k].portal;

							if( rportal.hasOwnProperty( publications[pub] ) ) {
								if (self.filterpub && self.filterpub != publications[pub]) {continue;}

								if (rportal.length !== 0 && rportal.hasOwnProperty(publications[pub])) {
									// var market = (rportal[publications[pub]].market) ? '<span class="p_market">'+ rportal[publications[pub]].market + '</span>': '';
									var rclass = (rportal[publications[pub]].class) ? '<span class="p_market">'+ rportal[publications[pub]].class + '</span>': '<span class="p_market"></span>';
									var rating = (rportal[publications[pub]].rating) ? '<span class="p_market">'+ rportal[publications[pub]].rating + '</span>': '<span class="p_market"></span>';
									var comment = (rportal[publications[pub]].comment) ? rportal[publications[pub]].comment : '';

									tipsTmpl += '<div><p class="p_runner">' + rating + runners[k].name + ' ' + rclass + '</p>';
									tipsTmpl += '<p class="p_runner_comment">'+ comment + '</p></div>';
								}
							}

							tipsTmpl += '</div>';
						}
					}
				}
			}
			// console.log(tipsTmpl);
			$('#' + self.$tipscontainer).append(tipsTmpl);

			var pubTmpl = '';

			for (var pub=0;pub<publications.length;pub++) {
				var selected = '';
				if (publications[pub] === self.filterpub) {selected = ' selected';}
				pubTmpl += '<label class="p_publist'+selected+'">' + publications[pub] + '</label>'
			}

			self.$pubscontainer.empty().append(pubTmpl)

			this.events();

			return true;
		};
		Acme.View.portal.events = function()
		{
			var self = this;



			$('.toggleRunners').unbind().on("click", function(e) {
				e.preventDefault();
				self.filterrunners = !self.filterrunners;
				$(e.target).toggleClass('selected');
				self.render();
			});

			$('.toggleTips').unbind().on("click", function(e) {
				e.preventDefault();
				self.filtertips = !self.filtertips;
				$(e.target).toggleClass('selected');
				self.render();
			});


			$('.p_publist').unbind().on('click', function(e) {
				self.filterpub = e.target.innerHTML;
				self.filtertipster = null;
				self.render();
			});
			$('p.tipster').unbind().on('click', function(e) {
				self.filtertipster = e.target.innerHTML.replace(/ /g, '_');
				self.render();
			});
			$('p.tipster').tooltip();

		};


})();

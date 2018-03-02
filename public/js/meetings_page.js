(function()
{
	'use strict';

	var pageEvents = function()
	{
		var self = this;

		$('html').on('click', function(e) {
			// e.preventDefault();
			$('.pulldown ul').hide();
			$('p.tooltip').remove();
			var meetsearch = $('#meetingsearch');
			var meetfilter = $('#meetingfilter');
			// if (!meetsearch.val()) {
			// 	meetsearch.animate({
			// 		'width' : '0'
			// 	});
			// }
			// if (!meetfilter.val()) {
			// 	meetfilter.animate({
			// 		'width' : '0'
			// 	});
			// }
		});
		$('html').on('mouseup', function(e) {
			$('body').off('mousemove');
		});

		$('.openPortal').on("click", function(e) {
			e.preventDefault();
			Acme.effects.leftPaneToggle('portal');
		});

		// $('#searchicon').on('click', function(e) {
		// 	e.stopPropagation();
		// 	var box = $(this).siblings('input');
		// 	box.animate({'width': '180px'});
		// 	box.focus();
		// });

		// $('#meetingsearch').on({
		// 	search: function(e) {
		// 		if (!this.value) {
		// 			$(this).animate({
		// 				'width' : '0'
		// 			});
		// 		}
		// 	},
		// 	click: function(e) {
		// 		e.stopPropagation();
		// 	}
		// });

		$('.right-side-panel_tabs').on("mousedown", function(e) {
			var start  = window.outerWidth;
			var box    = $('#right-side-panel');
			var moving = false;
			$('body').on("mousemove", function(f) {
				var position = f.pageX;
				box.css({
					'width': start - position + 'px',
					'left' : position + 20,
				});
				if (start - position < 1 && moving == true) {
					$('body').off('mousemove');
				}
				moving = true;
			});

			$('.right-side-panel_tabs').on("mouseup", function(f) {
				$('body').off('mousemove');
			});


			e.preventDefault();
		});



		$('#topNav a.searchpanel').on('click', function(e) {
			e.preventDefault();
			var elem = $(e.target);
			if(elem.is('p')) {
				elem = elem.parent();
			}
			var srch = $('#search');
			var cont = $('#container');
			if (elem.text().trim() == 'Search' && !srch.hasClass('searchon')) {
				e.preventDefault();
				srch.addClass('searchon');
				cont.addClass('containerDown');
				$('#meetingsearch').focus();
			} else if (elem.text().trim() == 'Search' && srch.hasClass('searchon')) {
				e.preventDefault();
				srch.removeClass('searchon');
				cont.removeClass('containerDown');
			}
		});

		$('#minified').on('click', function(e) {
			$(this).css('visibility', 'hidden');
			Acme.PubSub.publish('search/maximize');
		});

		$('.meeting_list_tabs').unbind().on('click', function(e) {
			Acme.state.meeting = null;
			var elem = $(e.target);
			if (elem.is('li')) {
				var label = elem.text();
				if (label === 'Load') {
					localStorage['context'] = 'load';
					Acme.render_load();
					Acme.load_col.fetch();
				} else {
					localStorage['context'] = 'meetings';
					Acme.render_meetings();
					Acme.PubSub.publish('load_from_url');
				}
			}
		});
	};


	Acme.start = function()
	{

		$('#searchHead').html(template('searchPanel'));
		// $('#meetingFilter').html(template('meetingFiltertmpl'));



		// ***************************************
					// LOAD VIEWS
		// ***************************************


		//  SEARCH
		Acme.search_view = new Acme.View.search(Acme.Model.search, {'template': template('search_result_tmpl'), 'el': $('body')});

		// FILTER
		// Acme.filter = new Acme.View.filter();

		//  MEETINGS
		// Acme.meeting_view = new Acme.View.meetings({'template': template('meetingList'), 'el': $('.meetingsList')});

		//  MEETINGS
		// Acme.selected_meeting_view = new Acme.View.meeting({'template': template('meeting_top'), 'el': '.meeting-info'});



		//  LOAD
		// Acme.load_view    = new Acme.View.load({'template': template('loadList'), 'el': $('.meetingsList')});
		// Acme.load_history = new Acme.View.load_history({'template': template('meetingHistory'), 'el': '#historyData'});
		// Acme.load_source  = new Acme.View.load_source({'template': template('meetingSource'), 'el': '#sourceData'});
		// Acme.load_feed    = new Acme.View.load_feed({'template': template('load-box'), 'el': '#importBox'});
		// Acme.source_feed  = new Acme.View.load_diff({'template': template('source-feed'), 'el': '#importBox'});


		// FEEDS
		// Acme.feed = new Acme.Feed.load();

		//  RACES
		// Acme.race_list_view = new Acme.View.race({'el': '#raceList'});

		//  RUNNERS
		// Acme.runners_view = new Acme.View.runners({'el': '.runnersList'});


   		// Acme.track_view = new Acme.View.track({
					// 							'templates': {
					// 								'trackPage' : template('trackListPage'),
					// 								'tracks' 	: template('trackListTemp'),
					// 								},
					// 							'containers': {
					// 								'main' : '#rightside',
					// 								'tracks' : '#trackList'
					// 							}
					// 						});



		// // ***************************************
		// // 				COLLECTIONS
		// // ***************************************


		// Acme.meeting_col 	= new Acme.Collection.meetings(	Acme.Model.meeting);
		// Acme.races_col 		= new Acme.Collection.races(	Acme.Model.race);
		// Acme.runners_col 	= new Acme.Collection.runners(	Acme.Model.runner);
		// Acme.load_col 		= new Acme.Collection.load(		Acme.Model.loadModel);
		// Acme.groups_col  	= new Acme.Groups(				Acme._Model);
		// Acme.track_col 		= new Acme.Collection.track(	Acme.Model.track);
		// Acme.PubSub.subscribe({
		// 	'Acme.track_col.update' : [  "track/needed",
		// 								 "track/added",
		// 								 "track/deleted",
		// 								 "track/updated",
		// 								 "track_tz/selected",
		// 							 	 "track_state/selected"]
		// });



		// // ***************************************
		// // 				MENUS
		// // ***************************************


		//  Divs states
		// Acme.resultsStatesMenu_view = new Acme.resultsStateMenu({'el': 'stateSelect'});


		//  Groups
		// Acme.groupMenu_view = new Acme.groupMenu({'el': 'groupSelectTop', 'default': '39c02f98-d579-415f-8da7-a952ade3668a'});
		// Acme.PubSub.subscribe({
		// 	'Acme.groupMenu_view.update' : [ "groups/fetched", "meeting/selected", "state_changed"]
		// });

		// console.log(Acme.state);

		//  Users
		// Acme.userMenu_view = new Acme.userMenu({'el': 'userSelectTop', 'default': Acme.state.user});
		// Acme.PubSub.subscribe({
		// 	'Acme.userMenu_view.update' : [ "group/selected"]
		// });



		// ***********************************************************
		//
		//    ------   --------      ^       |----\     --------
		//    |			   |       /   \     |     |		|
		//    ------	   |      /-----\    |    /		    |
		//        	|      |     /	     \   |    \		    |
		//     _____|      |    /	      \  |     \		|
		//
		// ***********************************************************

		// var renderFunc = 'render_meetings';
		// if (localStorage['context']) {
		// 	renderFunc = 'render_' + localStorage['context'];
		// }
		// console.log(localStorage['context']);
		// Acme[renderFunc]();

		// Gets the ball rolling
		Acme.PubSub.publish('load_from_url');

		pageEvents();
	}




	function compare(a,b)
	{
		if (a < b)
			return -1;
		if (a.data.track > b.data.track)
			return 1;
		return 0;
	}

})();

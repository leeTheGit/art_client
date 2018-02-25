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
			Radb.effects.leftPaneToggle('portal');
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
			Radb.PubSub.publish('search/maximize');
		});

		$('.meeting_list_tabs').unbind().on('click', function(e) {
			Radb.state.meeting = null;
			var elem = $(e.target);
			if (elem.is('li')) {
				var label = elem.text();
				if (label === 'Load') {
					localStorage['context'] = 'load';
					Radb.render_load();
					Radb.load_col.fetch();
				} else {
					localStorage['context'] = 'meetings';
					Radb.render_meetings();
					Radb.PubSub.publish('load_from_url');
				}
			}
		});
	};


	Radb.start = function()
	{

		$('#searchHead').html(template('searchPanel'));
		$('#meetingFilter').html(template('meetingFiltertmpl'));



		// ***************************************
					// LOAD VIEWS
		// ***************************************


		//  SEARCH
		Radb.search_view = new Radb.View.search(Radb.Model.search, {'template': template('search_result_tmpl'), 'el': $('body')});

		// FILTER
		Radb.filter = new Radb.View.filter();

		//  MEETINGS
		Radb.meeting_view = new Radb.View.meetings({'template': template('meetingList'), 'el': $('.meetingsList')});

		//  MEETINGS
		// Radb.selected_meeting_view = new Radb.View.meeting({'template': template('meeting_top'), 'el': '.meeting-info'});



		//  LOAD
		Radb.load_view    = new Radb.View.load({'template': template('loadList'), 'el': $('.meetingsList')});
		Radb.load_history = new Radb.View.load_history({'template': template('meetingHistory'), 'el': '#historyData'});
		Radb.load_source  = new Radb.View.load_source({'template': template('meetingSource'), 'el': '#sourceData'});
		Radb.load_feed    = new Radb.View.load_feed({'template': template('load-box'), 'el': '#importBox'});
		Radb.source_feed  = new Radb.View.load_diff({'template': template('source-feed'), 'el': '#importBox'});


		// FEEDS
		Radb.feed = new Radb.Feed.load();

		//  RACES
		Radb.race_list_view = new Radb.View.race({'el': '#raceList'});

		//  RUNNERS
		Radb.runners_view = new Radb.View.runners({'el': '.runnersList'});


   		Radb.track_view = new Radb.View.track({
												'templates': {
													'trackPage' : template('trackListPage'),
													'tracks' 	: template('trackListTemp'),
													},
												'containers': {
													'main' : '#rightside',
													'tracks' : '#trackList'
												}
											});



		// // ***************************************
		// // 				COLLECTIONS
		// // ***************************************


		Radb.meeting_col 	= new Radb.Collection.meetings(	Radb.Model.meeting);
		Radb.races_col 		= new Radb.Collection.races(	Radb.Model.race);
		Radb.runners_col 	= new Radb.Collection.runners(	Radb.Model.runner);
		Radb.load_col 		= new Radb.Collection.load(		Radb.Model.loadModel);
		Radb.groups_col  	= new Radb.Groups(				Radb._Model);
		Radb.track_col 		= new Radb.Collection.track(	Radb.Model.track);
		Radb.PubSub.subscribe({
			'Radb.track_col.update' : [  "track/needed",
										 "track/added",
										 "track/deleted",
										 "track/updated",
										 "track_tz/selected",
									 	 "track_state/selected"]
		});



		// // ***************************************
		// // 				MENUS
		// // ***************************************


		//  Divs states
		Radb.resultsStatesMenu_view = new Radb.resultsStateMenu({'el': 'stateSelect'});


		//  Groups
		Radb.groupMenu_view = new Radb.groupMenu({'el': 'groupSelectTop', 'default': '39c02f98-d579-415f-8da7-a952ade3668a'});
		Radb.PubSub.subscribe({
			'Radb.groupMenu_view.update' : [ "groups/fetched", "meeting/selected", "state_changed"]
		});

		// console.log(Radb.state);

		//  Users
		Radb.userMenu_view = new Radb.userMenu({'el': 'userSelectTop', 'default': Radb.state.user});
		Radb.PubSub.subscribe({
			'Radb.userMenu_view.update' : [ "group/selected"]
		});



		// ***********************************************************
		//
		//    ------   --------      ^       |----\     --------
		//    |			   |       /   \     |     |		|
		//    ------	   |      /-----\    |    /		    |
		//        	|      |     /	     \   |    \		    |
		//     _____|      |    /	      \  |     \		|
		//
		// ***********************************************************

		var renderFunc = 'render_meetings';
		if (localStorage['context']) {
			renderFunc = 'render_' + localStorage['context'];
		}
		
		Radb[renderFunc]();

		// Gets the ball rolling
		// Radb.PubSub.publish('load_from_url');

		// Radb.groups_col.fetch();

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

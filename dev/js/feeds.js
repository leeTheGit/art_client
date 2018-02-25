(function() 
{
	'use strict';

/*
------------------------------------------------
				FEEDS
------------------------------------------------
*/

	Radb.Feed.load = function(config)
	{
		this.loadid 		= '';
		this.subscriptions	= Radb.PubSub.subscribe({ 
			'Radb.feed.update' : [ "load/import"]
		});

	};

		Radb.Feed.load.prototype.url = function(type)
		{
			return 'load/' + this.loadid;
		};

		Radb.Feed.load.prototype.update = function(topic, data)
		{
			this.loadid 	= data.meeting;

			var temp = [];
			var lines = data.text.split('\n');
			for (var i=0; i < lines.length; i++) {
				temp.push(lines[i].trim());
			}

			var text = temp.join('\n');
			// text = text.replace(/[\ ]+/g, ' ');
			// text = text.replace(/[\ ]+/g, ' ');
			text = text.replace(/^[\ ]+/g, '');
			text = text.replace(/^(\r\n|\n|\r)/gm,"");

			return Radb.server.create(this.url('feed'), this[data.feed](text))
			.done(function(r) {

				if (r.data === false) {
					Radb.effects.message('There was a problem loading this feed!');
				} else {
					Radb.effects.message('Feed loaded! ');
					Radb.PubSub.publish('load/loaded', r);
				}
			});
		};

		Radb.Feed.load.prototype.market = function(text)
		{
			var content		= {'races': []};

			var numbers 	= { 'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5, 'SIX': 6, 'SEVEN': 7, 'EIGHT': 8, 'NINE': 9, 'TEN': 10, 'ELEVEN': 11, 'TWELVE': 12 }

			var raceRegex 	= /Race ([A-Za-z]+) (?:.+)?\n((?:[0-9.]+ [A-Z].+\n)+)/g;
			var horseRegex 	= /(.+)\n/g;

			var raceFind;
			var horseFind;

			var separateHorses = function(line, array) {
				var lineRegex = /([0-9.]+) ((?:[A-Z].+\n)+)/g;
				var lineFind;
				while (lineFind = lineRegex.exec(line)) {
					var horses = lineFind[2].split(',');
					for (var i=0; i < horses.length; i++) {
						array.push({runnername: horses[i].trim(), price: lineFind[1]});
					};
				}

				return array;
			}

			while (raceFind = raceRegex.exec(text)) {
				var runners = [];

				while (horseFind = horseRegex.exec(raceFind[2])) {
					runners = separateHorses(horseFind, runners);
				}

				content.races.push({racenumber: numbers[raceFind[1].toUpperCase()], content: runners, feed: 'market' });
			}

			return {'type': 'Market', 'data': content, 'feed': 'feed'};
		}

		Radb.Feed.load.prototype.tab_fixed = function(text)
		{
			var content		= {'races': []};

			var raceRegex 	= /Race ([0-9]+)(?:.+)?\n((?:[0-9.]+ [A-Z].+\n)+)/g;
			var horseRegex 	= /(.+)\n/g;

			var raceFind;
			var horseFind;

			var separateHorses = function(line, array) {
				var lineRegex = /([0-9.]+) ((?:[A-Z].+\n)+)/g;
				var lineFind;
				while (lineFind = lineRegex.exec(line)) {
					var horses = lineFind[2].split(',');
					for (var i=0; i < horses.length; i++) {
						array.push({runnername: horses[i].trim(), price: lineFind[1]});
					};
				}

				return array;
			}

			while (raceFind = raceRegex.exec(text)) {
				var runners = [];

				while (horseFind = horseRegex.exec(raceFind[2])) {
					runners = separateHorses(horseFind, runners);
				}

				content.races.push({racenumber: raceFind[1], content: runners, feed: 'tab_fixed' });
			}
			
			return {'type': 'TAB Markets', 'data': content, 'feed': 'feed'};
		}

		Radb.Feed.load.prototype.ubet_fixed = function(text)
		{
			var content		= {'races': []};

			var raceRegex 	= /Race ([0-9]+)(?:.+)?\n((?:[0-9.]+ [A-Z].+\n)+)/g;
			var horseRegex 	= /(.+)\n/g;

			var raceFind;
			var horseFind;

			var separateHorses = function(line, array) {
				var lineRegex = /([0-9.]+) ((?:[A-Z].+\n)+)/g;
				var lineFind;
				while (lineFind = lineRegex.exec(line)) {
					var horses = lineFind[2].split(',');
					for (var i=0; i < horses.length; i++) {
						array.push({runnername: horses[i].trim(), price: lineFind[1]});
					};
				}

				return array;
			}

			while (raceFind = raceRegex.exec(text)) {
				var runners = [];

				while (horseFind = horseRegex.exec(raceFind[2])) {
					runners = separateHorses(horseFind, runners);
				}

				content.races.push({racenumber: raceFind[1], content: runners, feed: 'ubet_fixed' });
			}

			return {'type': 'UBET Markets', 'data': content, 'feed': 'feed'};
		}
		Radb.Feed.load.prototype.lad_fixed = function(text)
		{
			var content		= {'races': []};

			var raceRegex 	= /Race ([0-9]+)(?:.+)?\n((?:[0-9.]+ [A-Z].+\n)+)/g;
			var horseRegex 	= /(.+)\n/g;

			var raceFind;
			var horseFind;

			var separateHorses = function(line, array) {
				var lineRegex = /([0-9.]+) ((?:[A-Z].+\n)+)/g;
				var lineFind;
				while (lineFind = lineRegex.exec(line)) {
					var horses = lineFind[2].split(',');
					for (var i=0; i < horses.length; i++) {
						array.push({runnername: horses[i].trim(), price: lineFind[1]});
					};
				}

				return array;
			}

			while (raceFind = raceRegex.exec(text)) {
				var runners = [];

				while (horseFind = horseRegex.exec(raceFind[2])) {
					runners = separateHorses(horseFind, runners);
				}

				content.races.push({racenumber: raceFind[1], content: runners, feed: 'lad_fixed' });
			}
			
			return {'type': 'LADBROKE Markets', 'data': content, 'feed': 'feed'};
		}


		Radb.Feed.load.prototype.tips = function(text)
		{
			var content		= {'races': []};

			var raceRegex 	= /Race ([0-9]+):(.+?)\n/g;
			var horseRegex 	= / ([^,]+)?([,])?/g;

			var raceFind;
			var horseFind;

			while (raceFind = raceRegex.exec(text)) {
				var runners = [];

				while (horseFind = horseRegex.exec(raceFind[2])) {
					runners.push({runnername: horseFind[1].trim()});
				}

				content.races.push({racenumber: raceFind[1], content: runners, feed: 'tips' });
			}

			return {'type': 'Selections', 'data': content, 'feed': 'feed'};
		}

		Radb.Feed.load.prototype.dogs_betting = function(text)
		{
			var content		= {'races': []};

			var raceRegex 	= /^-(\d+)/gm;

			var horseRegex = /^\d+ - (.+?) \(.*?\)\t[$]([0-9.]+)$/gm;

			var raceFind;
			var horseFind;

			while (raceFind = raceRegex.exec(text)) {
				var runners = [];

				while (horseFind = horseRegex.exec(text)) {
					var horseName = horseFind[1];
					var horsePrice = horseFind[2];
					runners.push({runnername: horseName.trim(), price: horsePrice});
				}

				content.races.push({racenumber: raceFind[1], content: runners, feed: 'market' });
			}

			return {'type': 'Market', 'data': content, 'feed': 'feed'};
		}

		Radb.Feed.load.prototype.race_comment = function(text)
		{
			var content		= {'races': []};

			var numbers 	= { 'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5, 'SIX': 6, 'SEVEN': 7, 'EIGHT': 8, 'NINE': 9, 'TEN': 10, 'ELEVEN': 11, 'TWELVE': 12 }

			var raceFind;

			var raceRegex 		= /(?:Race|RACE) ([A-Za-z]+):(?:[\ ]*)?/g;

			while (raceFind = raceRegex.exec(text)) {
				text = text.replace('Race ' + raceFind[1], 'Race ' + numbers[raceFind[1].toUpperCase()] );
			}

			var raceRegex 		= /(?:Race|RACE) ([0-9]+):(?:[\ ]*)?\n((?:[A-Za-z].+[^:](?:[\ ]+)?\n)+)/g;

			console.log(text);

			while (raceFind = raceRegex.exec(text)) {
				content.races.push({racenumber: raceFind[1], content: {'comment': raceFind[2]}, feed: 'race_comment' });
			}

			console.log(content);

			return {'type': 'Race comment', 'data': content, 'feed': 'feed', 'columns': ['comment']};
		}

		Radb.Feed.load.prototype.gear_changes = function(text)
		{

			text = text + '\n';
			
			var content		= {'races': []};

			var raceFind;

			var raceRegex 		= /RACE ([0-9]+): (.+?)\n/g;

			while (raceFind = raceRegex.exec(text)) {
				console.log(raceFind);
				content.races.push({racenumber: raceFind[1], content: {'gearchanges': raceFind[2]}, feed: 'gear_changes' });
			}

			return {'type': 'Gear changes', 'data': content, 'feed': 'feed', 'columns': ['gearchanges']};
		}

		Radb.Feed.load.prototype.comment = function(text)
		{
			var content 	= {'races': []};
			var columns 	= ['comment'];	// the columns this feed is allowed to update

			var numbers 	= { 'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5, 'SIX': 6, 'SEVEN': 7, 'EIGHT': 8, 'NINE': 9, 'TEN': 10, 'ELEVEN': 11, 'TWELVE': 12 }
			var raceRegex	= /Race ([A-Za-z]+)( - .+)?\n/g;

			var raceFind;

			while (raceFind = raceRegex.exec(text)) {
				console.log(raceFind);
				text = text.replace('Race ' + raceFind[1], 'Race ' + numbers[raceFind[1].toUpperCase()] );
				console.log(text);
			}

			var raceRegex = /Race ([0-9]+)( - .+)?\n(([A-Z' ]+ \(.+?: .+\n)+)/g;
			var horseRegex 	= /(.+?) \(.+?: (.+)/g;

			var horseFind;

			while (raceFind = raceRegex.exec(text)) {
				var runners = [];

				while (horseFind = horseRegex.exec(raceFind[3])) {

					var comment = horseFind[2];
					comment = comment.replace(/First start. By .+? - .+?[.]/g, 'First start.')

					runners.push({runnername: horseFind[1].trim(), comment: comment});
				}

				content.races.push({racenumber: raceFind[1], content: runners, feed: 'comment'});
			}

			// console.log(content);

			return {'type': 'Comment', 'data': content, 'columns': columns, 'feed': 'feed'};
		};

		Radb.Feed.load.prototype.oneliners = function(text)
		{
			var content 	= {'races': []};
			var columns 	= ['comment'];	// the columns this feed is allowed to update

			var numbers 	= { 'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5, 'SIX': 6, 'SEVEN': 7, 'EIGHT': 8, 'NINE': 9, 'TEN': 10, 'ELEVEN': 11, 'TWELVE': 12 }
			var raceRegex	= /Race ([A-Za-z]+)( - .+)?\n/g;

			var raceFind;

			while (raceFind = raceRegex.exec(text)) {
				console.log(raceFind);
				text = text.replace('Race ' + raceFind[1], 'Race ' + numbers[raceFind[1].toUpperCase()] );
				console.log(text);
			}

			var raceRegex = /Race ([0-9]+)( - .+)?\n(([A-Z' ]+ \(.+?: .+\n)+)/g;
			var horseRegex 	= /(.+?) \(.+?: (.+)/g;

			var horseFind;

			while (raceFind = raceRegex.exec(text)) {
				var runners = [];

				while (horseFind = horseRegex.exec(raceFind[3])) {

					var comment = horseFind[2];
					comment = comment.replace(/First start. By .+? - .+?[.]/g, 'First start.')
					comment = comment.replace(new RegExp('(.+ [A-Z][a-z]+ [0-9]{1,2}[.] )(.+)$', 'gi'), '$2')

					runners.push({runnername: horseFind[1].trim(), comment: comment});
				}

				content.races.push({racenumber: raceFind[1], content: runners, feed: 'comment'});
			}

			// console.log(content);

			return {'type': 'Comment', 'data': content, 'columns': columns, 'feed': 'feed', 'supplier': Radb.state.group};
		};


		Radb.Feed.load.prototype.nztxt = function(text)
		{
			var content 	= {'races': []};
			var columns 	= ['nz_jockey', 'legend', 'claim'];	// the columns this feed is allowed to update

			var raceRegex	= /RACE ([0-9]+)\n.+?\n.+?\n((\d*  .+?\n)+)/g;
			var horseRegex 	= /\d*.{9}(.+?)( [a-z]* )?(?:\([U\d]*\))?[\ ]+[\d\.fr]+[\ ]+(.+?)( \(.*\))?[\ ]*\n/g;

			var raceFind;
			var horseFind;

			console.log(text);

			while (raceFind = raceRegex.exec(text)) {
				var runners = [];

				while (horseFind = horseRegex.exec(raceFind[2])) {
					runners.push({
									runnername: 	horseFind[1] ? horseFind[1].trim() : '',
									legend: 		horseFind[2] ? horseFind[2].trim() : '',
									nz_jockey: 		horseFind[3] ? horseFind[3].trim() : '',
									claim: 			horseFind[4] ? horseFind[4].trim() : '',
								});
				}

				if (runners.length > 0) {
					content.races.push({racenumber: raceFind[1], content: runners, feed: 'runner'});
				}
			}

			return {'type': 'NZ TXT', 'data': content, 'columns': columns, 'feed': 'feed'};
		};

})();
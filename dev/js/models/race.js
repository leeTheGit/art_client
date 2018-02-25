(function()
{
	'use strict';

	Radb.Model.race = Radb.Model.create({
		'url' : 'race'
	});
        Radb.Model.race.matchDivs = function(divId)
        {
            var self = this;

            return Radb.server.update(self.url(), {'matchDiv':divId})
            .done(function(response) {
                self.fetch();
            });
        }

})();

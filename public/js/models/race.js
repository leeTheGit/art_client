(function()
{
	'use strict';

	Acme.Model.race = Acme.Model.create({
		'url' : 'race'
	});
        Acme.Model.race.matchDivs = function(divId)
        {
            var self = this;

            return Acme.server.update(self.url(), {'matchDiv':divId})
            .done(function(response) {
                self.fetch();
            });
        }

})();

(function()
{
	'use strict';



	Acme.Model.loadModel = Acme.Model.create({
		'url' : 'load',
		'messages' : {
			'load' : 'loaded',
		}
	});
		Acme.Model.loadModel.load = function(params)
		{
			var self = this

			return Acme.server.create( self.url(), params )
				.done( function(r) {
					// console.log(r);
				self.data.loadid = r.data;
				self.query = [];

				console.log(Acme.socket.send(JSON.stringify({action: 'meeting/new', value: self.data.loadid})));

				console.log(self.resource + '/' + self.messages.load);

				Acme.PubSub.publish(self.resource + '/' + self.messages.load, self);
			});
		};

})();

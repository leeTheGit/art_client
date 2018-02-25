(function()
{
	'use strict';



	Radb.Model.loadModel = Radb.Model.create({
		'url' : 'load',
		'messages' : {
			'load' : 'loaded',
		}
	});
		Radb.Model.loadModel.load = function(params)
		{
			var self = this

			return Radb.server.create( self.url(), params )
				.done( function(r) {
					// console.log(r);
				self.data.loadid = r.data;
				self.query = [];

				console.log(Radb.socket.send(JSON.stringify({action: 'meeting/new', value: self.data.loadid})));

				console.log(self.resource + '/' + self.messages.load);

				Radb.PubSub.publish(self.resource + '/' + self.messages.load, self);
			});
		};

})();

(function()
{
	'use strict';


  Radb.Groups = function(model)
  {
	  this.model     = model;
	  this.groups = [];
  };
	  Radb.Groups.prototype.url = function()
	  {
		  return "group/";
	  };
	  Radb.Groups.prototype.update = function(topic, data)
	  {
		  return this.fetch();
	  };
	  Radb.Groups.prototype.fetch = function(url)
	  {
		  var self = this;

		  var url = (url === undefined) ? this.url() : url;

		  return Radb.server.request( url)
		   .done( function(response) {
			  self.groups = _.map(response.data, function(group) {
				  return	Object.getPrototypeOf(self.model),
									  {'resource':
										  { 'value' : 'groups'},
									  'data':
										  { 'value' : group}
									  }
			  });

			  Radb.PubSub.publish('groups/fetched', self);
		  });
	  };
})();

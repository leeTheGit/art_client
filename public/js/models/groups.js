(function()
{
	'use strict';


  Acme.Groups = function(model)
  {
	  this.model     = model;
	  this.groups = [];
  };
	  Acme.Groups.prototype.url = function()
	  {
		  return "group/";
	  };
	  Acme.Groups.prototype.update = function(topic, data)
	  {
		  return this.fetch();
	  };
	  Acme.Groups.prototype.fetch = function(url)
	  {
		  var self = this;

		  var url = (url === undefined) ? this.url() : url;

		  return Acme.server.request( url)
		   .done( function(response) {
			  self.groups = _.map(response.data, function(group) {
				  return	Object.getPrototypeOf(self.model),
									  {'resource':
										  { 'value' : 'groups'},
									  'data':
										  { 'value' : group}
									  }
			  });

			  Acme.PubSub.publish('groups/fetched', self);
		  });
	  };
})();

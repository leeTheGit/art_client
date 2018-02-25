$(function() {
	'use strict';



	Radb.Model.user = Radb.Model.create({
		'url' 			: 'user',
		'resource_id' 	: 'data.userid'
	});


	Radb.Model.group = Radb.Model.create({
		'url' 			: 'group',
		'resource_id' 	: 'data.groupid'
	});




/*
------------------------------------------------
				COLLECTIONS
------------------------------------------------
*/


	Radb.Collection.users = function(model) 
	{
		this.model 		= model;
		this.users 		= [];
	};
		Radb.Collection.users.prototype.url = function()
		{
			return "user/"
		};
		Radb.Collection.users.prototype.update = function(topic, data)
		{
			return this.fetch();
		};
		Radb.Collection.users.prototype.fetch = function(url) 
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			var data = Radb.server.request( url );

			data.done( function(response) {
				console.log(response);
				self.users = [];
				// console.log(JSON.stringify(response.data));
				// var response = JSON.parse('');
				var users = response.data;
				for (var i=0;i<users.length;i++) {
					self.users.push( Object.create(self.model, 
										{	'data' : {
												'value': users[i],
												'writable': true
											}
										}
					));
					// self.users.push( new self.model(users[i]));
				}
				Radb.PubSub.publish('users/reloaded', self);
			});
			return data;
		};
		Radb.Collection.users.prototype.addUser = function() 
		{
			var self = this;
			var updateParams = {
				'name' : 'unnamed',
				'password' : 'slog818&list',
				'group' : 'self',
			};
			Radb.server.create("user/", updateParams)
				.done(function(r) {
					console.log(r);
					self.users.push( new self.model(r.data));
					Radb.PubSub.publish('user/added', self);
				});
		};


	Radb.Collection.groups = function(model) 
	{
		this.model 		= model;
		this.groups 		= [];
	};
		Radb.Collection.groups.prototype.url = function()
		{
			return "group/"
		};
		Radb.Collection.groups.prototype.update = function(topic, data)
		{
			return this.fetch();
		};
		Radb.Collection.groups.prototype.fetch = function(url) 
		{
			var self = this;
			var url = (url === undefined) ? this.url() : url;
			var data = Radb.server.request( url );

			data.done( function(response) {
				console.log(response);
				self.groups = [];
				// console.log(JSON.stringify(response.data));
				// var response = JSON.parse('');
				var groups = response.data;
				for (var i=0;i<groups.length;i++) {
					self.groups.push( Object.create(self.model, 
										{	'data' : {
												'value': groups[i],
												'writable': true
											}
										}
					));
					// self.groups.push( new self.model(groups[i]));
				}
				Radb.PubSub.publish('groups/reloaded', self);
			});
			return data;
		};
		Radb.Collection.groups.prototype.addGroup = function() 
		{
			var self = this;
			var updateParams = {
				'name' : 'unnamed',
				'access': 'self'
			};
			Radb.server.create("group/", updateParams)
				.done(function(r) {
					self.groups.push( new self.model(r.data));
					Radb.PubSub.publish('group/added', self);
			});
		};



/*
------------------------------------------------
				VIEWS
------------------------------------------------
*/

	Radb.View.users = function(config)
	{
		this.temp 			 = config.template;;
		this.users           = [];
		this.container       = config.el;
		this.selected        = null;
		this.selectedArray   = null;
		this.group           = null;
	};
		Radb.View.users.prototype.update = function(topic, data)
		{

			if (topic == 'user/deleted') {
				this.clear();
			} else if (topic == 'group/selected') {
				this.group = data;
				this.render();
			} else {
				this.users = data;
				this.render();
			}
		};
		Radb.View.users.prototype.render = function()
		{
			var self = this;
			self.container.empty();
			var users = self.users.users;

			if (users.length === 0 ) {
				self.container.empty().append('<div class="noScheduleData">No data</div>');
				return;
			}
			this.selectList = [];
			var finalTmpl     = '';
			var userCount  = users.length;

			for (var i=0; i<userCount; i++) {
				if (this.group && users[i].data.groupname != this.group) continue;
				
				var selected = (users[i].data.userid === self.selected) ? 'selected' : '';
				if (selected) this.selectedArray = i;
				var params = {
					"name"     : users[i].data.firstname + " " + users[i].data.lastname,
					"id"       : users[i].data.userid,
					"index"    : i,
				};
				params['theClass'] = selected;
				finalTmpl += this.temp(params);
			}
			self.container.append(finalTmpl);
			self.renderDetails();
			this.events();
			return this;
		};
		Radb.View.users.prototype.clear = function()
		{
			$('#UserID').val('');
			$('#UserName').val('');
			$('#FirstName').val('');
			$('#LastName').val('');
			$('#UserPassword').val('');
			$('#GroupSelect').val('');
			$('#UserAccess').val('');
		};
		Radb.View.users.prototype.renderDetails = function()
		{
			if (this.selectedArray == null) return;
			var user = this.users.users[this.selectedArray];
			if (user) {
				$('#UserID').val(user.data.userid);
				$('#UserName').val(user.data.username);
				$('#FirstName').val(user.data.firstname);
				$('#LastName').val(user.data.lastname);
				$('#UserPassword').val(user.data.password);
				$('#GroupSelect').val(user.data.groupid);
				$('#UserAccess').val(user.data.useraccess);
			} else {
				this.clear();
			}
		};
		Radb.View.users.prototype.select = function(id)
		{
			var self = this;
			var users = $('#userList li');
			users.each(function(index, elem) {
				var $elem = $(elem);
				var elemindx = $elem.data('id');
				if ($elem.hasClass('selected')) {
					$elem.removeClass('selected');
				}
				if (id === elemindx) { 
					$elem.addClass('selected');
					self.selectedArray = $elem.data('arrayid');
				}
			});
		};
		Radb.View.users.prototype.events = function()
		{
			var self = this;
			self.container.unbind();
			$('#addUser').unbind();
			$('#deleteUser').unbind();
			$('#usersInfo input').unbind();
			$('#UserAccess').unbind();
			$('#GroupSelect').unbind();
			
			self.container.on('click', function(e) {
				var elem = $(e.target);
				var id = elem.data('arrayid');
				var userid = elem.data('id');
				self.selectedArray = id;
				console.log(self.selectedArray);
				self.selected = userid;
				self.select(self.selected);
				
				if (elem.hasClass('delete')) {
					var message = "Delete " + self.users.users[id].data.venue + " on " + self.users.users[id].data.date + "?";
					Radb.dialog.show(message, "Warning", self.users.users[id].delete, self.users.users[id]);
					return;
				}
				self.renderDetails();
				// Radb.PubSub.publish('user/selected', self.users.users[id].data.id);
			});
			$('#addUser').click(function() { 
				self.users.addUser();
			});
			$('#deleteUser').click(function() {
				var message = "Delete " + self.users.users[self.selectedArray].data.username + "?";
				Radb.dialog.show(message, "Warning", self.users.users[self.selectedArray].delete, self.users.users[self.selectedArray]);
			});
			$('#usersInfo input').on('change', function(e) {
				e.preventDefault();
				var elem = $(e.target);
				var field = elem.attr('name');
				var user = self.users.users[self.selectedArray],
					data   = {};
				data[field] = elem.val();
				user.update(data);
			});

			$('#UserAccess').on('change', function(e) { 
				var elem = $(this);
				var user = self.users.users[self.selectedArray];
				var params = {};
				params['access'] = elem.val();
				user.update(params);
			});
			$('#GroupSelect').on('change', function() { 
				var elem = $(this);
				var user = self.users.users[self.selectedArray];
				var params = {};
				params['usergroup'] = elem.val();
				user.update(params);
			});

		};

	Radb.View.groups = function(config)
	{
		this.temp 			 = config.template;;
		this.groups           = [];
		this.container       = config.el;
		this.selected        = null;
	};
		Radb.View.groups.prototype.update = function(topic, data)
		{
			if (topic == 'group/deleted') {
				this.clear();
			} else if (topic == 'group/updated') {
				this.render();
			} else {
				this.groups = data;
				this.render();
			}
		};
		Radb.View.groups.prototype.render = function()
		{
			var self = this;
			self.container.empty();
			var groups = self.groups.groups;
			var grouplisttemp = template('groupSelectTemp');
		
			if (groups.length === 0 ) {
				self.container.empty().append('<div class="noScheduleData">No data</div>');
				return;
			}
			this.selectList = [];
			var finalTmpl    = '',
				finalGrpTmpl = '';
			var groupCount  = groups.length;

			for (var i=0; i<groupCount; i++) {
				var selected = (i === self.selected) ? 'selected' : '';
				var params = {
					"group"    : groups[i].data.groupname,
					"groupid"  : groups[i].data.groupid,
					"index"    : i,
				};
				params['theClass'] = selected;
				finalTmpl += this.temp(params);
				finalGrpTmpl += grouplisttemp(params);
			}

			self.container.append(finalTmpl);

			$('.groupselect').empty().append(finalGrpTmpl);
			this.events();
			return this;
		};
		Radb.View.groups.prototype.renderDetails = function()
		{
			var group = this.groups.groups[this.selected];
			if (group) {
				$('.groupid').val(group.data.groupid);
				$('.groupname').val(group.data.groupname);
				$('#GroupAccess').val(group.data.groupaccess);
			} else {
				this.clear();
			}
		};
		Radb.View.groups.prototype.clear = function()
		{
			$('.groupid').val('');
			$('.groupname').val('');
			$('#GroupAccess').val('');
		};

		Radb.View.groups.prototype.select = function(id)
		{
			var groups = $('#groupList li');
			groups.each(function(index, elem) {
				var $elem = $(elem);
				var elemindx = $elem.data('arrayid');
				if ($elem.hasClass('selected')) {
					$elem.removeClass('selected');
				}
				if (id === elemindx) { 
					$elem.addClass('selected');
				}
			});
		};
		Radb.View.groups.prototype.events = function()
		{
			var self = this;
			self.container.unbind();
			$('#addGroup').unbind();
			$('#deleteGroup').unbind();
			$('.columns4content input').unbind();
			$('#GroupAccess').unbind();

			self.container.on('click', function(e) {
				var elem = $(e.target);
				var id = elem.data('arrayid');
				self.selected = id;
				self.select(self.selected);
				if (elem.hasClass('delete')) {
					var message = "Delete " + self.groups.groups[id].data.groupname + "?";
					Radb.dialog.show(message, "Warning", self.groups.groups[id].delete, self.groups.groups[id]);
					return;
				}
				self.renderDetails();
				Radb.PubSub.publish('group/selected', self.groups.groups[id].data.groupname);
			});

			$('#addGroup').click(function() { 
				self.groups.addGroup();
			});
			$('#deleteGroup').click(function() { 
			//	self.groups.groups[self.selected].delete();
				var message = "Delete " + self.groups.groups[self.selected].data.groupname + "?";
				Radb.dialog.show(message, "Warning", self.groups.groups[self.selected].delete, self.groups.groups[self.selected]);
			});
			$('.groupInfo input').on('change', function(e) {
				e.preventDefault();
				var elem = $(e.target);
				var field = elem.attr('name');
				var group = self.groups.groups[self.selected],
					data   = {};
				data[field] = elem.val();
				group.update(data);
			});

			$('#GroupAccess').on('change', function(e) { 
				var elem = $(this);
				var group = self.groups.groups[self.selected];
				var params = {};
				params['access'] = elem.val();
				group.update(params);
			});

		};


	Radb.start = function()
	{


		// ***************************************
					// LOAD VIEWS
		// ***************************************
		Radb.users_view = new Radb.View.users({'template': template('userListTemp'), 'el': $('#userList')});
		
		Radb.PubSub.subscribe({ 
			'Radb.users_view.update' : [ "users/reloaded",
										 "user/deleted",
										 "group/selected"]
		});

		Radb.groups_view = new Radb.View.groups({'template': template('groupListTemp'), 'el': $('#groupList')});
		Radb.PubSub.subscribe({ 
			'Radb.groups_view.update' : [ "groups/reloaded",
										  "group/updated"]
		});



		// // ***************************************
		// 			// LOAD COLLECTIONS
		// // ***************************************

		Radb.users_col = new Radb.Collection.users(Radb.Model.user);
		Radb.PubSub.subscribe({ 
			'Radb.users_col.update' : [ "user/deleted",
										"user/updated",
										"group/deleted"]
		});

		Radb.groups_col = new Radb.Collection.groups(Radb.Model.group);
		Radb.PubSub.subscribe({ 
			'Radb.groups_col.update' : [ "group/deleted",
										 "group/updated",
										 "group/deleted"]
		});


		Radb.users_col.fetch();
		Radb.groups_col.fetch();

		// pageEvents();
	}

	
	function showUserDetails() {
	}


	function showGroupDetails() {

	}



});
$(function() {
	'use strict';
	var server = Radb.server;
	var page = window.location.pathname.split('/')[1];

	var req = server.request("user/self");
		req.done(function(data) {
			data = data.data[0];

			if (data.groupaccess == 'full' && data.access == 'admin') {
				$('#topNav').append( template('adminPages') );
			} 
			
			$('#topNav button').each(function(i,e) {
				var $elem = $(e);
				if ( $elem.data('page') == page ) {
					$elem.addClass('activePage');
				}

				$elem.on('click', function(e) {
					var page = $elem.data('page');
					var newPath = localStorage[page] || ('/' + page)

					window.location.assign(window.location.origin + newPath);
				})

			});
			var theDate = new Date;
			if (theDate.getMonth() == 9 && theDate.getDate() == 19) {
				$('.userIcon').switchClass('userIcon','pirateIcon',100);
			}
			Radb.PubSub.publish('update_state', {'user':data.userid});
			$('#loginHead').html( template('loginInfo')({'userName': data.username}) );

			eventHandlers();
	}).fail(function(r) {
		$('#loginHead').append( template('logingForm') );
		eventHandlers();
		console.log(r.responseText);
	});


	var eventHandlers = function()
	{
		$('#logout').on('click', function(e) {
			e.stopPropagation();
			console.log('click');
			server.login("/logout").done(function(r) {
				console.log(r);
				window.location.reload();
			});
		});

		$('#login').on('click', function(e) {
			e.stopPropagation();
			$('.login').show();
			$('#username').focus();
		});

		// $('.login').on('mouseleave', function(e) {
		// 	e.stopPropagation();
		// 	$('ul.loginForm ul').hide();
		// });

		$('ul.loginForm ul').on('click', function(e) {
			e.stopPropagation();
		});
		$('#signin').on('click', function(e) {
			e.preventDefault();
			console.log('clicking signin');
			var data = {
				'username': $('#username').val(),
				'password': $('#password').val()
			}
			console.log(data);
			server.login("/login", data).done(function(data) {
				console.log(data);
					window.location.reload();
			});

		});
	}
});

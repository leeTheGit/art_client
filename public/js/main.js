$(function()
{
	var createWebSocket = function() {
		Acme.socket = new WebSocket("ws://pm-sockets.aap.com.au/socket/racing");

		Acme.socket.onopen = function(e) {
			// console.log('Listening to socket!');
		};

		Acme.socket.onmessage = function(e) {
			// console.log('Message received from socket!');
			// console.log(e);
		};

		Acme.socket.onerror = function(err) {
			// console.log(err);
		};

		Acme.socket.onclose = function(e) {
			setTimeout(function() {
				createWebSocket();
			}, 3 * 1000);
		};		
	};

	// createWebSocket();

	Acme.url = new Acme.Url();
	Acme.state = new Acme.State();

	// if ((localStorage['current'] !== Acme.state.page) && (localStorage[Acme.state.page] != null)) {
	// 	var redirectLocation = localStorage[Acme.state.page]
	// 	localStorage['current'] = Acme.state.page;

	// 	if (location.href !== redirectLocation) window.history.pushState(null, null, redirectLocation);
	// }


	var subscriptions = Acme.PubSub.subscribe({
		'Acme.state.listener'	: 	[	"load_from_url",
									 	"resource/selected",
									 	"resource/updated",
									 	"update_state"],
	    'Acme.url.listener' 		: [ "url/updated" ]
	});



	// start method in [...]_page.js
	Acme.start();

});

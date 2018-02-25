$(function()
{
	var createWebSocket = function() {
		Radb.socket = new WebSocket("ws://pm-sockets.aap.com.au/socket/racing");

		Radb.socket.onopen = function(e) {
			// console.log('Listening to socket!');
		};

		Radb.socket.onmessage = function(e) {
			// console.log('Message received from socket!');
			// console.log(e);
		};

		Radb.socket.onerror = function(err) {
			// console.log(err);
		};

		Radb.socket.onclose = function(e) {
			setTimeout(function() {
				createWebSocket();
			}, 3 * 1000);
		};		
	};

	// createWebSocket();

	Radb.url = new Radb.Url();
	Radb.state = new Radb.State();

	// if ((localStorage['current'] !== Radb.state.page) && (localStorage[Radb.state.page] != null)) {
	// 	var redirectLocation = localStorage[Radb.state.page]
	// 	localStorage['current'] = Radb.state.page;

	// 	if (location.href !== redirectLocation) window.history.pushState(null, null, redirectLocation);
	// }


	var subscriptions = Radb.PubSub.subscribe({
		'Radb.state.listener'	: 	[	"load_from_url",
									 	"resource/selected",
									 	"resource/updated",
									 	"update_state"],
	    'Radb.url.listener' 		: [ "url/updated" ]
	});



	// start method in [...]_page.js
	Radb.start();

});

<?php

Router::add('/', 							DIR_CTRL.'/meeting_cont.php');
Router::add('#^/meeting(/)?(.+)?#',  		DIR_CTRL.'/meeting_cont.php', 			Router::ROUTE_PCRE);
Router::add('#^/users(/)?(.+)?#',  			DIR_CTRL.'/users_cont.php', 			Router::ROUTE_PCRE);
Router::add('#^/tracks(/)?(.+)?#',  		DIR_CTRL.'/tracks_cont.php', 			Router::ROUTE_PCRE);
Router::add('#^/outputs(/)?(.+)?#',  		DIR_CTRL.'/outputs_cont.php',	 		Router::ROUTE_PCRE);
Router::add('#^/runners(/)?(.+)?#',  		DIR_CTRL.'/runners_cont.php',	 		Router::ROUTE_PCRE);

Router::add('#^/api(/)?(.+)?#', 			DIR_CTRL.'/api_cont.php', 				Router::ROUTE_PCRE);
Router::add('#^/authorise(/)?(.+)?#', 		DIR_CTRL.'/auth_cont.php', 				Router::ROUTE_PCRE);
Router::add('#^/login(/)?#', 				DIR_CTRL.'/login_cont.php',				Router::ROUTE_PCRE);
Router::add('#^/logout(/)?#', 				DIR_CTRL.'/logout_cont.php',			Router::ROUTE_PCRE);
Router::add('#^/test(/)?#',					DIR_CTRL.'/test.php',					Router::ROUTE_PCRE);







/**
 * Routes are added with the static method Router::add($pattern, $replacement)
 * It is processed as preg_replace($pattern, $replace) in the router class, so
 * use any style for $pattern. Though it would be best to use # for pattern
 * delimiters and ${n} for the replacement string variables. To carry a string
 * from the pattern, just put them in parentheses (). These are run in order,
 * and first one that matches and has a readable controller file is used.
 *
 * PHP's preg_replace: http://php.net/preg_replace/
 *
 * examples:
 *
 * Router::add('#/#', DIR_CTRL.'index.php', Router::ROUTE_PCRE);
 *      sends index page to the index.php contoller
 *
 * Router::add('#/news/(archive|latest)/#', DIR_CTRL.'news.${1}.php', Router::ROUTE_PCRE);
 *      /news/archive/ goes to news.archive.php
 *
 * you can also do this
 *
 * Router::add('#/news/(archive|latest)/#', DIR_CTRL.'news/${1}.php', Router::ROUTE_PCRE);
 *      /news/archive/ goes to news/archive.php
 *
 *
 *	How the routes are stored as an array (3 arrays, one for each priority setting)
	*array (
	*	[0] => array ( ) High priority
	*	[1] => array ( 	 Normal Priority
	*		[0] => array (
	*			[0] => /
	*			[1] => /users/neenanl/sites/tv-api.local/modup/controller/index.php
	*			[2] => 1
	*			[3] =>
	*			)
	*		[1] => array (
	*			[0] => #^/regex/(test1|test2|test3)/$#
	*			[1] => /users/neenanl/sites/tv-api.local/modup/controller/regex.php
	*			[2] => 0
	*			[3] =>
	*		)
	*	[2] => array ( ) Low priority
*)
 */

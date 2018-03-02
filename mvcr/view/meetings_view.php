


 <script id="search_result_tmpl" type="text/template">
   <div id="search_result" class="search_result">
		<h3>Results</h3>
		<ul id="search_header" class="searchitem header">
			<li class="search_type">Type</li>
			<li class="search_find">Result</li>
			<li class="search_meeting">Meeting</li>
			<li class="search_racename">Race</li>
		</ul>
		<ul id="search_results" class="searchresults"></ul>
		<div class="search_buttons">
			<button class="close">Close</button>
			<button class="min">Minimise</button>
		</div>
   </div>
</script>

 <script id="search_item" type="text/template">
	<ul class="searchitem <%- visited %>" data-arrayid="<%- arrayid %>" data-id="<%- id %>" data-type="<%- type %>">
		<li class="search_type"><%- type %> </li>
		<li class="search_find"><%- result %></li>
		<li class="search_meeting"><%- meeting %></li>
		<li class="search_racename"><%- racenumber %> - <%- racename %></li>
	</ul>
</script>





<body class="radial">

	<div id="container" class="container" data-colourtheme="meeting-edit">


	<?php include_once DIR_VIEW . "/templates/topPanel.php"; ?>





<!-- 
		<div id="right-side-panel" class="right-side-panel flex_row">
			<div id="tabpanel" class="right-side-panel_tabs flex-shrink0 flex_col">
				<div class="openPortal showLeftPush"></div>
			</div>

			<div id="portal_content" class="right_slider_content flex1 flex_col">
				<div id="publicationsList" class="publicationsList flex-shirnk0"></div>
				<div id="portalMeeting" class="portalMeeting flex_col flex1"></div>
			</div>

		</div> 
 -->


	</div> <!-- close container -->

<script type="text/javascript" src="/js/main.js"></script>

<script type="text/javascript" src="/js/models/meeting.js"></script>
<!-- <script type="text/javascript" src="/js/models/groups.js"></script> -->

<script type="text/javascript" src="/js/collections/meetings.js"></script>
<script type="text/javascript" src="/js/views/search.js"></script>

<script type="text/javascript" src="/js/meetings_page.js"></script>

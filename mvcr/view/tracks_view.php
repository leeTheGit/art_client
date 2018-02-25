<?php
include_once DIR_VIEW . "/templates/topPanel.php"; ?>

<script id="trackListTemp" type="text/template">
    <li class="list_item" data-arrayid="<%= index %>"><%= name %> <%= type %></a></li>
</script>

<body class="radial">

<div class="columnContainer">



	<div class="tracks flex_col flex1 padding-30">
		<div class="columnHeader flex-shrink0">
			<h3>Tracks</h3>
		</div>

		<div class="flex1 flex_row">





<?php/**
-------------------------------------------
								Column 1
-------------------------------------------
*/?>



			<div class="tracknameCol flex1 flex_col">
				<div class="track flex1 flex_col">
					<input type="search" id="meetingfilter" class="meetingfilter flex-shrink0" name="meetingfilter" placeholder="Seperate filter terms with a comma...">
	                <div class="subtle-sep flex-shrink0"></div>
					<ul id="trackList" class="list_box flex1">
					<!-- trackListTemp inserted here -->
					</ul>
				</div>

				<div class="addDelete flex-shrink0">
					<button class="add" id="addTrack">New</button>
					<button class="delete" id="deleteTrack">Delete</button>
				</div>
			</div> <!-- end column -->




<?php/**
-------------------------------------------
								Column 2
-------------------------------------------
*/?>
			<div class="flex2">
				<div class="trackinfo columns1content flex_col" id="TrackInfo">

					<input type="hidden" name="Category" value="">
					<label for="TrackID">ID</label>
					<input class="TrackID dark_50pc" type="text" name="trackID"   id="TrackID"  value="" readonly>

					<label for="TrackName">Name</label>
					<input class="name dark_50pc" type="text" name="name" id="TrackName" value="">

					<label for="TrackRISA">RISA Name</label>
					<input class="risa dark_50pc" type="text" name="risa" id="TrackRISA" value="">

					<label for="TrackCode">Code</label>
					<input class="code dark_50pc" type="text" name="code" id="TrackCode" value="">

					<label for="TrackType">Type</label>
					<input class="type dark_50pc" type="text" name="type" id="TrackType" value="">

					<label for="timezoneSelect">Timezone</label>
		            <div id="timezoneSelect" class="track-rail" type="text/template"></div>

					<label for="stateSelect">State</label>
		            <div id="stateSelect" class="track-rail" type="text/template"></div>
				</div>
			</div> <!-- end column -->
		</div> <!-- end columnContainer -->
	</div>

</div> <!-- closes main -->

<script src="/js/tracks_page.js"></script>
<script type="text/javascript" src="/js/main.js"></script>


 <script id="portalData" type="text/template">
   <div id="bests" class="bests flex-shrink0">
		<h3 class="portal">Bests</h3>
		<div id="bestlist"></div>
   </div>

   <div id="tips" class="tips flex-shrink0"></div>
</script>

<script id="portalpublications" type="text/template">
	<label><%- pub %></label>
</script>

<script id="portalbests" type="text/template">
	<ul class="bbet <%- scratched %>"><li><%- number %></li><li><%- name %></li></ul>
</script>


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



<script id="loadOptionList" type="text/template">
	<div id="importOptWindow" class="importOptWindow darker_bg">
		<p>Load options</p>
		<input id="newTask" class="newTask" type="text" name="newTask" autocomplete="off" />
		<ul id="importList" class="importList"></ul>
		<div class="import-options">
			<button id="import" class="button">Import</button>
			<button id="clear" class="button">Clear updates</button>
			<button id="importClose" class="button">Close</button>
		</div>
	</div>
</script>


<script id="trackListTemp" type="text/template">
    <li class="list_item" data-arrayid="<%- index %>"><%- name %> <%- type %></a></li>
</script>



<script id="trackListPage" type="text/template">
	<div id="tracksPage" class="tracks flex_col flex1">
		<div class="columnHeader flex-shrink0">
			<h3>Tracks</h3>
		</div>

		<div class="flex1 flex_row">

			<div class="tracknameCol flex1 flex_col">
				<div class="track flex1 flex_col">
					<input type="search" id="trackFilter" class="trackFilter flex-shrink0" name="trackfilter" placeholder="Seperate filter terms with a comma...">

					<ul id="trackList" class="list_box flex1">
					<!-- trackListTemp inserted here -->
					</ul>
				</div>

				<div class="addDelete flex-shrink0">
					<button class="add" id="addTrack">New</button>
					<button class="delete" id="deleteTrack">Delete</button>
					<button class="match" id="matchTrack">Match</button>
				</div>
			</div> <!-- end column -->

			<div class="flex2">
				<div class="trackinfo columns1content flex_col" id="TrackInfo">

					<input type="hidden" name="Category" value="">
					<label for="TrackID">ID</label>
					<input class="TrackID dark_50pc" type="text" name="trackID"   id="TrackID"  value="" readonly>

					<label for="TrackName">Name</label>
					<input class="name dark_50pc" type="text" name="name" id="TrackName" value="">

					<label for="TrackCode">RISA Name</label>
					<input class="risa dark_50pc" type="text" name="risa" id="TrackRISA" value="">

					<label for="TrackCode">Code</label>
					<input class="code dark_50pc" type="text" name="code" id="TrackCode" value="">

					<label for="TrackCode">Type</label>
					<input class="type dark_50pc" type="text" name="type" id="TrackType" value="">

					<label for="TrackTZ">Timezone</label>
		            <div id="timezoneSelect" class="track-rail" type="text/template"></div>

					<label for="TrackState">State</label>
		            <div id="stateSelect" class="track-rail" type="text/template"></div>
				</div>
			</div>
		</div>
	</div>
</script>


<script id="meetingList" type="text/template">
	<div class="meeting-item flex_row <%- oldrace %> <%- selected %> <%- trackmismatch %>" data-arrayid="<%- index %>" data-id="<%- id %>">
	            <div class="meeting-sync flex1 fa-stack"  title="<%= sync ? 'Synced on portal.' : '' %>">
					<i class="fa meeting-sync-light brightGreen fa-fw fa-lg <%= sync ? 'fa-circle' : '' %>"></i>
				</div>
				<div class="load-details flex7">
					<li>
						<ul>
							<li class="meeting track"><%= venue %></li>
						</ul>
						<ul>
							<li class="racedate lightgray"><%- type %> <%- raceDate %></li>
						</ul>
					</li>
				</div>
	            <div class="meeting-sync flex1">
					<i class="fa meeting-hold-light red fa-2x fa-fw <%= hold==='hold' ? 'fa-lock' : '' %>" title="<%= hold ? 'Meeting is on hold!' : '' %>"></i>
				</div>
			<div class="resultCount"><%- resultCount %></div>

	</div>
</script>

<script id="loadList" type="text/template">
	<div class="meeting-item flex_col <%- selected %>" data-status="<%- load_status %>" data-arrayid="<%- index %>" data-id="<%- id %>">
		<div class="flex9">
			<div class="flex_row">
				<div class="load-actions flex1">
					<i class="wide status <%- index %> <%- button_class %> fa fa-circle-o fa-lg" name="race" data-feed="race" title="<%- button_class %>"></i>
				</div>
				<div class="load-details flex5">
					<li>
						<ul>
							<li class="meeting track"><%= track %></li>
						</ul>
						<ul>
							<li class="racedate lightgray"><%- type %> <%- meetingdate %></li>
						</ul>
					</li>
				</div>
<!-- 				<div class="load-actions flex1">
				</div> -->
			</div>
		</div>
	</div>
</script>

<!--        <div class="barber-pole <%- index %> barber-pole-off" role="progressbar"><div class="stripe-wrapper" aria-hidden="true"><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr></div></div>       -->

<script id="meeting-editor" type="text/template">
	<div class="meeting-info flex_col flex-shrink0"></div>
	<div class="race-info flex_col flex-shrink-0 bottom-margin-15"></div>
	<div class="runners-info  flex_col flex1"></div>
</script>


<script id="meeting_top" type="text/template">
	<div class="flex_row flex-shrink0 flex_between">

		<div class="flex1 flex_row flex_between">
			<div class="top-main track white" id="meetingLocation">
				<i id="viewFeed" class="switchView fa fa-2x fa-caret-left"></i>
				<button class="meeting_track" title="<%- location %> (<%- timezone %>)"><%- location %></button>
				<span class="nowrap padding-r10 lightgray smaller"><%- type %></span>
				<span class="nowrap padding-r10 lightgray smaller"><%- date %></span>
			</div>
			<div id="meeting_buttons" class="flex_row meeting_buttons">
				<div class="coloursbuttons <%- abbrclass %>">
					<p id="tababbrev">TAB Abbr</p>
					<input class="tab_abbrev lightgray flex1" id="tab_abbrev" type="text" value="<%- abbrev %>" name="tab_abbrev" autocomplete="off">
				</div>

	            <div class="coloursbuttons <%- tabclass %>">
					<p>TAB</p>
					<input class="betcode lightgray flex1" id="tab_code" type="text" value="<%- tabcode %>" name="betcode" data-subname="tab" autocomplete="off">
				</div>
				<div class="coloursbuttons  <%- ubetclass %>">
					<p>UBET</p>
					<input class="betcode lightgray flex1" id="ubet_code" type="text" value="<%- ubetcode %>" name="betcode" data-subname="ubet" autocomplete="off">
				</div>
				<div class="coloursbuttons  <%- nzclass %>">
					<p>NZ</p>
					<input class="betcode lightgray flex1" id="nz_code" type="text" value="<%- nzcode %>" name="betcode" data-subname="nz" autocomplete="off">
				</div>

				<div class="coloursbuttons"></div>			

	            <div class="coloursbuttons">
					<p>Silks</p>
					<button class="meeting_control colours">Order</button>
				</div>
				<div class="syncbuttons">
					<p>Web</p>
					<button class="meeting_control sync">Show</button>
				</div>

				<div class="coloursbuttons"></div>			

				<div class="meetingbuttons">
					<p>Meeting</p>
					<button class="meeting_control hold <%- hold %>">Hold</button>
					<button class="meeting_control delete">Delete</button>
				</div>
			</div>
        </div>
	</div>


	<div class="top-sub flex_row flex-shrink0">


		<div class="rail-container flex_col flex1">
            <div class="flex_row">
                <label class=" flex-shrink0 padding-r20 runnercount" id="runnercount"><span class="weight-500"><%- runnercount %></span> runners</span></label>
    			<label class=" flex-shrink0" for="rating">Track</label>
    				<input class="track-details" id="meeting_rating" type="text" value="<%- rating %>" name="rating" autocomplete="off">

    			<label class=" flex-shrink0" for="weather">Weather</label>
    				<input class="track-details" id="meeting_weather" type="text" value="<%- weather %>" name="weather" autocomplete="off">

    			<label class=" flex-shrink0" for="meeting_rail">Rail</label>
    				<input class="track-details flex5"  type="text" id="meeting_rail" value="<%- rail %>" name="rail" autocomplete="off">
            </div>
        </div>
	</div>
	<div class="multiplesRes flex_row" id="multiplesRes">
        <div><p id="multiplestext" class="flex1"></p></div>
        <div><p id="aapmultiplestext" class="flex1"></p></div>
    </div>

</script>


<script id="load-editor" type="text/template">
	<div class="load-info flex_col flex1"></div>
</script>


 <script id="race-info" type="text/template">
	<div class="tabs border-bottom_50 flex-shrink0" id="racetabs">
		<ul id="raceTabList" class="tabList">
			 <li class="black lightgray runnertabselect" id="raceData">Race</li
			><li class="lightgray" id="racePrizes">Prizes</li
			><li class="lightgray" id="raceTips">Tips</li
			><li class="lightgray" id="raceComment">Comment</li
			><li class="lightgray" id="raceMultiples">Multiples</li
			><li class="lightgray" id="raceResults">Results</li>
		</ul>

	    <div id="minimize"><div class="minimize fa fa-2x fa-caret-down"></div></div>

		<button id="publish_button" class="publish_button"></button>

		<ul id="stateList" class="right">
			<div class="marketMenu" id="stateSelect"></div>
		</ul>

        <!-- <div id="resultsbutton" class="resultsbutton"></div> -->

    </div>
	<ul id="raceHeader" class="raceHeader blueHilight flex_row flex-shrink0"></ul>
	<ul id="raceList" class="raceList"></ul>
</script>

 <script id="runner-info" type="text/template">
	<div class="tabs border-bottom_50 flex-shrink0" id="runnerstabs">
		<p id="missing" class="runnercount"></p>
		<div class="flex_row">
			<div class="flex1">
				<ul id="raceNav" class="tabList left">
					<li class="lightgray padding-l10 fa fa-2x fa-caret-left icon_shift_up" data-inc="-1"></li>
					<li class="lightgray padding-r20 padding-l20 icon_shift_up_2" data-inc="0">All</li>
					<li class="lightgray padding-r10 fa fa-2x fa-caret-right icon_shift_up" data-inc="1">︎</li>
				</ul>
			</div>
			<div class="flex4">
				<ul id="runnerTabList" class="tabList">
					<li class="black lightgray runnertabselect" id="runnersData">Runner</li
					><li class="lightgray" id="runnersBreeding">Breed</li
					><li class="lightgray" id="runnersForm">Form</li
					><li class="lightgray" id="runnersStats">Stats</li
					><li class="lightgray" id="runnersComment">Comment</li
					><li class="lightgray" id="runnersResults">Results</li>
				</ul>
			</div>
			<div class="flex1"></div>
		</div>
	</div>
	<ul class="runnersHeader onBlue flex_row flex-shrink0"></ul>
	<ul class="runnersList flex2"></ul>
	<p class="raceid dark"></p>
</script>


 <script id="load-info" type="text/template">


	<div class="flex_row flex-shrink0 flex_between">

		<div class="flex1 flex_row flex_between">
			<div class="top-main track white" id="meetingLocation">
				<%= (load_status !== 'load') ? '<i id="viewFeed" class="switchView fa fa-2x fa-caret-right"></i>' : '' %>
				<button class="meeting_track"><%- location %></button>
				<span class="nowrap padding-r10 lightgray smaller"><%- type %></span>
				<span class="nowrap padding-r10 lightgray smaller"><%- date %></span>
				<%= (load_status === 'load') ? '<button class="delete">Delete</button>' : '' %>				
			</div>
        </div>
	</div>


	<div class="top-sub flex_row flex-shrink0">
		<div class="rail-container flex_col flex1">
            <div class="flex_row">
                <label class=" flex-shrink0 padding-r20 runnercount" id="runnercount"><span class="weight-500"><%- runnercount %></span> runners</span></label>
            </div>
        </div>
	</div>	

	<div class="load-data flex1 flex_col">
		<div class="loadContainer flex1 flex_row">
			<div class="leftside flex_col flex1">
				<div class="load-info flex1" >
					<div class="loadHeader blueHilight border-bottom_50">

						<h3>History</h3>
						<div class="dataList">
							<ul class="dark_30pc flex_row">
								<li class="flex2 blueHilight">Time</li
								><li class="flex2 blueHilight">User</li
								><li class="flex2 blueHilight">Type</li
								><li class="flex4 blueHilight">Message</li>
							</ul>
							<div id="historyData"></div>
						</div>

						<h3>Source Files</h3>
						<div class="dataList">
							<ul class="dark_30pc flex_row">
								 <li class="flex1 blueHilight ">Time</li
								><li class="flex1 blueHilight ">Since</li
								><li class="flex3 blueHilight ">Feed</li>
							</ul>
							<div id="sourceData"></div>
						</div>

					</div>
				</div>
			</div>

			<div id="rightside" class="rightside flex_col flex1">
				<div id="importBox" class="flex_col flex1"></div>
			</div>
		</div>
	</div>
</script>

<script id="load-box" type="text/template">
	<div class="load-box flex1 flex_col loadHeader">
		<h3>Load Feed</h3>
		<div class="import-options flex-shrink0">
			<button class="feed_save button" data-feed="comment">Comment</button>
			<button class="feed_save button" data-feed="oneliners">One Liners</button>
			<button class="feed_save button" data-feed="nztxt">NZ TXT</button>
			<button class="feed_save button" data-feed="tips">Tips</button>
			<button class="feed_save button" data-feed="market">Market</button>
			<button class="feed_save button" data-feed="race_comment">Race Comment</button>
			<button class="feed_save button" data-feed="gear_changes">Gear</button>
			<button class="feed_save button hidden" data-feed="tab_fixed">TAB</button>
			<button class="feed_save button hidden" data-feed="ubet_fixed">UBET</button>
			<button class="feed_save button hidden" data-feed="lad_fixed">Ladbroke</button>
		</div>

		<textarea class="flex1" id="feed-textbox"></textarea>
	</div>
</script>


<script id="source-feed" type="text/template">
	<div class="load-box flex1 flex_col">
		<h3>Source Feed</h3>
		<div id="source" class="import-source flex1"></div>
	</div>
</script>




<script id="meetingHistory" type="text/template">
	<ul class="flex_row">
		<li class="flex2"><%- time %></li
		><li class="flex2"><%- user %></li
		><li class="flex2"><%- type %></li
		><li class="flex4"><%- message %></li
	</ul>
</script>

<script id="meetingSource" type="text/template">
	<ul class="flex_row" data-arrayid="<%- id %>">
		<li class="flex1"><%- time %></li
		><li class="flex1"><%- duration %></li
		><li class="flex3"><%= feed %></li>
	</ul>
</script>

<script id="meetingFiltertmpl" type="text/template">
    <div class="left">
        <input type="search" id="meetingfilter" class="meetingfilter flex-shrink0" name="meetingfilter" placeholder="Filter meetings">
    </div>
</script>


<script id="multDivEditor" type="text/template">
	<div id="wrapper" class="flex_col">
        <div id="modal_divs">
            <div class="div_container">
                <div id="divList"></div>
            </div>
            <ul id="multDivList"></ul>
            <ul id="dialogButtons">
                <button id="save_button">Save</button>
                <button id="cancel_button">Cancel</button>
            </ul>
        </div>
    </div>
</script>

<script id="multDiv" type="text/template">
	<li class="multipleDiv" data-key="<%- key %>">
		<ul class="flex_row">
			<li class="flex1"><%- name %></li>
			<li class="flex1"><input class="divEditField raceNumField" type="text" value="<%- racenumbers %>"></li>
			<li class="flex1"><%= prices %></li>
		</ul>
		<ul><%= runners %></ul>
	</li>
</script>

<script id="multPrice" type="text/template">
	<li data-index="<%- index %>">
		<input class="divEditField multField" type="text" data-field="price" value="<%- price %>">
	</li>
</script>

<script id="multRunner" type="text/template">
	<li class="flex_row" data-index="<%- index %>">
		<div class="flex1"><input class="divEditField multField" type="text" data-field="numbers" value="<%- number %>"></div>
		<div class="flex3"><input class="divEditField multField" type="text" data-field="names" value="<%- name %>"></div>
	</li>
</script>

<?php include_once DIR_VIEW . "/templates/races.tmpl.php"; ?>
<?php include_once DIR_VIEW . "/templates/runners.tmpl.php"; ?>


<body class="radial">

<div id="container" class="container" data-colourtheme="meeting-edit">


<?php include_once DIR_VIEW . "/templates/topPanel.php"; ?>


<!-- 		<div class="meeting_list backgroundImage1 border-right flex_col">

			<div class="meeting_list_tabs flex-shrink0">
				<ul>
					<li id="load" class="grayBorderBottom">Load</li
					><li id="meeting" class="grayBorderBottom">Meetings</li>
				</ul>
			</div>
			<div class="meeting_days flex-shrink0">
				<ul>
					<li class="lightgray" data-id="0">S</li>
					<li class="lightgray" data-id="1">M</li>
					<li class="lightgray" data-id="2">T</li>
					<li class="lightgray" data-id="3">W</li>
					<li class="lightgray" data-id="4">T</li>
					<li class="lightgray" data-id="5">F</li>
					<li class="lightgray" data-id="6">S</li>
				</ul>
			</div>
			<div class="meeting_types flex-shrink0">
				<ul>
					<li class="RA meetingTypeSelector" data-type="RA">RA</li>
					<li class="HA meetingTypeSelector" data-type="HA">HA</li>
					<li class="GR meetingTypeSelector" data-type="GR">GR</li>
				</ul>
			</div>
			<div class="meeting_sort flex-shrink0">
				<ul>
					<li class="ASC">Track</li>
					<li class="ASC">Date</li>
					<li class="ASC">Starttime</li>
				</ul>
			</div>
			<div id="meeting_dates" class="meeting_dates flex-shrink0 flex_row">
				<div class="dayname  flex1">
                    <p id="dayname" class="dayname"></p>
                </div>
                <div class="dateinput flex1">
                    <input id="dTime" type="text" name="date" value="" />
                </div>
                <div id="schedDateStart">
                    <label class="minus"></label>
					<label class="add"></label>
				</div>

			</div>

			<div id="meeting_load_filter" class="meeting_load_filter flex-shrink0">
				<ul>
					<li class="update"></li>
					<li class="load"></li>
					<li class="loaded"></li>
				</ul>
			</div>

			<ul class="meetingsList flex2"></ul>
			<div id="meetActionsContainer" class="meetActions flex-shrink0">
				<p class="meetingCount"></p>
				<div id="meetActionsDiv" class="meetActionsDiv"></div>

			</div>  <!-- backgroundImage1 -->
		</div>
 -->




		<div class="meeting_editor flex_col"></div>




		<div id="right-side-panel" class="right-side-panel flex_row">
			<div id="tabpanel" class="right-side-panel_tabs flex-shrink0 flex_col">
				<div class="openPortal showLeftPush"></div>
			</div>

			<div id="portal_content" class="right_slider_content flex1 flex_col">
				<div id="publicationsList" class="publicationsList flex-shirnk0"></div>
				<div id="portalMeeting" class="portalMeeting flex_col flex1"></div>
			</div>

		</div> <!-- close SearchPanel -->



</div> <!-- close container -->

<script type="text/javascript" src="/js/main.js"></script>
<script type="text/javascript" src="/js/feeds.js"></script>

<script type="text/javascript" src="/js/models/meeting.js"></script>
<script type="text/javascript" src="/js/models/race.js"></script>
<script type="text/javascript" src="/js/models/runner.js"></script>
<script type="text/javascript" src="/js/models/load.js"></script>
<script type="text/javascript" src="/js/models/portal.js"></script>
<script type="text/javascript" src="/js/models/search.js"></script>
<script type="text/javascript" src="/js/models/track.js"></script>
<script type="text/javascript" src="/js/models/groups.js"></script>

<script type="text/javascript" src="/js/collections/meetings.js"></script>
<script type="text/javascript" src="/js/collections/races.js"></script>
<script type="text/javascript" src="/js/collections/runners.js"></script>
<script type="text/javascript" src="/js/collections/load.js"></script>
<script type="text/javascript" src="/js/collections/tracks.js"></script>

<script type="text/javascript" src="/js/views/shared.js"></script>
<script type="text/javascript" src="/js/views/search.js"></script>
<script type="text/javascript" src="/js/views/meeting.js"></script>
<script type="text/javascript" src="/js/views/load.js"></script>
<script type="text/javascript" src="/js/views/races.js"></script>
<script type="text/javascript" src="/js/views/runners.js"></script>
<script type="text/javascript" src="/js/views/portal.js"></script>

<script type="text/javascript" src="/js/meetings_page.js"></script>

<script id="publicationListTemp" type="text/template">
    <li class="list_item <%= selected %>" data-arrayid="<%= index %>"><%= name %></li>
</script>

<script id="outputListTemp" type="text/template">
    <li class="list_item <%= theClass %>" data-arrayid="<%= index %>"><%= name %></li>
</script>

<script id="tips_format_name" type="text/template">
	<label for="tips_format_name">Name</label>
	<input id="tips_format_name" type="checkbox" >
</script>
<script id="tips_format_number" type="text/template">
	<label for="tips_format_number">Number</label>
	<input id="tips_format_number" type="checkbox" >
</script>


<script id="outputRace" type="text/template">
    <div class="outputHeaders flex_row" name="header">
    	<label class="blueHilight" for="output_header">Race header</label>
    	<button class="field button header copy" 	for="output_header">Copy</button>
    	<button class="field button header paste" 	for="output_header">Paste</button>
    </div>

    <input class="lightgray edit-block" id="output_header" name="header" value="<%= header %>" type="text" />

    <div class="outputHeaders flex_row" name="runner">
    	<label class="blueHilight" for="output_runner">Runners</label>
    	<button class="field button header copy" 	for="output_runner">Copy</button>
    	<button class="field button header paste" 	for="output_runner">Paste</button>
    </div>
    <input class="lightgray edit-block" id="output_runner" name="runner" value="<%= runner %>" type="text" />


    <div class="outputHeaders flex_row" name="scratched">
   		<label class="blueHilight" for="output_scratched">Scratched runners</label>
    	<button class="field button header copy" 	for="output_scratched">Copy</button>
    	<button class="field button header paste" 	for="output_scratched">Paste</button>
    </div>
    <input class="lightgray edit-block" id="output_scratched" name="scratched" value="<%= scratched %>" type="text" />


    <div class="outputHeaders flex_row" name="tip">
   		<label class="blueHilight" for="output_tip">Race footer</label>
    	<button class="field button header copy" 	for="output_tip">Copy</button>
    	<button class="field button header paste" 	for="output_tip">Paste</button>
    </div>
    <input class="lightgray edit-block" id="output_tip" name="tip" value="<%= tip %>" type="text" />


    <div class="outputHeaders flex_row" name="comment">
   		<label class="blueHilight" for="output_comment">Runners</label>
    	<button class="field button header copy" 	for="output_comment">Copy</button>
    	<button class="field button header paste" 	for="output_comment">Paste</button>
    </div>
    <input class="lightgray edit-block" id="output_comment" name="comment" value="<%= comment %>" type="text" />
</script>


<script id="outputTips" type="text/template">
    <div class="outputHeaders flex_row" name="header">
    	<label class="blueHilight" for="output_header">Tips Grid</label>
    	<button class="field button header copy" 	for="output_header">Copy</button>
    	<button class="field button header paste" 	for="output_header">Paste</button>
    </div>

    <div id="tips_grid" class="tips_grid">
	    <div class="lightgray flex_row tip_row_top" id="grid_top" name="header">
	    	<textarea class="lightgray tipsgrid flex1 flex-shrink0 tips_col_left" id="output_cell0" name="tips_cell0"><%= cell0 %></textarea>
	    	<textarea class="lightgray tipsgrid flex1 flex-shrink0" id="output_col1" name="tips_tipster_head"><%= tipster_head %></textarea>
	    </div>
	    <div class="lightgray flex_row" id="grid_bottom" name="header">
	    	<textarea class="lightgray tipsgrid flex-shrink0 tips_col_left" id="output_row1" name="tips_race_head"><%= race_head %></textarea>
	    </div>
	</div>

</script>

<script id="tags_output_header" type="text/template">
	<li class="tag list_item">name</li>
	<li class="tag list_item">name2</li>
	<li class="tag list_item">number</li>
	<li class="tag list_item">racetime</li>
	<li class="tag list_item">distance</li>
	<li class="tag list_item">claims</li>
	<li class="tag list_item">class</li>
	<li class="tag list_item">class2</li>
	<li class="tag list_item">prizemoney</li>
</script>

<script id="tags_output_runner" type="text/template">
	<li class="tag list_item">age</li>
	<li class="tag list_item">barrier</li>
	<li class="tag list_item">best</li>
	<li class="tag list_item">born</li>
	<li class="tag list_item">claim</li>
	<li class="tag list_item">colour</li>
	<li class="tag list_item">dam</li>
	<li class="tag list_item">damsire</li>
	<li class="tag list_item">sire</li>
	<li class="tag list_item">updown</li>
	<li class="tag list_item">form</li>
	<li class="tag list_item">gender</li>
	<li class="tag list_item">handicap</li>
	<li class="tag list_item">jockey</li>
	<li class="tag list_item">jockey2</li>
	<li class="tag list_item">nz_jockey</li>
	<li class="tag list_item">legend</li>
	<li class="tag list_item">livery</li>
	<li class="tag list_item">market</li>
	<li class="tag list_item">name</li>
	<li class="tag list_item">number</li>
	<li class="tag list_item">owner</li>
	<li class="tag list_item">prizemoney</li>
	<li class="tag list_item">rating</li>
	<li class="tag list_item">record</li>
	<li class="tag list_item">start</li>
	<li class="tag list_item">starts_table</li>
	<li class="tag list_item">firsts_table</li>
	<li class="tag list_item">seconds_table</li>
	<li class="tag list_item">thirds_table</li>
	<li class="tag list_item">placings_stats</li>
	<li class="tag list_item">cond_a_stats</li>
	<li class="tag list_item">cond_b_stats</li>
	<li class="tag list_item">cond_c_stats</li>
	<li class="tag list_item">cond_d_stats</li>
	<li class="tag list_item">cond_e_stats</li>
	<li class="tag list_item">trackform_stats</li>
	<li class="tag list_item">distform_stats</li>
	<li class="tag list_item">trackdistform_stats</li>
	<li class="tag list_item">firstup_stats</li>
	<li class="tag list_item">secondup_stats</li>
	<li class="tag list_item">thirdup_stats</li>
	<li class="tag list_item">fourthup_stats</li>
	<li class="tag list_item">jumps_stats</li>
	<li class="tag list_item">night_stats</li>
	<li class="tag list_item">wet_stats</li>
	<li class="tag list_item">finish1distancesum</li>
	<li class="tag list_item">trainer</li>
	<li class="tag list_item">trainer2</li>
	<li class="tag list_item">oldtrainer</li>
	<li class="tag list_item">trainerlocation</li>
	<li class="tag list_item">win</li>
	<li class="tag list_item">place</li>
	<li class="tag list_item">weight</li>
	<li class="tag list_item">winnings</li>
</script>

<script id="tags_output_scratched" type="text/template">
	<li class="tag list_item">age</li>
	<li class="tag list_item">barrier</li>
	<li class="tag list_item">best</li>
	<li class="tag list_item">born</li>
	<li class="tag list_item">colour</li>
	<li class="tag list_item">claim</li>
	<li class="tag list_item">dam</li>
	<li class="tag list_item">damsire</li>
	<li class="tag list_item">sire</li>
	<li class="tag list_item">updown</li>
	<li class="tag list_item">form</li>
	<li class="tag list_item">gender</li>
	<li class="tag list_item">handicap</li>
	<li class="tag list_item">jockey</li>
	<li class="tag list_item">legend</li>
	<li class="tag list_item">livery</li>
	<li class="tag list_item">market</li>
	<li class="tag list_item">name</li>
	<li class="tag list_item">number</li>
	<li class="tag list_item">owner</li>
	<li class="tag list_item">prizemoney</li>
	<li class="tag list_item">record</li>
	<li class="tag list_item">start</li>
	<li class="tag list_item">finish1</li>
	<li class="tag list_item">finish2</li>
	<li class="tag list_item">finish3</li>
	<li class="tag list_item">starttrack</li>
	<li class="tag list_item">finish1track</li>
	<li class="tag list_item">finish2track</li>
	<li class="tag list_item">finish3track</li>
	<li class="tag list_item">startdistance</li>
	<li class="tag list_item">finish1distance</li>
	<li class="tag list_item">finish2distance</li>
	<li class="tag list_item">finish3distance</li>
	<li class="tag list_item">starttrackdistance</li>
	<li class="tag list_item">finish1trackdistance</li>
	<li class="tag list_item">finish2trackdistance</li>
	<li class="tag list_item">finish3trackdistance</li>
	<li class="tag list_item">start1up</li>
	<li class="tag list_item">finish11up</li>
	<li class="tag list_item">finish21up</li>
	<li class="tag list_item">finish31up</li>
	<li class="tag list_item">start2up</li>
	<li class="tag list_item">finish12up</li>
	<li class="tag list_item">finish22up</li>
	<li class="tag list_item">finish32up</li>
	<li class="tag list_item">startx</li>
	<li class="tag list_item">finish1x</li>
	<li class="tag list_item">finish2x</li>
	<li class="tag list_item">finish3x</li>
	<li class="tag list_item">finish1distancesum</li>
	<li class="tag list_item">trainer</li>
	<li class="tag list_item">trainer2</li>
	<li class="tag list_item">oldtrainer</li>
	<li class="tag list_item">trainerlocation</li>
	<li class="tag list_item">win</li>
	<li class="tag list_item">place</li>
	<li class="tag list_item">weight</li>
	<li class="tag list_item">winnings</li>
</script>

<script id="tags_output_comment" type="text/template">
	<li class="tag list_item">age</li>
	<li class="tag list_item">barrier</li>
	<li class="tag list_item">best</li>
	<li class="tag list_item">born</li>
	<li class="tag list_item">claim</li>
	<li class="tag list_item">colour</li>
	<li class="tag list_item">dam</li>
	<li class="tag list_item">damsire</li>
	<li class="tag list_item">sire</li>
	<li class="tag list_item">updown</li>
	<li class="tag list_item">form</li>
	<li class="tag list_item">gender</li>
	<li class="tag list_item">handicap</li>
	<li class="tag list_item">jockey</li>
	<li class="tag list_item">jockey2</li>
	<li class="tag list_item">nz_jockey</li>
	<li class="tag list_item">legend</li>
	<li class="tag list_item">livery</li>
	<li class="tag list_item">market</li>
	<li class="tag list_item">name</li>
	<li class="tag list_item">number</li>
	<li class="tag list_item">owner</li>
	<li class="tag list_item">prizemoney</li>
	<li class="tag list_item">rating</li>
	<li class="tag list_item">record</li>
	<li class="tag list_item">start</li>
	<li class="tag list_item">starts_table</li>
	<li class="tag list_item">firsts_table</li>
	<li class="tag list_item">seconds_table</li>
	<li class="tag list_item">thirds_table</li>
	<li class="tag list_item">placings_stats</li>
	<li class="tag list_item">cond_a_stats</li>
	<li class="tag list_item">cond_b_stats</li>
	<li class="tag list_item">cond_c_stats</li>
	<li class="tag list_item">cond_d_stats</li>
	<li class="tag list_item">cond_e_stats</li>
	<li class="tag list_item">trackform_stats</li>
	<li class="tag list_item">distform_stats</li>
	<li class="tag list_item">trackdistform_stats</li>
	<li class="tag list_item">firstup_stats</li>
	<li class="tag list_item">secondup_stats</li>
	<li class="tag list_item">thirdup_stats</li>
	<li class="tag list_item">fourthup_stats</li>
	<li class="tag list_item">jumps_stats</li>
	<li class="tag list_item">night_stats</li>
	<li class="tag list_item">wet_stats</li>
	<li class="tag list_item">finish1distancesum</li>
	<li class="tag list_item">trainer</li>
	<li class="tag list_item">trainer2</li>
	<li class="tag list_item">oldtrainer</li>
	<li class="tag list_item">trainerlocation</li>
	<li class="tag list_item">win</li>
	<li class="tag list_item">place</li>
	<li class="tag list_item">weight</li>
	<li class="tag list_item">winnings</li>
</script>

<script id="tags_output_tip" type="text/template">
	<li class="tag list_item" data-field="tip">selections</li>
</script>

<script id="tipsgrid" type="text/template">
	<div class="panelMenuContainer flex1">
		<div id="publicationMenuContainer" class="publicationMenuContainer flex1"></div>
		<div id="newpanel" class="newpanel flex0">
			<input type="text" name="newtipspanel" class="newTipsPanel">
			<button class="button" id="newpanelbutton">New panel</button>
		</div>
	</div>

	<div id="gridMenuContainer" class="gridMenuContainer flex1"></div>

	<div id="tipsterMenuContainer" class="tipsterMenuContainer flex1"></div>

	<ul id="panelTipsters" class="paneltipsters flex2"></ul>
</script>


<script id="formatListTemp" type="text/template">
	<div id="formatingViewButtons" class="formatingViewButtons">
		<ul>
			<li class="plus" name="plus"></li>
			<li class="minus" name="minus"></li>
		</ul>
	</div>
	<ul class="outerformat">
		<li>

			<h3 data-pane="000s_pane">000s</h3>
			<ul class="innerformat" id="000s_pane">
				<li class="flex_row"><label>Runs:</label><input id="record_length" type="number" min="0" max="10" name="record_length"></li>
				<li class="flex_row"><label class="flex1">Spell character</label><input class="emerg flex2" id="record_spell" name="record_spell" type="text"></li>
			</ul>

			<h3 data-pane="comment_pane">Comment</h3>
			<ul class="innerformat" id="comment_pane">
				<li class="flex_row"><label class="flex1">First start</label><input class="emerg flex2" id="comment_firststart" name="comment_firststart" type="text"></li>
				<li class="flex_row">
					<label id="comment_clearform" class="button toggle flex1" name="comment_clearform">Remove 0:0-0-0</label>
					<label id="comment_fractions" class="button toggle flex1" name="comment_fractions">Fancy Fractions</label>
				</li>
			</ul>

			<h3 data-pane="time_pane">Date & Time</h3>
			<ul class="innerformat" id="time_pane">
				<li class="flex_row"><label class="flex1">Time Format</label><input class="emerg flex3" id="time_string" name="time_string" type="text"></li>
				<li class="flex_row"><label class="flex1">Date Format</label><input class="emerg flex3" id="date_format" name="date_format" type="text"></li>
			</ul>

			<h3 data-pane="emergencies_pane">Emergencies</h3>
			<ul class="innerformat" id="emergencies_pane">
				<li class="flex_row"><label class="flex1">Single</label><input class="emerg flex2" id="emergency_single" name="emergency_single" type="text"></li>
				<li class="flex_row"><label class="flex1">Plural</label><input class="emerg flex2" id="emergency_plural" name="emergency_plural" type="text"></li>
				<li class="flex_row"><label id="emergency_supress" class="button toggle flex1" name="emergency_supress">Suppress</label></li>
			</ul>

			<h3 data-pane="formbank_pane">Formbank</h3>
			<ul class="innerformat" id="formbank_pane">
				<li class="flex_row">
					<label id="formbank_suppress_200m" class="button toggle flex1" name="formbank_suppress_200m">Suppress 200m Sectionals</label>
					<li class="flex_row"><label class="flex1">Form</label><textarea class="flex5" id="runner_form" name="runner_form" type="text" /></li>
				</li>
			</ul>

			<h3 data-pane="header_pane">Meeting Header & Footer</h3>
			<ul class="innerformat" id="header_pane">
				<li class="flex_row"><label class="flex1">Header</label><textarea class="flex5" id="meeting_header" name="meeting_header" type="text" /></li>
				<li class="flex_row"><label class="flex1">Footer</label><textarea class="flex5" id="meeting_footer" name="meeting_footer" type="text" /></li>
			</ul>

			<h3 data-pane="market_pane">Market</h3>
			<ul class="innerformat" id="market_pane">
				<li class="flex_row"><label>Decimal places:</label><input id="market_places" name="market_places" type="number" min="0" max="10"></li>

				<li class="flex_row">
					<label class="flex2">Favourite</label>
					<input class="flex4" id="favourite_pre" name="favourite_pre" type="text" placeholdertext="Pre">
					<input class="flex4" id="favourite_post" name="favourite_post" type="text" placeholdertext="Post">
				</li>

				<li class="flex_row">
					<label id="market_strip_zero" class="button toggle flex1" name="market_strip_zero">Strip .00</label>
				</li>

			</ul>

			<h3 data-pane="prizemoney_pane">Prizemoney</h3>
			<ul class="innerformat" id="prizemoney_pane">
				<li class="flex_row"><label class="flex1">Nil prizemoney</label><input class="emerg flex2" id="nil_prizemoney" name="nil_prizemoney" type="text"></li>
				<li class="flex_row"><label>Decimal places:</label><input id="prizemoney_decimal" type="number" name="prizemoney_decimal" min="0" max="10"></li>
			</ul>

			<h3 data-pane="results_pane">Results</h3>
			<ul class="innerformat" id="results_pane">
				<li class="flex_row"><label class="flex1">Results</label><textarea class="flex5" id="results" name="results" type="text" /></li>
				<li class="flex_row"><label id="results_full" class="button toggle flex1" name="results_full">Full Results</label></li>
				<li class="flex_row"><label id="results_owner" class="button toggle flex1" name="results_owner">Display Owners</label></li>
			</ul>

			<h3 data-pane="runners_pane">Runners</h3>
			<ul class="innerformat" id="runners_pane">
				<li class="flex_row">
					<label class="flex2">Top Rater</label>
					<input class="flex4" id="toprater_pre" name="toprater_pre" type="text" placeholdertext="Pre">
					<input class="flex4" id="toprater_post" name="toprater_post" type="text" placeholdertext="Post">
				</li>

				<li class="flex_row"><label id="updown_arrow" class="button toggle flex1" name="updown_arrow">Up/Down Class Arrows</label></li>
				<li class="flex_row"><label id="wide_runners" class="button toggle flex1" name="wide_runners">Wide Runners</label></li>
				<li class="flex_row"><label id="blank_scratchings" class="button toggle flex1" name="blank_scratchings">Omit Scratchings</label></li>
				<li class="flex_row"><label class="flex1">Sort by</label><input class="emerg flex2" id="runner_sort" name="runner_sort" type="text"></li>
			</ul>

			<h3 data-pane="second_row_pane">Second Row</h3>
			<ul class="innerformat" id="second_row_pane">
				<li class="flex_row"><label class="flex1">Second Row</label><input class="emerg flex2" id="second_row" name="second_row" type="text"></li>
			</ul>

			<h3 data-pane="silks_pane">Silks</h3>
			<ul class="innerformat" id="silks_pane">
				<li class="flex_row"><label class="flex1">Variant</label><input class="emerg flex2" id="silks_variant" name="silks_variant" type="text"></li>
				<li class="flex_row"><label class="flex1">Library</label><input class="emerg flex2" id="silks_library" name="silks_library" type="text"></li>
				<li class="flex_row"><label id="race_silks" class="button toggle flex1" name="race_silks">Display silks per race</label></li>
				<li class="flex_row"><label id="runner_silks" class="button toggle flex1" name="runner_silks">Display silks per horse</label></li>
			</ul>

			<h3 data-pane="stats_pane">Stats</h3>
			<ul class="innerformat" id="stats_pane">
				<li class="flex_row"><label>Zero character for tables:</label><input id="table_zero_character" name="table_zero_character" type="text"></li>
				<li id="statformats" class="timeformats flex_row">
					 <input type="radio" name="stat" id="stats_hyphen" value="hyphen"><label for="stats_hyphen">6:3-2-1</label>
					 <input type="radio" name="stat" id="stats_fairfax" value="fairfax"><label for="stats_fairfax">6; 3-2-1</label>
					 <input type="radio" name="stat" id="stats_extended" value="extended"><label for="stats_extended">6 starts, 3-2-1</label>
				</li>
			</ul>

			<h3 data-pane="tips_pane">Tips</h3>
			<ul class="innerformat" id="tips_pane">
				<li class="flex_row"><label>Count:</label><input id="tips_length" name="tips_length" type="number" min="0" max="10"></li>
				<li class="flex_row"><label>Seperator</label><input id="tips_separator" name="tips_separator" type="text"></li>
				<li class="flex_row">
					<ul id="tipsformat" class="sortable">
					</ul>
				</li>
			</ul>

			<h3 data-pane="tipspanel_pane">Tips Panel</h3>
			<ul class="innerformat" id="tipspanel_pane">
				<li class="flex_row"><label id="tips_panel" class="button toggle flex4" name="tips_panel">Tips Panel</label></li>

				<li id="colwidthinputs" class="colwidthinputs flex_row">
					<input type="radio" name="colwidths" id="horizontal" value="horizontal"><label for="horizontal">Horizontal</label>
					<input type="radio" name="colwidths" id="vertical"   value="vertical"><label for="vertical">Vertical</label>
				</li>
				<li class="flex_row"><label class="flex1">column 1 width</label><input class="tips flex2" id="tips_col1_width" type="text" name="tips_col1_width"></li>
				<li class="flex_row"><label class="flex1">column 2 width</label><input class="tips flex2" id="tips_col2_width" type="text" name="tips_col2_width"></li>

				<li class="flex_row"><label class="flex1">Tips Cell</label><input class="tips flex2" id="tips_cell_style" type="text" name="tips_cell_style"></li>
				<li class="flex_row"><label class="flex1">Pick 1</label><input class="tips flex2" id="tips_pick1" type="text" name="tips_pick1"></li>
				<li class="flex_row"><label class="flex1">Picks</label><input class="tips flex2" id="tips_picks" type="text" name="tips_picks"></li>
				<li class="flex_row"><label class="flex1">Missing</label><input class="tips flex2" id="tips_missing" type="text" name="tips_missing"></li>

				<li class="flex_row"><label class="flex1">Best 1</label><input class="tips flex2" id="tips_best_1" type="text" name="tips_best_1"></li>
				<li class="flex_row"><label class="flex1">Best 2</label><input class="tips flex2" id="tips_best_2" type="text" name="tips_best_2"></li>
				<li class="flex_row"><label class="flex1">Best 3</label><input class="tips flex2" id="tips_best_3" type="text" name="tips_best_3"></li>
				<li class="flex_row">
					<label id="bests_as_row" class="button toggle flex1" name="bests_as_row">Output Bests as Row</label>
				</li>
				<li class="flex_row"><label class="flex1">Bests Header</label><input class="tips flex2" id="tips_bests_head" type="text" name="tips_bests_head"></li>
				<li class="flex_row"><label class="flex1">Bests Cell</label><input class="tips flex2" id="tips_bests_cell" type="text" name="tips_bests_cell"></li>

				<li class="flex_row">
					<label id="tips_poll" class="button toggle flex4" name="tips_poll">Tipsters Poll</label>
					<label class="flex2">Points for first:</label><input class="tips flex1" id="tips_poll_max" type="text" name="tips_poll_max">
				</li>
				<li class="flex_row"><label class="flex1">Poll Best</label><input class="tips flex2" id="tips_poll_best" type="text" name="tips_poll_best"></li>
				<li class="flex_row"><label class="flex1">Poll Cell</label><input class="tips flex2" id="tips_poll_cell" type="text" name="tips_poll_cell"></li>
				<li class="flex_row">
					<label id="tips_poll_list" class="button toggle flex1" name="tips_poll_list">Output Poll as List</label>
				</li>
				<li class="flex_row"><label class="flex1">List Raceheader</label><input class="tips flex2" id="poll_list_raceheader" type="text" name="poll_list_raceheader"></li>
				<li class="flex_row"><label class="flex1">List Best</label><input class="tips flex2" id="poll_list_best" type="text" name="poll_list_best"></li>
				<li class="flex_row"><label class="flex1">List Item</label><input class="tips flex2" id="poll_list_item" type="text" name="poll_list_item"></li>
			</ul>

			<h3 data-pane="weight_pane">Weight</h3>
			<ul class="innerformat" id="weight_pane">
				<li class="flex_row"><label>Decimal places:</label><input id="weight_decimal" name="weight_decimal" type="number" min="0" max="5"></li>
			</ul>
		</li>
	</ul>
</script>




<body class="radial">


<div id="container" class="container">
<?php include_once DIR_VIEW . "/templates/topPanel.php"; ?>


<?php/**
-------------------------------------------
								Column 1
-------------------------------------------
*/?>
<div class="outputContainer flex_row">

	<div class="outputColumn flex0 flex_col">
		<h3>Publications</h3>
		<ul id="publicationList" class="list_box flex2">
			<!-- publicationListTemp inserted here -->
		</ul>

		<div class="addDelete flex0">
			<button class="add button" id="addPublication">New</a>
			<button class="delete button" id="deletePublication">Delete</a>
		</div>
	</div>



<?php/**
-------------------------------------------
								Column 2
-------------------------------------------
*/?>
	<div class="publicationContent outputColumn flex0 flex_col">
		<div class="publication_info flex1">
<!-- 			<label for="PubID">ID</label>
			<input class="publication_id dark_80pc" type="text" name="id" id="id"  value="" readonly>
 -->
			<label for="name">Name</label>
			<input class="publication_name dark_80pc" type="text" name="name" id="name" value="">

			<label for="timezone">Timezone</label>
            <div id="timezoneSelect" class="track-rail" type="text/template"></div>

			<label for="state">State</label>
            <div id="stateSelect" class="track-rail" type="text/template"></div>

			<label for="market">Default Market</label>
            <div id="marketSelect" class="track-rail" type="text/template"></div>

		</div>
		<h3 class="flex-shrink0">Outputs</h3>
		<ul id="outputList" class="list_box flex3 flex-col">
			<!-- outputListTemp inserted here -->
		</ul>

		<div class="addDelete flex0">
			<button class="add button" id="addOutput">New</a>
			<button class="copy button" id="duplicateOutput">Duplicate</a>
			<button class="delete button" id="deleteOutput">Delete</a>
		</div>

	</div>

<?php/**
-------------------------------------------
								Column 3
-------------------------------------------
*/?>
	<div class="column-wide flex2 flex_col">

        <div class="dark_30pc template-block flex1 flex_col">

			<div class="outputHeader flex_row">
				<div id="outputTypeSelectorContainer"></div>
				<span class="output_id" id="output_id"></span>
				<button class="blueHilight button header convert">Convert</button>
			</div>


	        <label class="blueHilight" for="output_name">Name</label>
	        <input class="lightgray output_name" type="text" id="output_name" name="name" val="">

	        <div id="outputContent"></div>
	        <div>
	        	<label for="prefix">Script</label>
				<input class="import_script" type="text" name="import_script" id="import_script" value="">
			</div>

        </div>

 		<div class="addDelete flex0">
			<button class="save button" id="copyOutput">Copy</a>
			<button class="save button" id="pasteOutput">Paste</a>
			<button class="save button" id="saveOutput">Save</a>
		</div>
    </div>



	<div id="formattingColumn" class="formattingcolumn flex1 flex_col">
		<div id="formattinglinks" class="formattinglinks flex-shrink0">
			<label>Formatting</label>
			<label>Tags</label>
			<label>Tips grid</label>
		</div>
		<ul id="formatList" class="formatList list_box flex_col flex1"></ul>
	</div>



</div>
</div> <!-- closes main -->

<script type="text/javascript" src="/js/views/shared.js"></script>
<script type="text/javascript" src="/js/models/groups.js"></script>
<script type="text/javascript" src="/js/outputs_page.js"></script>
<script type="text/javascript" src="/js/main.js"></script>


<script id="raceDataHeader" type="text/template">
    <li class="race_number flex1"></li
    ><li class="race_number flex4">Race</li
    ><li class="race_time flex8">Time</li
    ><li class="race_name flex10">Race Name</li
    ><li class="race_name2 flex6">Name 2</li
    ><li class="race_class flex6">Class</li
    ><li class="race_class2 flex3">Class 2</li
    ><li class="race_class2 flex6">Claims</li
    ><li class="race_distance flex2">Distance</li>
</script>
<script id="raceData" type="text/template">
    <li class="border-bottom_50 <%= discrepancy %>" data-arrayid="<%= index %>">
        <ul class="race_data lightgray flex_row <%= selected %> <%= disabled %>">

            <li class="runner_number flex1"> <button class="disable_button"><i class="fa <%= disabled == 'scratched' ? 'fa-plus' : 'fa-remove' %> fa-fw <%= disabled %> race_disable" aria-hidden="true"></i></button></li>

            <li class="race_number flex4" ><input type="text" class="textBold" name="number"  id="race_number"  value="<%= number %>" autocomplete="off"></li>
            <li class="race_time flex8"><input type="text"  name="racetime"  id="race_time"  value="<%= time %>" autocomplete="off"></li>
            <li class="race_name flex10"><input type="text" name="name"  id="race_name"  value="<%= name %>" autocomplete="off"></li>
            <li class="race_name2 flex6"><input type="text" name="name2"  id="race_name2"  value="<%= name2 %>" autocomplete="off"></li>
            <li class="race_class flex6"><input type="text" name="class"  id="race_class"  value="<%= race_class %>" autocomplete="off"></li>
            <li class="race_class2 flex3"><input type="text" name="class2"  id="race_class2"  value="<%= race_class2 %>" autocomplete="off"></li>
            <li class="race_claim flex6"><input  type="text" name="claims"  id="race_claim"  value="<%= claim %>" autocomplete="off"></li>
            <li class="race_distance flex2"><input  type="text"  name="distance"  id="race_distance"  value="<%= distance %>" autocomplete="off"></li>
        </ul>
    </li>
</script>



<script id="racePrizesHeader" type="text/template">
    <li class="race_number flex1">Race</li
    ><li class="race_time flex1">Time</li
    ><li class="race_name flex3">Race Name</li
    ><li class="race_prize flex1">Prize pool</li
    ><li class="race_first flex1">1st</li
    ><li class="race_second flex1">2nd</li
    ><li class="race_third flex1">3rd</li
    ><li class="race_fourth flex1">4th</li
    ><li class="race_fifth flex1">5th</li
    ><li class="race_bonus flex3">Bonus</li>
</script>
<script id="racePrizes" type="text/template">
    <li class="border-bottom_50 <%= discrepancy %>" data-arrayid="<%= index %>">
        <ul class="race_data flex_row <%= selected %>">
            <li class="race_number flex1"><input type="text" class="textBold" name="number"  id="race_number"  value="<%= number %>" autocomplete="off"></li>
            <li class="race_time flex1"><input   type="text" name="racetime"  id="race_time"  value="<%= time %>" autocomplete="off"></li>
            <li class="race_name flex3"><input   type="text"  name="name"  id="race_name"  value="<%= name %>" autocomplete="off"></li>
            <li class="race_prize flex1"><input  type="text" name="prizepool"  id="race_prize"  value="<%= prize %>" autocomplete="off"></li>
            <li class="race_first flex1"><input  type="text" name="first"  id="race_first"  value="<%= first %>" autocomplete="off"></li>
            <li class="race_second flex1"><input type="text" name="second"  id="race_second"  value="<%= second %>" autocomplete="off"></li>
            <li class="race_third flex1"><input  type="text" name="third"  id="race_third"  value="<%= third %>" autocomplete="off"></li>
            <li class="race_fourth flex1"><input type="text" name="fourth"  id="race_fourth"  value="<%= fourth %>" autocomplete="off"></li>
            <li class="race_fifth flex1"><input  type="text" name="fifth"  id="race_fifth"  value="<%= fifth %>" autocomplete="off"></li>
            <li class="race_bonus flex3"><input  type="text" name="prizebonus"  id="race_bonus"  value="<%= bonus %>" autocomplete="off"></li>
        </ul>
    </li>
</script>



<script id="raceCommentHeader" type="text/template">
    <li class="race_number flex3">Race</li
    ><li class="race_name flex3">Race Name</li
    ><li class="race_comment flex4">Comment</li
    ><li class="race_comment flex4">Stewards</li
    ><li class="race_comment flex4">Gear Changes</li>
</script>
<script id="raceComment" type="text/template">
    <li class="border-bottom_50 <%= discrepancy %>" data-arrayid="<%= index %>">
        <ul class="race_data lightgray  flex_row <%= selected %>">
            <li class="race_number flex1"><input type="text" class="textBold" name="number"  id="race_number"  value="<%= number %>" autocomplete="off"></li>
            <li class="race_name flex3"><input   type="text"  name="name"  id="race_name"  value="<%= name %>" autocomplete="off"></li>
            <li class="race_comment flex4">
                <textarea name="comment" id="race_comment" contenteditable="true"><%= comment %></textarea>
            </li>
            <li class="race_comment flex4">
                <textarea name="stewards" id="race_stewards" contenteditable="true"><%= stewards %></textarea>
            </li>
            <li class="race_comment flex4">
                <textarea name="gearchanges" id="race_gearchanges" contenteditable="true"><%= gearchanges %></textarea>
            </li>
        </ul>
    </li>
</script>

<script id="raceTipsHeader" type="text/template">
    <li class="race_number flex1">Race</li
    ><li class="race_time flex1">Time</li
    ><li class="race_name flex4">Race Name</li
    ><li class="race_comment flex1">Tips</li
    ><li class="race_comment flex1">Likely Leader</li
    ><li class="race_comment flex1">Class Factor</li
    ><li class="race_comment flex1">Wild Card</li
    ><li class="race_comment flex4">Suggested Bet</li
    ><li class="race_comment flex4">Flexi First4</li>
</script>
<script id="raceTips" type="text/template">
    <li class="border-bottom_50 <%= discrepancy %>" data-arrayid="<%= index %>">
        <ul class="race_data lightgray  flex_row <%= selected %>">
            <li class="race_number flex1">      <input type="text" class="textBold" name="number"  id="race_number"  value="<%= number %>" autocomplete="off"></li>
            <li class="race_time flex1">        <input type="text" name="racetime"  id="race_time"  value="<%= time %>" autocomplete="off"></li>
            <li class="race_name flex4">        <input type="text"  name="name"  id="race_name"  value="<%= name %>" autocomplete="off"></li>
            <li class="race_comment flex1"><input type="text" value="<%= wd_tips %>" readonly></li>
            <li class="race_comment flex1"><input type="text" value="<%= wd_leader %>" readonly></li>
            <li class="race_comment flex1"><input type="text" value="<%= wd_class %>" readonly></li>
            <li class="race_comment flex1"><input type="text" value="<%= wd_wild %>" readonly></li>
            <li class="race_comment flex4"><input type="text" value="<%= wd_bet %>" readonly></li>
            <li class="race_comment flex4"><input type="text" value="<%= wd_flexi %>" readonly></li>
        </ul>
    </li>
</script>




<script id="raceResultsHeader" type="text/template">
     <li class="race_number flex1">Race</li
     ><li class="race_time flex1">Time</li
     ><li class="race_steward flex1">Divs</li>
</script>
<script id="raceResults" type="text/template">
    <li class="border-bottom_50 <%= discrepancy %>" data-arrayid="<%= index %>">
        <ul class="race_data lightgray  flex_row <%= selected %>">
            <li class="race_number flex1">      <input type="text" class="textBold" name="number"  id="race_number"  value="<%= number %>" autocomplete="off"></li>
            <li class="race_time flex1">        <input type="text" name="racetime"  id="race_time"  value="<%= time %>" autocomplete="off"></li>
            <li class="race_divs flex2"><p class="textBold" id="race_string"><%= divstring %></p></li>
            <% if ("" != src) { %>
                <li class="race_src flex-shrink0"><a target="_blank" href="<%= src %>" class="textBold" id="race_src">Src</a></li>
            <% } %>

        </ul>

    </li>
</script>



<script id="raceMultiplesHeader" type="text/template">
    <li class="race_number flex1">Race</li
    ><li class="flex3">Name</li
    ><li class="flex10"><button id="generate_multiples" class="generate_multiples">Generate</button></li>
</script>
<script id="raceMultiples" type="text/template">
    <li class="border-bottom_50 <%= discrepancy %>" data-arrayid="<%= index %>">
        <ul class="race_data flex_row <%= selected %>">
            <li class="race_number flex1"><input type="text" class="textBold" name="number"  id="race_number"  value="<%= number %>" autocomplete="off"></li>
            <li class="race_name flex3">        <input type="text"  name="name"  id="race_name"  value="<%= name %>" autocomplete="off"></li>
            <div id="raceMultiplesPlaceholder<%= id %>" class="flex_row flex10"></div>
        </ul>
    </li>
</script>

<script id="raceMultipleButton" type="text/template">
    <li class="flex1"><button class="raceMultipleButton <%= enabled %>" data-multiple="<%= id %>" data-race="<%= race %>" ><%= name %></button></li>
</script>



<script id="divEditor" type="text/template">
    <div id="wrapper" class="flex_col">
        <div id="modal_divs">
            <div class="div_container">
                <div id="divList"></div>
            </div>
            <ul id="dialogButtons">
                <button id="save_button">Save</button>
                <button id="cancel_button">Cancel</button>
            </ul>
        </div>
    </div>
</script>

<script id="placeDiv" type="text/template">
    <ul class="flex_row" data-index="<%= index %>">
        <li class="flex1"><input data-field="position" type="text" class="divEditField placingField" value="<%= position %>"></li>
        <li class="flex1"><input data-field="name"     type="text" class="divEditField placingField" value="<%= name %>"></li>
        <li class="flex1"><input data-field="number"   type="text" class="divEditField placingField" value="<%= number %>"></li>
        <li class="flex1"><input data-field="win"      type="text" class="divEditField placingField" value="<%= win %>"></li>
        <li class="flex1"><input data-field="place"    type="text" class="divEditField placingField" value="<%= place %>"></li>
    </ul>
</script>

<script id="raceDiv" type="text/template">
    <ul class="flex_row" data-index="<%= index %>">
        <li class="flex1">
            <input data-field="<%= field %>_runners"    type="text" class="divEditField divField" value="<%= runners %>">
        </li>
        <li class="flex1">
            <input data-field="<%= field %>_div"        type="text" class="divEditField divField" value="<%= div %>">
        </li>
    </ul>
</script>

<script id="divMeta" type="text/template">
    <ul class="flex_row">
        <li class="flex1">
            <input data-field="<%= field %>" type="text" class="divEditField metaField" value="<%= value %>">
        </li>
    </ul>
</script>

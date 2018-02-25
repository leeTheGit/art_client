
<script id="runnersDataHeader" type="text/template">
    <li class="runner_record flex3"      >Record</li
    ><li class="runner_tip flex2"         >Tip</li
    ><li class="runner_name flex1"        ></li 
    ><li class="runner_name flex9"        >Name</li
    ><li class="runner_tip flex2"         >Em</li
    ><li class="runner_tip flex2 centre"         >Nat</li
    ><li class="runner_bar flex2"         >Bar</li
    ><li class="runner_legend flex4"      >Legend</li
    ><li class="runner_jockey flex7"      >Jockey</li
    ><li class="runner_claim flex2"       >Clm</li
    ><li class="runner_jockey flex6"      >Jockey 2</li
    ><li class="runner_row flex2"         >Row</li
    ><li class="runner_weight flex2"      >Wgt</li
    ><li class="runner_trainer flex7"     >Trainer</li
    ><li class="runner_location flex5"    >Location</li
    ><li class="runner_hcp flex2"         >Hcp</li
    ><li class="runner_rating flex3 centre" >Rtg</li
    ><li class="runner_market flex3 centre" >Market</li>
</script>

<script id="runnersData" type="text/template">
    <li class="border-bottom_50 <%- discrepancy %>" data-arrayid="<%- index %>">
        <ul class="runner_data flex_row  <%- selected %> <%- scratched %>">
            <li class="runner_number flex2">      <button data-id="<%- runnerid %>" class="scratch_button"><%- number %></button></li
            ><li class="runner_record flex3">     <input type="text"  name="record"     value="<%- record %>" autocomplete="off" title="Last 5: <%- lastfive %>"></li
            ><li class="runner_tip flex2">        <button class="tip_button <%= tip ? '' : 'not_tipped' %>"><%= tip ? tip : 'Tip' %></button></li
            ><li class="runner_discrepancy flex1">       <span data-id="<%- runnerid %>" class="runner-discrepancy <%= discrepancy ? 'fa fa-asterisk discrepancy_toggle' : 'hidden' %>"></span></li
            ><li class="runner_name flex9">       <button data-id="<%- runnerid %>" class="runnername"><%- name %></button></li
            ><li class="runner_emergency flex2">  <input type="text" name="emergency"  value="<%- emergency %>" autocomplete="off"></li
            ><li class="runner_country flex2">    <input type="text" class="weight-400" name="country"    value="<%- country %>" autocomplete="off"></li
            ><li class="runner_bar flex2">        <input type="text" name="barrier"    value="<%- barrier %>" autocomplete="off"></li
            ><li class="runner_legend flex4">     <input type="text" class="weight-400" name="legend"     value="<%- legend %>" autocomplete="off"></li
            ><li class="runner_jockey flex7">     <input type="text" name="jockey" value="<%- jockey %>" autocomplete="off"></li
            ><li class="runner_claim flex2">      <input type="text" class="weight-400" name="claim"      value="<%- claim %>" autocomplete="off"></li
            ><li class="runner_jockey2 flex6">    <input type="text" class="weight-400" name="jockey2"    value="<%- jockey2 %>" autocomplete="off"></li
            ><li class="runner_row flex2">        <input type="text" name="row"        value="<%- row %>" autocomplete="off"></li
            ><li class="runner_weight flex2">     <input type="text"  name="weight"     value="<%- weight %>" autocomplete="off"></li
            ><li class="runner_trainer flex7">    <input type="text" name="trainer"    value="<%- trainer %>" autocomplete="off"></li
            ><li class="runner_location flex5">   <input type="text" class="weight-400" name="trainerlocation"   value="<%- trainerlocation %>" autocomplete="off"></li
            ><li class="runner_hcp flex2">        <input type="text" class="weight-400" name="hcp"        value="<%- hcp %>" autocomplete="off"></li
            ><li class="runner_rating flex3">     <input type="text" name="rating"     value="<%- rating %>" class="centre" autocomplete="off"></li
            ><li class="runner_market flex3">     <input type="text" name="market"     value="<%- market %>" class="centre <%- market_missing %> <%- market_unset %>" placeholder="<%- market_aap %>" <%- disabled %> autocomplete="off" tabindex="100<%- index %>"></li>
        </ul>
    </li>
</script>



<script id="runnersBreedingHeader" type="text/template">
    <li class="runner_name flex4"        >Name</li
    ><li class="runner_country flex1"     >Nat</li
    ><li class="runner_sire flex3"        >Sire</li
    ><li class="runner_dam flex3"         >Dam</li
    ><li class="runner_damsire flex3"     >Damsire</li
    ><li class="runner_livery flex7"      >Livery</li
    ><li class="runner_grade flex1"       >Grade</li
    ><li class="runner_age flex1"         >Age</li
    ><li class="runner_born flex2"        >Born</li
    ><li class="runner_sex flex1"         >Sex</li
    ><li class="runner_colour flex1"      >Colour</li>
</script>
<script id="runnersBreeding" type="text/template">
    <li class="border-bottom_50 <%- discrepancy %>" data-arrayid="<%- index %>">
        <ul class="runner_data  flex_row <%- scratched %> <%- selected %>">
            <li class="runner_number flex1">     <button data-id="<%- runnerid %>" class="scratch_button"><%- number %></button></li
            ><li class="runner_name flex4">       <button data-id="<%- runnerid %>" class="runnername"><%- name %></button></l
            ><li class="runner_country flex1"><input   type="text" name="country"    value="<%- country %>" autocomplete="off"></li
            ><li class="runner_sire flex3"><input      type="text" name="sire"        class="weight-400" value="<%- sire %>" autocomplete="off"></li
            ><li class="runner_dam flex3"><input       type="text" name="dam"         class="weight-400" value="<%- dam %>" autocomplete="off"></li
            ><li class="runner_damsire flex3"><input   type="text" name="damsire"     class="weight-400" value="<%- damsire %>" autocomplete="off"></li
            ><li class="runner_livery flex7"><input    type="text" name="livery"     value="<%- livery %>" autocomplete="off" class="italic"></li
            ><li class="runner_grade flex1"><input     type="text" name="grade"      value="<%- grade %>" autocomplete="off"></li
            ><li class="runner_age flex1"><input       type="text" name="age"        value="<%- age %>" autocomplete="off"></li
            ><li class="runner_born flex2"><input      type="text" name="born"       value="<%- born %>" autocomplete="off"></li
            ><li class="runner_sex flex1"><input       type="text" name="gender"     value="<%- gender %>" autocomplete="off"></li
            ><li class="runner_colour flex1"><input    type="text" name="colour"     value="<%- colour %>" autocomplete="off"></li>
        </ul>
    </li>
</script>




<script id="runnersFormHeader" type="text/template">
    <li class="runner_name flex2"        >Record</li
    ><li class="runner_ud flex5"          >Name</li
    ><li class="runner_ud flex1"          >U/D</li
    ><li class="runner_winnings flex2"    >Winnings</li
    ><li class="runner_form flex12"        >Form</li
    ><li class="runner_number flex1"      ></li
    ><li class="runner_trials flex12"      >Trials</li>
</script>
<script id="runnersForm" type="text/template">
    <li class="border-bottom_50 <%- discrepancy %>" data-arrayid="<%- index %>">
        <ul class="runner_data flex_row  <%- scratched %> <%- selected %>">
            <li class="runner_number flex1">     <button data-id="<%- runnerid %>" class="scratch_button"><%- number %></button></li
            ><li class="runner_record flex2">     <input type="text"  name="record"     value="<%- record %>" autocomplete="off"></li
            ><li class="runner_name flex5">       <button data-id="<%- runnerid %>" class="runnername"><%- name %></button></li
            ><li class="runner_ud flex1"><input        type="text" name="ud"         value="<%- ud %>" autocomplete="off"></li
            ><li class="runner_winnings flex2"><input  type="text" name="winnings"   value="<%- winnings %>" autocomplete="off"></li
            ><li class="runner_form flex12 weight-400">
                <textarea contenteditable="false"><%- form %></textarea>
            </li
            ><li class="runner_number flex1"></li
            ><li class="runner_trials flex12 weight-400">
                <textarea contenteditable="false"><%- trials %></textarea>
            </li>

        </ul>
    </li>
</script>



<script id="runnersStatsHeader" type="text/template">
    <li class="runner_name flex10">Name</li
    ><li class="runner_start flex5">Starts</li
    ><li class="runner_start flex4">1sts</li
    ><li class="runner_start flex4">2nds</li
    ><li class="runner_start flex4">3rds</li
    ><li class="runner_start flex4">Plc.</li
    ><li class="runner_start flex4">Firm</li
    ><li class="runner_start flex4">Good</li
    ><li class="runner_start flex4">Soft</li
    ><li class="runner_start flex4">Heavy</li
    ><li class="runner_start flex4">Synth.</li
    ><li class="runner_start flex4">Track</li
    ><li class="runner_start flex4">Dist.</li
    ><li class="runner_start flex4">T/D</li
    ><li class="runner_start flex4">1st Up</li
    ><li class="runner_start flex4">2nd Up</li
    ><li class="runner_start flex4">3rd Up</li
    ><li class="runner_start flex4">4th Up</li
    ><li class="runner_start flex4">Wet</li
    ><li class="runner_start flex3">Best</li
    ><li class="runner_start flex3">Speed</li>
</script>

<script id="runnersStats" type="text/template">
    <li class="border-bottom_50 <%- discrepancy %>" data-arrayid="<%- index %>">
        <ul class="runner_data flex_row <%- scratched %> <%- selected %>">
            <li class="runner_number flex3">     <button data-id="<%- runnerid %>" class="scratch_button"><%- number %></button></li
            ><li class="runner_name flex10">       <button data-id="<%- runnerid %>" class="runnername"><%- name %></button></li
            ><li class="runner_start flex5">        <input type="text" name="starts"    value="<%- starts %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- firsts %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- seconds %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- thirds %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- placings %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- track_firm %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- track_good %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- track_soft %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- track_heavy %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- track_synthetic %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- trackform %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- distform %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- trackdistform %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- firstup %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- secondup %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- thirdup %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- fourthup %>" autocomplete="off"></li
            ><li class="runner_start flex4">        <input type="text" name="starts"    value="<%- wet %>" autocomplete="off"></li
            ><li class="runner_start flex3">        <input type="text" name="best"      value="<%- best %>" autocomplete="off"></li
            ><li class="runner_start flex3">        <input type="text" name="speed"     value="<%- speed %>" autocomplete="off"></li>
        </ul>
    </li>
</script>



<script id="runnersCommentHeader" type="text/template">
    <li class="runner_name flex4"        >Name</li
    ><li class="runner_comment flex12"        >Comment</li
    ><li class="runner_number flex2"></li
    ><li class="runner_comment flex12"        >Brief</li
    ><li class="runner_number flex2"></li
    ><li class="runner_comment flex3"        >Gear</li>
</script>
<script id="runnersComment" type="text/template">
    <li class="border-bottom_50 <%- discrepancy %>" data-arrayid="<%- index %>">
        <ul class="runner_data flex_row <%- scratched %> <%- selected %>">
            <li class="runner_number flex1">     <button data-id="<%- runnerid %>" class="scratch_button"><%- number %></button></li
            ><li class="runner_name flex4">       <button data-id="<%- runnerid %>" class="runnername"><%- name %></button></li
            ><li class="runner_comment flex12 weight-400">
                <textarea name="comment" contenteditable="true"><%- comment %></textarea>
            </li
            ><li class="runner_number flex2"></li
            ><li class="runner_comment flex12 weight-400">
                <textarea name="brief" contenteditable="true"><%- brief %></textarea>
            </li
            ><li class="runner_number flex2"></li
            ><li class="runner_comment flex3 weight-400">
                <textarea name="gear" contenteditable="true"><%- gear %></textarea>
            </li>
        </ul>
    </li>
</script>


<!-- position"
"betting"
"weight"
"jockey"
"position"
"favourite"
"racetime"
"sectional"
"sectionaldistance"
"lengths"
"claim" -->

<script id="runnersResultsHeader" type="text/template">
    <li class="runner_name flex4"        >Name</li
    ><li class="runner_comment flex2"        >Pos.</li
    ><li class="runner_comment flex3"        >Fluctuations</li
    ><li class="runner_comment flex2"        >Fav</li
    ><li class="runner_comment flex2"        >Weight</li
    ><li class="runner_comment flex2"        >Claim (-)</li
    ><li class="runner_comment flex4"        >Jockey</li
    ><li class="runner_comment flex2"        >Margin</li
    ><li class="runner_comment flex2"        >Racetime</li
    ><li class="runner_comment flex2"        >Sectional Time</li
    ><li class="runner_comment flex2"        >Sectional Dist.</li>
</script>
<script id="runnersResults" type="text/template">
    <li class="border-bottom_50 <%- discrepancy %>" data-arrayid="<%- index %>">
        <ul class="runner_data flex_row <%- scratched %> <%- selected %>">
            <li class="runner_number flex1">     <button data-id="<%- runnerid %>" class="scratch_button"><%- number %></button></li
            ><li class="runner_name flex4">       <button data-id="<%- runnerid %>" class="runnername"><%- name %></button></li
            ><li class="runner_comment flex2 weight-400"><input disabled type="text" name="position"     value="<%- position %>" autocomplete="off"></li
            ><li class="runner_comment flex3 weight-400"><input disabled type="text" name="betting"     value="<%- betting %>" autocomplete="off"></li
            ><li class="runner_comment flex2 weight-400"><input disabled type="text" name="favourite"     value="<%- favourite %>" autocomplete="off"></li
            ><li class="runner_comment flex2 weight-400"><input disabled type="text" name="weight"     value="<%- weight %>" autocomplete="off"></li
            ><li class="runner_comment flex2 weight-400"><input disabled type="text" name="claim"     value="<%- claim %>" autocomplete="off"></li
            ><li class="runner_comment flex4 weight-400"><input disabled type="text" name="jockey"     value="<%- jockey %>" autocomplete="off"></li
            ><li class="runner_comment flex2 weight-400"><input disabled type="text" name="lengths"     value="<%- lengths %>" autocomplete="off"></li
            ><li class="runner_comment flex2 weight-400"><input disabled type="text" name="racetime"     value="<%- racetime %>" autocomplete="off"></li
            ><li class="runner_comment flex2 weight-400"><input disabled type="text" name="sectional"     value="<%- sectional %>" autocomplete="off"></li
            ><li class="runner_comment flex2 weight-400"><input disabled type="text" name="sectionaldistance"     value="<%- sectionaldistance %>" autocomplete="off"></li>
        </ul>
    </li>
</script>




<script id="runnersPortalHeader" type="text/template">
    <li class="runner_name flex2"        >Name</li
    ><li class="runner_comment flex8"     >Comment</li
    ><li class="runner_class flex1"       >Class</li
    ><li class="runner_rating flex1"      >Rating</li
    ><li class="runner_market flex1"      >Market</li>

</script>
<script id="runnersPortal" type="text/template">
    <li class="border-bottom_50 <%- discrepancy %>" data-arrayid="<%- index %>">
        <ul class="runner_data flex_row <%- scratched %> <%- selected %>">
            <li class="runner_number flex1"><input    type="text" name="number"     value="<%- number %>" autocomplete="off"></li
            ><li class="runner_name flex2"><input      type="text" name="name"       value="<%- name %>" autocomplete="off"></li
            ><li class="runner_comment flex8"><input   type="text" name="comment"    value="<%- comment %>" autocomplete="off"></li
            ><li class="runner_class flex1"><input     type="text" name="class"      value="<%- updown %>" autocomplete="off"></li
            ><li class="runner_rating flex1"><input    type="text" name="rating"     value="<%- rating %>" autocomplete="off"></li
            ><li class="runner_market flex1"><input    type="text" name="market"     value="<%- market %>" autocomplete="off"></li>
        </ul>
    </li>
</script>


<script id="selectionListTmplProgram" type="text/template">
         <div class="photo_selectionWindow">
        

        <div id="selectionListSearchBar" class="selectionListSearchBar">
            <input id="selectionListSearch" class="selectionListSearch" tabindex="20" placeholder="Show title" />
            <input id="selectionListSearchSubtitle"  class="selectionListSearchSubtitle"  tabindex="30" placeholder="Episode title" />
        </div>
        <div class="searchFeedback">
            <p id="resultsCount" class="resultsCount"></p>
        </div>
        <div id="selectionlistitems" class="selectionlistitems">
            <ul></ul>
        </div>
    </div>
</script>

<script id="selectionListItemProgramTmpl" type="template">
    <li class="searchDrag <%= showType %>" data-id="<%= programid %>" data-arrayid="<%= arrayid %>" data-type="<%= type %>">
        <a class="selectionListItem" href="">
            <p class="programListTitle"><%= showtitle %></p>
            <% if (year) { %>
                <p class="programListYear">(<%= year %>)</p>
            <% } %>
            <p class="programListSubTitle"><%= subtitle %></p>
            <p class="searchAssignmentCount"><%= imageCount %></p>
        </a>
    </li>
</script>


<script id="selectionListItemTmpl" type="text/template">
    <li class="searchDrag" data-id="<%= creditid %>" data-arrayid="<%= arrayid %>" data-type="<%= type %>"><a class="selectionListItem" href=""><%= name %></a></li>
</script>


<body>
    <div class="sandbox">
         <div class="photo_selectionWindow">
        

        <div id="selectionlistitems" class="selectionlistitems">
<ul><li class="searchDrag show ui-draggable" data-id="b4aef908-cabe-4ba9-9b5c-6ab0531be351" data-arrayid="0" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Charmed</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">1</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="1521ef36-cefb-4bd9-b556-ce4de72e73ca" data-arrayid="1" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Barbie: Princess Charm School</p>
            
                <p class="programListYear">(2011)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="8a271803-ae8f-4300-94cd-f9ef6e34368c" data-arrayid="2" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Charms For The Easy Life</p>
            
                <p class="programListYear">(2002)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="ca4a33d4-4d90-41a5-93eb-e2f49df6c943" data-arrayid="3" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Fatal Charm</p>
            
                <p class="programListYear">(1990)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="702ba428-019f-4f90-86cc-eab387e13cf4" data-arrayid="4" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Geek Charming</p>
            
                <p class="programListYear">(2011)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="f503942f-1e9d-400e-baa7-4762cff0257d" data-arrayid="5" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Prince Charming</p>
            
                <p class="programListYear">(2001)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="39c7a143-44d4-43ae-9058-41600ffddcb5" data-arrayid="6" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Prince Charming</p>
            
                <p class="programListYear">(2001)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="3fb432aa-5c25-412c-8c42-75d3b3dcc7a7" data-arrayid="7" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Prince Charming</p>
            
                <p class="programListYear">(2001)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="4cd64045-45f3-49ea-b0be-3c3589f09041" data-arrayid="8" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Prince Charming</p>
            
                <p class="programListYear">(2001)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="61dc976f-2709-4ccf-84d5-de33cd681a0e" data-arrayid="9" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Prince Charming</p>
            
                <p class="programListYear">(2001)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="6cb731e6-afec-4fd1-a904-d3d8fc91cc74" data-arrayid="10" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Prince Charming</p>
            
                <p class="programListYear">(2001)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="a9535ba3-ed36-454d-9fc5-f0e52e3f41be" data-arrayid="11" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Prince Charming</p>
            
                <p class="programListYear">(2001)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="b516c974-85ac-4416-97bd-8c72430197d0" data-arrayid="12" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Prince Charming</p>
            
                <p class="programListYear">(2001)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="d191eb38-ecd3-4b2d-9e64-01074c1a3f19" data-arrayid="13" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Prince Charming</p>
            
                <p class="programListYear">(2001)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="f431405e-f61b-4318-ad86-a5ff6ccb6316" data-arrayid="14" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Prince Charming</p>
            
                <p class="programListYear">(2001)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="bb6b3efe-4829-42cb-b868-c34391df7cc4" data-arrayid="15" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">Princess Charming</p>
            
                <p class="programListYear">(1934)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li><li class="searchDrag  ui-draggable" data-id="51ca0d12-5945-4f57-9e02-87a751fb1c63" data-arrayid="16" data-type="show">
        <a class="selectionListItem" href="">
            <p class="programListTitle">The Charm Of La Boheme</p>
            
                <p class="programListYear">(1937)</p>
            
            <p class="programListSubTitle"></p>
            <p class="searchAssignmentCount">0</p>
        </a>
    </li>
</ul>
</div>
    </div>



    </div>
<!-- <script type="text/javascript" src="/js/photos_page.js"></script> -->

<script>
$(function() 
{

    $('.searchDrag').draggable({ helper: 'clone',
                                      distance:10,
                                      opacity:0.95, })
                        .on(
                            {
                                drag: function(e, ui) 
                                {
                                    var i = 5;
                                },
                                dragstop :function(e, ui) 
                                {
                                    var i = 5;
                                }
                            }
                        );


    // var search = Tvdb.searchFactory('show', 'getPhotos');
    // search.init($('.sandbox'), {'imagecount': 'true', 'movies': 'true'}, 'title');
});
</script>
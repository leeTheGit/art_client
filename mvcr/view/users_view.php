<?php
include_once DIR_VIEW . "/templates/topPanel.php"; ?>

<script id="userListTemp" type="text/template">
    <li class="list_item <%= theClass %>" data-id="<%= id %>" data-arrayid="<%= index %>"><%= name %></li>
</script>

<script id="groupListTemp" type="text/template">
    <li class="list_item <%= theClass %>" data-arrayid="<%= index %>"><%= group %></li>
</script>

<script id="groupSelectTemp" type="text/template">
	<option value="<%= groupid %>"><%= group %></option>
</script>


<body class="radial">



<div class="columnContainer"> <!-- page container -->


	<div class="tracks flex1 flex_row"> <!-- Contains users and groups columns --> 



<?php/**
-------------------------------------------
								Column 3
-------------------------------------------
*/?>

		<div class="flex1 flex_col"> <!-- Users list column -->
			



			<div class="columnHeader flex-shrink0">
				<h3>Groups</h3>
			</div>

			<div class="flex1 flex_row"> <!-- Groups list column -->


				<div class="flex1 flex_col flex1">
					<div class="flex1">
						<ul id="groupList" class="list_box"></ul> 
					</div> 
					<div class="addDelete flex-shrink0">
						<button class="add button" id="addGroup">New</button>
						<button class="delete button" id="deleteGroup">Delete</button>
					</div>
				</div>


<?php/**
-------------------------------------------
								Column 4
-------------------------------------------
*/?>
				<div class="flex1 flex_col"> <!-- Groups list column -->

					<div class="groupInfo columns1content">
									 
						<label for="GroupID">ID</label>
						<input class="groupid dark_60pc" type="text" name="GroupID"   id="GroupID"  value="" readonly>
						
						<label for="name">Name</label>
						<input class="groupname dark_60pc" type="text" name="name" id="GroupName" value="">
						 
						<label for="GroupAccess">Access Level</label>
						<select class = "primaryChannelSelect" name="GroupAccess" id="GroupAccess">
							<option value="full">Full Access</option>
							<option value="self">Restricted</option>
						</select>
					</div>
				</div>
			</div>

		</div>




		<div class="flex1 flex_col border-right-black right-margin-15"> <!-- Users list column -->
			
			<div class="columnHeader flex-shrink0 ">
				<h3>Users</h3>
			</div>



			<div class="flex1 flex_row">  <!-- Users column -->



<?php/**
-------------------------------------------
								Column 1
-------------------------------------------
*/?>


				<div class="flex1 flex_col"> <!-- Users list column -->


					<div class="flex1 flex_col">
						<div class="user flex_col flex1">
							<ul id="userList" class="list_box flex1">
								<!-- userListTemp inserted here -->
							</ul> 
						</div>

						<div class="addDelete flex-shrink0">
							<button class="add button" id="addUser">New</button>
							<button class="delete button" id="deleteUser">Delete</button>
						</div>
					</div>
				</div>


<?php/**
-------------------------------------------
								Column 2
-------------------------------------------
*/?>

				<div class="usersInfo flex1" id="usersInfo"> <!-- Users info column -->
					<label for="UserID">ID</label>
					<input class="userid dark_50pc" type="text" name="UserID"   id="UserID"  value="" readonly>
					
					<label for="name">Username</label>
					<input class="username dark_50pc" type="text" name="name" id="UserName" value="">
					
					<label for="firstname">First name</label>
					<input class="firstname dark_50pc" type="text" name="firstname" id="FirstName" value="">
					
					<label for="lastname">Last name</label>
					<input class="lastname dark_50pc" type="text" name="lastname" id="LastName" value="">
					
					<label for="userpassword">Password</label>
					<input class="userpassword dark_50pc" type="password" name="password" id="UserPassword" value="">

					<label for="GroupSelect">Group</label>
					<select class="groupselect" name="GroupSelect"  id="GroupSelect"></select>

					<label for="UserAccess">Access Level</label>
					<select class = "primaryChannelSelect" name="UserAccess" id="UserAccess">
						<option value="admin">Admin</option>
						<option value="editor">Editor</option>
						<option value="user">User</option>
						<option value="read">Read Only</option>
						<option value="read_all_meetings">Read Only - All meetings</option>
						<option value="portal">Portal</option>

					</select>
				</div> 
			</div>
		</div>





	</div>


</div> <!-- closes main -->
<script src="/js/users_page.js"></script>
<script type="text/javascript" src="/js/main.js"></script>


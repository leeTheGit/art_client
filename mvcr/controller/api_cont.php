<?php
\mvcr\service\l::og('in teh api controller');
include_once DIR_SERV.'/apicaller.php';

$controller = (!empty($uri[2])) ?     rawurlencode($uri[2]) : '';
$programRef = (!empty($uri[3])) ? '/'.rawurlencode($uri[3]) : '';
$field      = (!empty($uri[4])) ? '/'.rawurlencode($uri[4]) : '';
$fieldid    = (!empty($uri[5])) ? '/'.rawurlencode($uri[5]) : '';

$json = false;

if(isset($_SESSION['username']) && isset($_SESSION['password']) ) {
    $username = $_SESSION['username'];
    $password = $_SESSION['password'];
}
\mvcr\service\l::og($username . ':' . $password);



$req = ["url" => API . "{$controller}{$programRef}{$field}{$fieldid}"];


$req['method'] = strtoupper($request_method);
if(count($_FILES)>0) {
	$req['method'] = 'FILE';
} 

	
if(!empty($username) && !empty($password) ) {
	$req['user'] = $username;
	$req['pass'] = $password;
}

\mvcr\service\l::og('crating api caller');
\mvcr\service\l::og($req);

$apiRequest = new \mvcr\service\ApiCaller($req);
\mvcr\service\l::og('Made!!');

$result = $apiRequest->sendRequest($data, $json);

// logThis($result);
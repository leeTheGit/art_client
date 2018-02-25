<?php

include_once 'apicaller.php';
include_once DIR_MODEL.'/dates.php';

$context = 'log';
$scope 		= (!empty($uri[2])) ? urlencode($uri[2]) : '';
$programRef = (!empty($uri[3])) ? urlencode($uri[3]) : '';
$pageContent = DIR_VIEW ."/log_view.php";




$req = array("url"    => API . "log/",
             "method" => "GET");
    

switch ($action)
{
    case 'delete':
        $req['method'] = "DELETE";
        break;

    case 'add':
        $req['method'] = "POST";
        break;
    
    case 'update':
        $req['method'] = "PUT";
        break;

}
// logThis($req['url']);

$apiRequest = new ApiCaller($req);
$update     = $apiRequest->sendRequest($data);
exit;

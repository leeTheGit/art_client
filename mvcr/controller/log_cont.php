<?php

include_once 'apicaller.php';
include_once DIR_MODEL.'/dates.php';

$context = 'log';
$scope 		= (!empty($uri[2])) ? urlencode($uri[2]) : '';
$programRef = (!empty($uri[3])) ? urlencode($uri[3]) : '';
$pageContent = DIR_VIEW ."/log_view.php";

$type   = (!empty($data['type']))   ? urlencode($data['type']) : '';
$action = (!empty($data['action'])) ? urlencode($data['action']) : '';

logThis($type);
logThis($action);
logThis('just logged');

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

    default:
        logThis('in the api default');
        $req['method'] = "GET";

}


if($type === 'api') {
    $req = array("url"    => API . "log/");
    logThis(json_encode($data));
    $apiRequest = new ApiCaller($req);
    $text       = $apiRequest->sendRequest($data);

} else {

    switch ($req['method'])
    {
        case 'DELETE':
            $f = fopen('logfile.txt', 'w');
            $text = '';
            fwrite($f, $text);
            fclose($f);
            break;

        case 'add':
            break;
        
        case 'update':
            break;

        default:
            $text = file_get_contents('logfile.txt');
    }
}

echo str_replace('¡', '<br>', $text);
exit;

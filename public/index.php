<?php
// phpinfo();return;
// /etc/php5/apache2/php.ini


session_start();
session_write_close();


define('DIR_WEB',   dirname(__FILE__));
define('DIR_ROOT',  DIR_WEB .'/..');
define('DIR_MVCR',  DIR_ROOT.'/mvcr');
define('DIR_CONF',  DIR_ROOT.'/config');
define('DIR_MODEL', DIR_MVCR.'/model');
define('DIR_VIEW',  DIR_MVCR.'/view');
define('DIR_CTRL',  DIR_MVCR.'/controller');
define('DIR_ROUT',  DIR_MVCR.'/router');
define('DIR_SERV',  DIR_MVCR.'/service');
define('DIR_LOG',   DIR_ROOT.'/log');

include_once DIR_CONF.'/config.php';
include_once DIR_MODEL.'/functions.php';
include_once DIR_SERV.'/l.php';
$request_method = strtolower($_SERVER['REQUEST_METHOD']);
$data = NULL;


switch ($request_method)  
{  
    case 'get':  
        $data = $_GET;  
        break;  
    case 'post':
        if(count($_FILES)>0) {
            $data = $_FILES;
        } else {
            $data = $_POST;
        }
        break;
    case 'put':  
        $data = file_get_contents('php://input');
        parse_str($data, $data);
        break;
    case 'patch':  
        $data = file_get_contents('php://input');
        parse_str($data, $data);
        break;  

}  



// Ajax already encodes [space] to '%20', so rawurlencode double encodes. 
$ru  = str_replace('%20', ' ', $_SERVER['REQUEST_URI']);
$qmp = strpos($ru, '?');


// map path and params from the request uri
list($path, $params) = $qmp === FALSE ? array($ru, NULL) : array(substr($ru, 0, $qmp), substr($ru, $qmp + 1));
$uri = explode('/', $path); // seperate path elements


$i = 0; // used as a counter for path elements
// iterate through each path element and create a numbered CONST for each one	
foreach ($uri as $part) {
    if (strlen($part) && $part !== '..' && $part !== '.') {
        define('URI_PART_'.$i++, $part);
    }
}

// if there are params define them as a CONST
define('URI_PARAM', isset($params) ? $params : ''); // Used for the redirect in the router
define('URI_PATH', $path); // Used throughout router

include_once DIR_ROUT.'/router.php';
include_once DIR_ROUT.'/config.routes.php';


if ($ctrlFile = Router::controller()) {
    \mvcr\service\l::og($ctrlFile);
    include_once $ctrlFile;
}
else {	
    header('HTTP/1.1 404 Not Found');
}


if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) 
    AND strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest' && !isset($_GET['callback'])) {
    exit(json_encode($result));
}
include_once DIR_MODEL.'/callback_check.php';
if ( isset($_GET['callback']) && is_callback_valid::callback($_GET['callback']) ) {
    header("Content-Type: application/json; charset=utf-8");
    exit("{$_GET['callback']}(".json_encode($result).");");
}
else { //display the page
	include_once DIR_VIEW . "/_partials/header.html";
	include_once $pageContent;
	include_once DIR_VIEW . "/_partials/footer.html";
}
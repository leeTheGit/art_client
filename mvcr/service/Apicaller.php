<?php
namespace mvcr\service;

class Apicaller
{

	private $_app_id 	= null;
	private $_app_key 	= null;
	private $_api_url	= null;
	private $_method	= null;
	private $_bearer    = null;
	private $_params	= null;
	protected $_HTTP;
	private $requestBody;
	private $requestLength;
	private $json;


	public function __construct($setup)
	{
		$this->_app_id  = $setup['user'] ?? '';
		$this->_app_key = $setup['pass'] ?? '';
		$this->_bearer  = $setup['bearer'] ?? '';
		$this->_HTTP    = (isset($setup['secure']) && $setup['secure'] === True) ? 'https://' : 'http://';

		$this->_api_url = $setup['url'];
		$this->_method  = $setup['method'];
	}

	private function buildRequestBody ()
	{
	    if (!is_array($this->_params)) {
	        throw new \InvalidArgumentException('Invalid data input for postBody.  Array expected');
	    }
		$data = http_build_query($this->_params, '', '&');
	   	$this->requestBody = $data;
	}


	private function doExecute(&$ch)
	{
		return curl_exec($ch);
	}

	private function executeGet(&$ch)
	{
		return $this->doExecute($ch);
	}

	private function executePost(&$ch)
	{

	    if ($this->json)  {
	    	$this->requestBody = json_encode($this->_params);
 	    }  else {
	        $this->buildRequestBody();
	    }

	    curl_setopt($ch, CURLOPT_POSTFIELDS, $this->requestBody);
	    curl_setopt($ch, CURLOPT_POST, 1);
	    return $this->doExecute($ch);
	}
	// private function executeFile(&$ch)
	// {

	// 	$woo = 'temp'.rand( 0 , 100000 );
	// 	mkdir('/tmp/'.$woo, 0777, true) or die(logThis(print_r(error_get_last(),1)));

	// 	$filePath = '/tmp/'.$woo.'/'.$_FILES['file']['name'] ;

	// 	$moved = move_uploaded_file ( $_FILES['file']['tmp_name'] , $filePath );

	// 	$data['filedata'] = new CurlFile($filePath, $_FILES['file']['type'], $_FILES['file']['name']);

	// 	// $data['filedata'] = "@".$filePath;
 // 		curl_setopt($ch, CURLOPT_POST, true);
	//     curl_setopt($ch, CURLOPT_POSTFIELDS, $data );




	//     $foo = $this->doExecute($ch);

	//     return $foo;
	// }

	private function executePut(&$ch)
	{
		if (!is_string($this->requestBody)) {
	        $this->buildRequestBody();
	    }

	    $this->requestLength = strlen($this->requestBody);

	    $fh = fopen('php://memory', 'rw');
	    fwrite($fh, $this->requestBody);
	    rewind($fh);
	    curl_setopt($ch, CURLOPT_INFILE, $fh);
	    curl_setopt($ch, CURLOPT_INFILESIZE, $this->requestLength);
	    curl_setopt($ch, CURLOPT_PUT, true);
	    return $this->doExecute($ch);
	}

	private function executeDelete(&$ch)
	{
	    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
	    return $this->doExecute($ch);
	}

	public function sendRequest($request_params = array(), $json = false)
	{
		$body = '';
		$header = '';

		$result = null;

		$this->json = $json;
 		try {

			$this->_params = $request_params;

			if (strtolower($this->_method) === 'get' && count($request_params) != 0) {
				$get_params = http_build_query($request_params);
				$this->_api_url .= "/?".$get_params;
			}
			// $f = fopen('request.txt', 'w');
			$ch = curl_init();
			\mvcr\service\l::og($this->_HTTP. $this->_api_url);
			curl_setopt($ch, CURLOPT_URL, $this->_HTTP. $this->_api_url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_VERBOSE, 1);
			curl_setopt($ch, CURLOPT_HEADER, 1);
			// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	  		// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			// curl_setopt($ch, CURLOPT_STDERR, $f);

			if ($this->_bearer) {
				curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " + $this->_bearer]);
			}


			if ($this->_app_id && $this->_app_key) {
				curl_setopt($ch, CURLOPT_USERPWD, $this->_app_id.":".$this->_app_key);
			}

			if ($this->_method === 'GET'){
				$result = $this->executeGet($ch);
			} elseif ($this->_method === 'PUT') {
				$result = $this->executePut($ch);
			} elseif ($this->_method === 'DELETE') {
				$result = $this->executeDelete($ch);
			} elseif ($this->_method === 'POST') {
				$result = $this->executePost($ch);
			}

			$code = curl_getinfo($ch, CURLINFO_HTTP_CODE );
			// $header_length = self.ch.getinfo( self.ch.HEADER_SIZE )
			list($header, $body) = preg_split("/\r\n(?=\{)/", $result);
			// logThis($code);
			// logThis($body);

			curl_close($ch);

			switch($code) {
				case 401:
					header('HTTP/1.0 401 Unauthorized');
					$body = json_decode($body);
					return $body->message;
				case 550:
					header('HTTP/1.1 550 Permission Denied');
					$body = json_decode($body);
					return $body->message;
				case 400:
					header('HTTP/1.1 400 Bad request');
					break;
				case 404:
					header('HTTP/1.1 404 Not Found');
					break;
			}



			if ($code == 200 || $code == 201) {

				if (strpos($result, '<br') > -1 ) {
					header('HTTP/1.1 501 Internal Error');
					exit($result);
				}
				$result = json_decode($body);

			}

			//check if we're able to json_decode the result correctly
			if( $body == null  ) {
				throw new \Exception($this->_method ." - " .$this->_api_url.': request was not correct<br />'.$result);
			}

			return $result;


		} catch( \Exception $e ) {
			\mvcr\service\l::og('API CALL ERROR: ' . $e->getMessage());
			echo 'Message: ' . $e->getMessage();
			print_r($result);
		}
	}
}

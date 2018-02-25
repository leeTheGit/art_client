<?php

class ApiCaller
{

	private $_app_id 	= null;
	private $_app_key 	= null;
	private $_api_url	= null;
	private $_method	= null;
	private $_params	= null;
	private $requestBody;
	private $requestLength;
	private $json;


	public function __construct($setup)
	{

		$this->_app_id  = (isset($setup['user'])) ? $setup['user'] : '';
		$this->_app_key = (isset($setup['pass'])) ? $setup['pass'] : '';
		$this->_api_url = $setup['url'];
		$this->_method  = $setup['method'];
	}

	private function buildRequestBody ()
	{
	    if (!is_array($this->_params)) {
	        throw new InvalidArgumentException('Invalid data input for postBody.  Array expected');
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
	// 	logThis('sending photo...');
	// 	$woo = 'temp'.rand( 0 , 100000 );
	// 	mkdir('/tmp/'.$woo, 0777, true) or die(logThis(print_r(error_get_last(),1)));

	// 	$filePath = '/tmp/'.$woo.'/'.$_FILES['file']['name'] ;
	// 	logthis('saved image to '.$filePath);
	// 	$moved = move_uploaded_file ( $_FILES['file']['tmp_name'] , $filePath );

	// 	$data['filedata'] = new CurlFile($filePath, $_FILES['file']['type'], $_FILES['file']['name']);
	// 	logThis($data);
	// 	// $data['filedata'] = "@".$filePath;
 // 		curl_setopt($ch, CURLOPT_POST, true);
	//     curl_setopt($ch, CURLOPT_POSTFIELDS, $data );




	//     $foo = $this->doExecute($ch);
	//     logThis($foo);
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
		// fclose($fh);

	}

	private function executeDelete(&$ch)
	{
	    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
	    return $this->doExecute($ch);

	    // return '{"data": "Hello", "success":true}';
	}

	public function sendRequest($request_params = array(), $json = false)
	{
		$body = '';
		$header = '';
		$this->json = $json;
 		try {

			$this->_params = $request_params;

			if (strtolower($this->_method) === 'get' && count($request_params) != 0) {
				$get_params = http_build_query($request_params);
				$this->_api_url .= "/?".$get_params;
			}
			// $f = fopen('request.txt', 'w');
			$ch = curl_init();
			logThis('http://'. $this->_api_url);
			curl_setopt($ch, CURLOPT_URL, 'http://'. $this->_api_url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_VERBOSE, 1);
			curl_setopt($ch, CURLOPT_HEADER, 1);
			// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	  		// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			// curl_setopt($ch, CURLOPT_STDERR, $f);
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
			} elseif ($this->_method === 'FILE') {
				$result = $this->executeFile($ch);}

			// logThis($result);
			$code = curl_getinfo($ch, CURLINFO_HTTP_CODE );
			// list($header, $body) = explode("\r\n\r\n", $result, 2);
			list($header, $body) = preg_split("/\r\n(?=\{)/", $result);

			curl_close($ch);
			// logThis($code);
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


			// logThis($code);
			if ($code == 200 || $code == 201) {
				// logThis(strpos($result, '<br'));
				if (strpos($result, '<br') > -1 ) {
					header('HTTP/1.1 501 Internal Error');
					exit($result);
				}
				$result = json_decode($body);
			}

			//check if we're able to json_decode the result correctly
			if( $body === false  ) {
				throw new Exception($this->_method ." - " .$this->_api_url.': request was not correct<br />'.$result);
			}

			return $result;


		} catch( Exception $e ) {
			logThis('API CALL ERROR: ' . $e->getMessage());
			echo 'Message: ' . $e->getMessage();
			print_r($result);
		}
	}
}

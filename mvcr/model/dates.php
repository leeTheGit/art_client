<?php

class dateMaker  {
	protected $myDate;
	
	function __construct() {
		date_default_timezone_set('Australia/Melbourne');
		$this->myDate = new DateTime();
	}
	
	function timeKeyLen($stime, $etime) {
	    $start = strtotime($stime);
		$end = strtotime($etime);
		logThis($stime);
		logThis($etime);
		logThis($end-$start);
		return ($end-$start) / 60;
	}

	function nextTimeKey($time, $seconds=1800) {
		$t = strtotime($time);
		$t += $seconds;
		return strftime("%Y-%m-%d %H:%M:%S", $t);
	}

	function tomorrowDate($date, $seconds=86400) {
		$t = strtotime($date);
		$t += $seconds;
		return strftime("%Y-%m-%d", $t);
	}



	function unixToString($time) {
		$t = strtotime($time);
		return strtolower(strftime("%l.%M%p", $t));
	}

	function programWidth($stime, $etime) {
		$start = strtotime($stime);
		$end   = strtotime($etime);
		// BELOW: * 3 is a zoom value... of sorts
		//		  - 1 is to offset the 1px border for each list item	
		//return ((($end-$start) / 60) * 3) - 1 ;

		//no formatting to be done here. this should just returnthe base value for the desired with. The javascript will have to do ll the formatting on the user end so we can get live stuff
		return (($end-$start) / 60); 
	}

	function startTime($t) {
		if(!$t){return;}
		$theTime = strtotime($t);
		return strtolower(strftime("%l.%M%p", $theTime));
	}

	function dateof($t) {
		if(!$t){return;}
		$theTime = strtotime($t);
		return strftime("%a %d-%m-%y", $theTime);
	}

	function adjustTZ($time, $toTZ, $fromZT = 'UTC') {
		$toTZ = new DateTimeZone($toTZ);
		$fromZT = new DateTimeZone($fromZT);

		$ts = new DateTime($time, $fromZT);
		$ts->setTimezone($toTZ);

		return $ts->format('Y-m-d H:i:s');
	}

	function getDayNames() {
		return array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
	}



}


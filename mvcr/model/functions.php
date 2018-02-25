<?php

function keyline($dl) {
	echo "</tr>";
	$objKeys = array_keys(get_object_vars($dl[0]));
	foreach ($objKeys as $keyHead) {
	
		if($keyHead=="Publication") {
			echo "<td><span class='heavy'>" . $keyHead . "</span></td>";
		}
		else {
			echo "<td>" . $keyHead . "</td>";
		}
	}
	echo "</tr>";
}


function dayKeys() {
	
	$daterer  = new dateMaker();
	$today = $daterer->getYMD();
	$dailyDates = $daterer->dayKeyDates(); // "yyyy-mm-dd"
	$dayNames = Array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
	
	for($i=0; $i<7; $i++) {	
		if($dailyDates[$i] == $today) {
	?>			
			<li id="currentDay"><a href="#" onclick="refreshDeadLines(getDateToday())"><?php echo $dayNames[$i];?></a></li>
	<?php
		}
		else {
	?>
			<li id="otherDay"><a href="#" onclick="refreshDeadLines('<?php echo $dailyDates[$i];?>')"><?php echo $dayNames[$i];?></a></li>
	<?php
		}
	}
}


function logThis($text, $mode = 'a')
{
    if ( is_array($text) || is_object($text)) {
        $text = print_r($text,1);
    }
    if (gettype($text) == 'integer') {
        $text = 'int(' . strval($text) .')';
    }
    if (gettype($text) == 'boolean') {
        $text = 'bool(' . intval($text) .')';
    }
    if ($text === 'clear') {
        $text = '';
        $mode = 'w';
    }
    $caller = debug_backtrace();
    $file = basename($caller[0]['file']);
    $line = $caller[0]['line'];
    $func = ( isset($caller[1]) ) ? $caller[1]['function'].'()' : '';  
    $f = fopen('logfile.txt', $mode);
    $text = $file . ': ' . $line . ' - ' . $func . ': "' . $text . '"';
    $text = PHP_EOL.PHP_EOL.PHP_EOL.$text. '¡';
    fwrite($f, $text);
    fclose($f);
}


/**    Calculate a precise time difference. 
    @param string $start result of microtime() 
    @param string $end result of microtime(); if NULL/FALSE/0/'' then it's now 
    @return flat difference in seconds, calculated with minimum precision loss 
*/ 
function microtime_diff( $start, $end=NULL ) { 
    if( !$end ) { 
        $end= microtime(); 
    } 
    list($start_usec, $start_sec) = explode(" ", $start); 
    list($end_usec, $end_sec) = explode(" ", $end); 
    $diff_sec= intval($end_sec) - intval($start_sec); 
    $diff_usec= floatval($end_usec) - floatval($start_usec); 
    return floatval( $diff_sec ) + $diff_usec; 
} 
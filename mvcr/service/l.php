<?php
namespace mvcr\service;

if (!defined('REQUEST_ID')) {
    define('REQUEST_ID', substr(str_shuffle(md5(time())),0,5));
}

class l 
{
    private static $file = null;
    private static $function = null;
    


    public static function og($text, $mode = 'a', $db = '')
    {
        if (True === False) {return;}

        if ($db === 'sql') {
            $text = $text->prepare(\Yii::$app->db->queryBuilder)->createCommand()->rawSql;
        }

        if ( is_array($text) || is_object($text) ) {
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
        $path = dirname($caller[0]['file']);
        $line = $caller[0]['line'];
        $func = ( isset($caller[1]) ) ? $caller[1]['function'].'()' : '';
        $fileOutput = ''; 
        $funcOutput = '';
        
        if ($file != static::$file) {
            static::$file = $file;
            $fileOutput =  $path . '/' . static::$file . PHP_EOL;
        }

        if ($func != static::$function) {
            static::$function = $func;
            $funcOutput =   ' ▶ ︎' . 
                            static::$function . ': ' . PHP_EOL;
        }

        $output = 
                REQUEST_ID . ' | ' . 
                $fileOutput .
                $funcOutput .
                '  ▶ ︎' . $line . ': ︎' . 
                $text . '"'. 
                '¡' . PHP_EOL . PHP_EOL;

        $f = fopen(DIR_LOG.'/logfile.txt', $mode);
        fwrite ($f, $output);
        fclose($f);
    }


    public static function trace()
    {
        $caller = debug_backtrace();
        $btrace = [];
        foreach(array_reverse( $caller ) as $call) {
            $btrace[] = (object) [
                'file' =>(isset($call['file'])) ? $call['file'] : '',
                'line' => (isset($call['line'])) ? $call['line'] : '',
                'class' => (isset($call['class'])) ? $call['class'] : '',
                'function' => (isset($call['function'])) ? $call['function'] : '', 
                // 'args' => (isset($call['args'])) ? $call['args'] : '' 
            ];
        }
        self::og($btrace);
    }
}


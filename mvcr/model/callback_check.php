<?php 


class is_callback_valid
{
	/* Function : callback($callback)
	 * Purpose  : checks if JSONP callback has been tampered with or is dangerous
	 * @prop    : $callback take a JSONP input
	 * Return   : true if safe
	 */
	public function callback($callback)
	{
		return !preg_match( '/[^0-9a-zA-Z\$_]|^(abstract|boolean|break|byte|case|catch|char|class
							|const|continue|debugger|default|delete|do|double|else|enum|
							export|extends|false|final|finally|float|for|function|goto|
							if|implements|import|in|instanceof|int|interface|long|native
							|new|null|package|private|protected|public|return|short|static
							|super|switch|synchronized|this|throw|throws|transient|true|
							try|typeof|var|volatile|void|while|with|NaN|Infinity|
							undefined)$/', $callback);
	}
}

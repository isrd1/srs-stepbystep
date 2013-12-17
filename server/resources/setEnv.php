<?php
/**
 * Sets the environment
 * Could contain time and region settings, at the moment it just contains the location of the config.xml file and error level and display.
 * @filesource
 * @package resources
 */
/**
 * Set up environment change this to the path for your config.xml.php file which is in this format:
 * if you want to use sqlite then the username and password can be blank and the dns becomes the appropriate one
 * for pdo sqlite: sqlite:path to database/db file name.
<config>
   <rootPath>
	/Users/isrd1/Dropbox/web/srs-Steps
   </rootPath>
   <username>YOUR DB USERNAME</username>
   <password>YOUR DB PASSWORD</password>
   <dns>mysql:host=localhost;dbname=YOURDBNAME</dns>
</config>

 */
// change this path to suit your location
$path = '/Users/isrd1/Dropbox/web/test/JSProjects/jsObjectTeaching/YUI/yuiapp/sjs-stepbystep/server';
set_include_path(get_include_path() . PATH_SEPARATOR . $path);

define('CONFIGLOCATION', "$path/config/config.xml.php");
// turn on all possible errors
error_reporting(-1);
// display errors, should be value of 0, in a production system of course
ini_set("display_errors", 1);
date_default_timezone_set('Europe/London');
// set the absolute path to the server directory
?>
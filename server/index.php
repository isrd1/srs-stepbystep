<?php
ini_set('session.save_path', '/tmp');

define('DEBUG', false);

require_once 'resources/setEnv.php';
require_once 'classes/applicationregistry.class.php';
require_once 'classes/recordSet.class.php';
require_once 'classes/R_SlimRequest.class.php';

$slimrequest = new R_SlimRequest();
$route       = $slimrequest->getRoute();
$id          = $slimrequest->params('id');

$session = Session::getInstance();

/**
 * connect to the database
 */
$db = ApplicationRegistry::DB();
/**
 * whatever is returned it'll be json, so set the header to the correct type
 */
header("Content-Type: application/json");

switch ($route) {
    /**
     * show all the students for a given coursecode, returning the information as JSON
     */
    case 'listcourseStudents':
        $id                = $db->quote($id);
        $sqlCourseStudents = "SELECT studentid, forename, surname, stage, email
                              FROM srs_student
                              WHERE coursecode=$id
                              ORDER BY surname, forename";
        $rs                = new JSONRecordSet();
        $retval            = $rs->getRecordSet($sqlCourseStudents);
        echo $retval;
        break;
    /**
     * lists courses for the department for 3H, computing
     */
    case 'listCourses':
        $sqlCourses = "SELECT coursecode, coursetitle, department
                       FROM srs_course c
                       INNER JOIN srs_dept d
                       ON c.deptcode=d.deptcode
                       WHERE c.deptcode=:dcode
                       ORDER BY coursetitle";
        $rs         = new JSONRecordSet();
        $retval     = $rs->getRecordSet($sqlCourses, 'ResultSet', array(':dcode' => '3H'));
        echo $retval;
        break;
    default:
        echo '{"status":{"text":"default"}}';
        break;
}


function Logger($type, $data = null) {
    if (defined('DEBUG') && (DEBUG == true)) {
        $output = "$type: \n";
        if (!empty($data)) {
            foreach ($data as $key => $value) {
                $output .= "$key = $value\n";
            }
        }
        ROBlog($output);
    }
}

function ROBlog($txt) {
    $myFile = "./logs/log.txt";
    $fh = fopen($myFile, 'a+b') or die("can't open file");
    fwrite($fh, $txt . "\n");
    fclose($fh);

}

?>
<?php 
    require("MySQLi.php");
    header('Content-Type: application/json; charset=utf-8'); 
    $con = openConnection();
    
    $sql = $_REQUEST["sql"];

    $rs = eseguiQuery($con, $sql);
    $json = json_encode($rs);
    http_response_code(200); //200 --> andato tutto bene
    echo($json);

    $con->close();
?>
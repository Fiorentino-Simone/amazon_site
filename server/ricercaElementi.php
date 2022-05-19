<?php 
    require("MySQLi.php");
    header('Content-Type: application/json; charset=utf-8'); 
    $con = openConnection();
    
    $val = $_REQUEST["val"];
    $table = $_REQUEST["table"];

    $sql = "SELECT * FROM $table WHERE `Descrizione Prodotto` LIKE '%$val%'";

    $rs = eseguiQuery($con, $sql);
    $json = json_encode($rs);
    http_response_code(200); //200 --> andato tutto bene
    echo($json);

    $con->close();
?>
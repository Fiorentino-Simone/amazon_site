<?php 
    require("MySQLi.php");
    header('Content-Type: application/json; charset=utf-8'); 
    $con = openConnection();
    
    $idProdotto = $_REQUEST["idProdotto"];
    $categoria = $_REQUEST["categoria"];

    $sql = "SELECT * FROM $categoria WHERE IDProdotto=$idProdotto";
    $rs = eseguiQuery($con, $sql);
    $json = json_encode($rs);
    http_response_code(200); //200 --> andato tutto bene
    echo($json);

    $con->close();
?>
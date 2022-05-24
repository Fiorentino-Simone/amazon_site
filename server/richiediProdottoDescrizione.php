<?php 
    require("MySQLi.php");
    header('Content-Type: application/json; charset=utf-8'); 
    $con = openConnection();
    
    $id = $_REQUEST["idProdottos"];
    $table = $_REQUEST["tabelle"];

    $sql = "SELECT `Descrizione Prodotto` FROM $table WHERE IdProdotto=$id";

    $rs = eseguiQuery($con, $sql);
    $json = json_encode($rs);
    http_response_code(200); //200 --> andato tutto bene
    echo($json);

    $con->close();
?>
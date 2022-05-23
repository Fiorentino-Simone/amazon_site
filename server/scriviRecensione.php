<?php 
    require("MySQLi.php");
    header('Content-Type: application/json; charset=utf-8'); 


    $tabella = $_REQUEST["tabella"];
    $idProduct = $_REQUEST["idProduct"];
    $nomeUser = $_REQUEST['nomeUser'];
    $descrizioneUser = $_REQUEST['descrizioneUser'];
    $stelle = $_REQUEST["stelle"];

    $con = openConnection();

    $sql = "INSERT INTO recensioni (TabellaProdotto, IdProdotto, Stelle, Descrizione, NomeUser) VALUES ('$tabella', $idProduct, $stelle, '$descrizioneUser', '$nomeUser')";
    
    if(eseguiQuery($con, $sql)){
        http_response_code(200);
        echo('{"ris" : "ok"}'); //gli passiamo un json già serializzato in stringa (al client)
    }
    else{
        http_response_code(500);
        echo("Errore nell'inserimento del record"); //nel caso di errore la fail fa un alert e non parsifica 
    }
    $con -> close();
    
?>
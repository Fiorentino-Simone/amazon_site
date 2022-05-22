<?php
    require("mySQLi.php");
    header('Content-Type: application/json; charset=utf-8'); 

    $connection = openConnection();

    $id = $_REQUEST["id"];

    $sql = "UPDATE acquisti SET Restituito=1 WHERE IdTransazione=$id";
    //se voglio scrivere una stringa da una variabile ho bisogno degli apici

    if(eseguiQuery($connection, $sql)){
        //true se è riuscito a cancellare
        http_response_code(200);
        echo('{"ris" : "ok"}'); //gli passiamo un json già serializzato in stringa (al client)
    }
    else{
        //false se non è riuscito a cancellare
        http_response_code(500);
        echo("Errore nella modifica del record"); //nel caso di errore la fail fa un alert e non parsifica 
    }
    $connection -> close();
?>
<?php 
    require("MySQLi.php");
    header('Content-Type: application/json; charset=utf-8'); 
    $email = $_REQUEST['email'];

    $con = openConnection();

    //il controllo del WHERE è caseUnsensitive quindi non posso controllare la password
    $sql = "SELECT * FROM utenti WHERE utenti.Email LIKE '%$email%'";
    $rs = eseguiQuery($con, $sql);

    if(count($rs)==0){
        //true se è riuscito a cancellare
        http_response_code(200);
        echo('{"ris" : "ok"}'); //gli passiamo un json già serializzato in stringa (al client)
    }
    else{
        //false se non è riuscito a cancellare
        http_response_code(500);
        echo("Errore email già presente nel DB"); //nel caso di errore la fail fa un alert e non parsifica 
    }
    
?>
<?php 
    require("MySQLi.php");
    header('Content-Type: application/json; charset=utf-8'); 


    $nominativo = $_REQUEST["nominativo"];
    $telefono = $_REQUEST["telefono"];
    $email = $_REQUEST['email'];
    $pwd = $_REQUEST['pwd'];
    $indirizzo = $_REQUEST["indirizzo"];

    $con = openConnection();

    $pwd = md5($pwd);

    $sql = "INSERT INTO utenti (Nominativo, Telefono, Email, Password, Indirizzo) VALUES ('$nominativo','$telefono', '$email', '$pwd', '$indirizzo')";
    
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
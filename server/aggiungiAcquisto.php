<?php 
    require("MySQLi.php");
    header('Content-Type: application/json; charset=utf-8'); 
    /*$_POST ? '' : $_POST = json_decode(trim(file_get_contents('php://input')), true);
    var_dump($_POST);*/


    $prodotti = $_REQUEST["prodotti"];
    $id = $_REQUEST["idUser"];
    $descrizione = json_encode($_REQUEST["descrizione"]);
    $prezzo = $_REQUEST['prezzo'];
    $indirizzo = $_REQUEST["indirizzo"];

    $con = openConnection();

    $sql = "INSERT INTO acquisti (IdUtente, QuantitàProdotti, Descrizione, PrezzoTotale, Indirizzo_Spedizione) VALUES ($id, $prodotti, '$descrizione', $prezzo, '$indirizzo')";
    
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
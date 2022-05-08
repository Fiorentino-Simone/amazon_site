<?php
    //inseriamo una libreria SQL

    /*COSTANTI PER ACCEDERE AL DB*/
    define("DBHOST", "localhost");  //costante su dove è localizzato il database
    define("DBUSER", "root");  //costante per gli utenti: root --> è quello amministratore
    define("DBPASS", "");  //costante per la pass dell'utente del DB
    define("DBNAME", "amazon_site");  //costante nome del database

    function openConnection(){
        //funzione che apre la connessione al DB
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        try {
            $connection = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME); //vuole 4 define il costruttore di mysqli 
            $connection -> set_charset("utf8"); //impostiamo il charset 
            return $connection;    
        } catch (Exception $ex) {
            http_response_code(503); //Numero 503: errore di connessione al DB
            die("<b>Errore di connessione al DB: </b>" . $ex->getMessage());
        }
    }

    function eseguiQuery($connection, $sql){
        try {
            $rs = $connection -> query($sql);
            if(is_bool($rs)){
                $data = $rs; //nel caso sia bool allora è una insert quindi non serve andare a fare la conversione
            }
            else{
                $data = $rs -> fetch_all(MYSQLI_ASSOC); //nel caso fosse una select bisogna andare a restituirlo in un vettore 
            }
            return $data;
        } catch (Exception $ex) {
            $connection -> close();
            http_response_code(500); //errore generico in questo caso errore nella query
            die("<b>Errore esecuzione query: </b>" . $ex -> getMessage());
        }
    }
?>
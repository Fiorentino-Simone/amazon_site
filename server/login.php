<?php 
    require("MySQLi.php");
    header('Content-Type: application/json; charset=utf-8'); 
    $email = $_REQUEST['email'];
    $pwd = $_REQUEST['pwd'];

    $con = openConnection();

    //il controllo del WHERE è caseUnsensitive quindi non posso controllare la password
    $sql = "SELECT * FROM utenti WHERE utenti.Email = '$email'";
    $rs = eseguiQuery($con, $sql);

    if(count($rs)==0){
        $con->close();
        http_response_code(401);
        die("Email non valido");
    }
    else{
        // il controllo fatto da codice è case sensitive
        if(md5($pwd) == $rs[0]['Password']){

            $json = json_encode($rs);
            http_response_code(200); //200 --> andato tutto bene
            echo($json);
        
            $con->close();
        }
        else{
            $con->close();
            http_response_code(401);
            die("password non valido");
        }
        
    }
    
?>
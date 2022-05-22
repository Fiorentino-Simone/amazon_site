"use strict";

$(document).ready(function(){
	$("#btnLogin").on("click", function(){
        let email = $('#floatingInput').val();
        let pwd = $('#floatingPassword').val();
        if(email != "" && pwd != ""){
            let param ={
                email, pwd
            }
            let request = inviaRichiesta("GET", "server/login.php", param);
            request.fail(errore);
            request.done(function(dati){
                window.open("index.html?idUtente="+dati[0].Id,"_self");
            })
        }
        else
            alert("Compilare i campi");
    })
});
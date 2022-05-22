"use strict";

$(document).ready(function(){
	$("#btnRegistrati").on("click", function(){
        let nominativo = $('#Nominativo').val();
        let telefono = $('#Telefono').val();
        let email = $('#Email').val();
        let pwd = $('#Password').val();
        let indirizzo = $('#Indirizzo').val();
        if(
            nominativo != "" && 
            telefono != "" &&
            email != "" &&
            pwd != "" &&
            indirizzo != ""){
            let request = inviaRichiesta("GET", "server/controlloEmail.php", {email});
            request.fail(errore);
            request.done(function(ris){
                if(ris.ris == "ok"){
                    //utente nuovo allora si aggiunge al DB
                    let insertUser = inviaRichiesta("GET", "server/aggiungiUser.php", {
                        nominativo, telefono, email, pwd, indirizzo
                    });
                    insertUser.fail(errore);
                    insertUser.done(function(ris){
                        if(ris.ris == "ok"){
                            let requestUser = inviaRichiesta("GET","server/richiediUtenteEmail.php",{email});
                            requestUser.fail(errore);
                            requestUser.done(function(dati){
                                window.open("index.html?idUtente="+dati[0].Id,"_self");
                            });
                        }
                    });
                }
            })
        }
        else
            alert("Compilare i campi");
    })
});
"use strict";

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

$(document).ready(function(){
    let buttons = `.buttonHeader, 
    .buttonAccedi, 
    .buttonOrdini,
    .buttonCarrello,
    .buttonAll,
    .buttonBestSeller div,
    .buttonAmazonBasic div,
    .buttonClienti div,
    .buttonOfferte div,
    .buttonNovita div,
    .buttonPrime div,
    .buttonMusic div,
    .buttonModa div,
    .buttonLibri div,
    .buttonVideogiochi div,
    .buttonElettronica div,
    .buttonCucina div`;

    $(".buttonAccedi").prop("href","login.html");

    $(buttons).on("mouseenter",function(){
        $(this).css("border","1px solid white");
        if($(this).hasClass("libri")) $(this).css("left","510%");
    });

    $(buttons).on("mouseleave",function(){
        $(this).css("border","");
        if($(this).hasClass("libri")) $(this).css("left","");
    });

    $("#dropdownMenuButton1").on("click",
    function(){
        $(this).show();
    });

    let items = $(".categorie .dropdown-item");
    let itemSelected;
    let userActive = false;
    let idUser;

    items.on("click",function(){
        itemSelected = $(this).text();
        console.log(itemSelected);
        if(itemSelected == "Alimentazione e cura della casa") itemSelected = "alimentari";
        if(itemSelected == "Auto e Moto - Parti e Accessori") itemSelected = "auto";
        if(itemSelected == "Cancelleria e prodotti per ufficio") itemSelected = "cancelleria";
        if(itemSelected == "Casa e cucina") itemSelected = "casa";
        if(itemSelected == "CD e vinili") itemSelected = "CD";
        if(itemSelected == "Dispositivi Amazon") itemSelected = "dispositiviAmazon";
        if(itemSelected == "Fai da te") itemSelected = "faiDaTe";
        if(itemSelected == "Film e TV") itemSelected = "film";
        if(itemSelected == "Giardino e giardinaggio") itemSelected = "giardinaggio";
        if(itemSelected == "Giochi e giocattoli") itemSelected = "giochi";
        if(itemSelected == "Grandi elettrodomestici") itemSelected = "grandiElettrodomestici";


        let options =  "?cat="+itemSelected;
        if(window.location.search.includes("idUtente") || userActive) {
            if(window.location.search.includes("idUtente")) {
                let idUtente = window.location.search;
                idUtente = idUtente.substring(idUtente.indexOf("idUtente") + 9,idUtente.length);
                options += "&idUtente="+idUtente;
            }
            else if(userActive) options += "&idUtente="+idUser;
        }
        window.open("visualizzazione.html" + options, "_self");
    });

    
    if(window.location.search.includes("idUtente")){
        let idUtente = window.location.search;
        idUtente = idUtente.substring(idUtente.indexOf("idUtente") + 9, idUtente.length);
        console.log("ID UTENTE: ",idUtente);

        if(window.localStorage.getItem('user' + idUtente) == null){
            let request = inviaRichiesta("GET","server/richiediUtente.php",{idUtente});
            request.fail(errore);
            request.done(function(dati){
                let datiQuery = dati[0];
                console.log(datiQuery);
                //salvare l'utente nel session storage 
                window.localStorage.setItem('user' + idUtente, JSON.stringify(datiQuery));
                let nome = datiQuery.Nominativo.substring(0,datiQuery.Nominativo.indexOf(" "));
                $(".utente").html("Ciao, " + nome);
                $(".indirizzo").html(datiQuery.Indirizzo).css("margin-left","5px");;
                userActive = true;
            })  
        }
    }

    let keysLocalStorage = Object.keys(localStorage);
    let userKeys = [];
    for (let i = 0; i < keysLocalStorage.length; i++) {
        if(keysLocalStorage[i].includes("user")) userKeys.push(keysLocalStorage[i]);
    }
    if(userKeys.length != 0){
        let user = userKeys[0];
        let values = JSON.parse(window.localStorage.getItem(user));
        let nome = values.Nominativo.substring(0,values.Nominativo.indexOf(" "));
        $(".utente").html("Ciao, " + nome);
        $(".indirizzo").html(values.Indirizzo).css("margin-left","5px");
        userActive = true;
        idUser = values.Id;
        console.log(idUser);
    }

    $(".buttonAccedi").eq(0).on("click",function(){
        if(userActive || window.location.search.includes("idUtente")){
            $(this).prop({
                "data-toggle": "modal",
                "data-target": "#ListeLogout"
            })
            $("#ListeLogout").modal("show");
        }
        else window.open("login.html","_self");
    });

    $("#btnLogout").on("click",function(){
        window.localStorage.removeItem("user"+idUser);
        window.location.reload();
    })
    
});
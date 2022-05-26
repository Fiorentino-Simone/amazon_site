"use strict";

let tables = ["abbigliamento","alimentari","auto","bellezza","cancelleria","casa","cd","dispositiviamazon","elettronica","faidate","film","giardinaggio","giochi","gioielli","grandielettrodomestici","handmade","illuminazione","usato","libri"]


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
        idUser = idUtente.substring(idUtente.indexOf("idUtente") + 9, idUtente.length);
        console.log("ID UTENTE: ",idUser);

        if(window.localStorage.getItem('user' + idUser) == null){
            let request = inviaRichiesta("GET","server/richiediUtente.php",{idUser});
            request.fail(errore);
            request.done(function(dati){
                let datiQuery = dati[0];
                console.log(datiQuery);
                //salvare l'utente nel session storage 
                window.localStorage.setItem('user' + idUser, JSON.stringify(datiQuery));
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
        if(keysLocalStorage[i].includes("user") && !keysLocalStorage[i].includes("carrello")) userKeys.push(keysLocalStorage[i]);
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

    $("#searchInput").on("click",function(){
        let val = $("#inputSearch").val();
        if(val.length >= 4){
            let descrizioni = {};
            let indici = {};
            let i = 0;
            for (let table of tables) {
                let request = inviaRichiesta("GET","server/ricercaTotaleElementi.php",{table});
                request.fail(errore);
                request.done(function(data){
                    let vect1 = [];
                    let vect2 = [];
                    for(let item of data){
                        vect1.push(item["Descrizione Prodotto"]);
                        vect2.push(item["idProdotto"]);
                    } 
                    descrizioni[table] = vect1;
                    indici[table] = vect2;
                    if(i==tables.length-1) {
                        ricerca(descrizioni, indici);
                    }
                    i++;
                });
            }
        }

        function ricerca(descrizioni, indici){
            console.log(val);
            let corrispondenze = {};
            for (let tabella of tables) {
                let vect = [];
                for (let i = 0; i < descrizioni[tabella].length; i++) {
                    if((descrizioni[tabella][i].toUpperCase()).includes(val.toUpperCase())){
                        let element = parseInt(indici[tabella][i]);
                        vect.push(element);
                    }
                }
                if(vect.length != 0) corrispondenze[tabella] = vect;
            }
            if(Object.keys(corrispondenze).length == 0){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Nessun elemento trovato',
                    footer: '<a>Se hai dei dubbi contattami</a>'
                })
            }
            else {
                window.sessionStorage.setItem(val, JSON.stringify(corrispondenze));
                if(userActive || window.location.search.includes("idUtente")){
                    window.open("ricercaTotale.html?key="+val+"&idUtente="+idUser,"_self");
                }
                else window.open("ricercaTotale.html?key="+val,"_self");
            }
        }
    })

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
        window.open("index.html","_self");
    })

    let carrelloUser = JSON.parse(window.localStorage.getItem("carrello_user" + idUser));
    if(carrelloUser != null){
        $(".numeroProdotti").eq(0).text(carrelloUser.length);
    }

    $(".buttonCarrello").eq(0).on("click",function(){
        if(userActive || window.location.search.includes("idUtente")){
            window.open("carrello.html?idUtente="+idUser,"_self");
        }
        else window.open("login.html","_self");
    })    


    $(".btnOrdini").on("click",function(){
        if(userActive || window.location.search.includes("idUtente")){
            window.open("ordini.html?idUtente="+idUser,"_self");
        }
        else window.open("login.html","_self");
    }) 

    $(".card-link").on("click",function(){
        let itemSelected = $(this).prop("id");
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
    })
});
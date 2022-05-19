"use strict";

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


        window.open("visualizzazione.html?cat="+itemSelected,"_self");
    });

    //#region FUNZIONAMENTO DELLA SEARCH QUOTE
    /*let name=[];
    for (let nomeAzienda of json) {
        name.push(nomeAzienda.name);
    }
    let richiesta = false;
    $('#searchInput').autocomplete({ //funzione autocomplete della texbox ui jquery
        source: function(request, response) {
            let results = $.ui.autocomplete.filter(name, request.term);
            if(results.length != 0){
                response(results.slice(0, 6)); //massimo 6 items
            }
            else if(richiesta == false && results.length == 0){
                let promise = inviaChiamataRicerca(request.term);
                promise.catch(function(err){creazioneSweetAlert("Errore nella promise")});
                promise.then(function(data){
                    richiesta = true;
                    results = data;
                    if(results.length == 0){
                        creazioneSweetAlert("Codice inserito non trovato nel Database");
                    }
                    else{
                        response(results.slice(0, 4));
                    }
                }); 
            }
            else if(richiesta){
                let result = $.ui.autocomplete.filter(resultsName, request.term);
                if(result.length == 0) richiesta = false;
                else{
                    results = result;
                    response(results.slice(0, 4));
                }
            } 
        },
        minLength : 2, //ricerca dopo 2 lettere
        select : function(event, ui){ //funzione effettiva di ricerca
            let simbolo = searchSymbol(ui.item.label);

            if(aziende[simbolo]!=null){
                insertNewSymbol();
                creaTabella(aziende[simbolo]); //vado a caricarlo dal vettore senza fare ulteriori chiamate
            }
            else{
                //senno devo andare a fare la search quote
                console.info("CHIAMATA EFFETTUATA: ", keys[index]); 
                let request = getsAlphaData("GLOBAL_QUOTE", simbolo, keys[index]);
                request.fail(errore);
                request.done(function(data){
                    if(!(data["Global Quote"])){
                        creazioneSweetAlert("Errore nella richiesta dei dati, aspettare un minuto e poi ricaricare");
                    }
                    else{
                        // --> se funziona la chiave allora bisogna andare a costruire la tabella nuova
                        insertNewSymbol();
                        aziende[simbolo] = data["Global Quote"]; //inseriamo una nuova chiave con i dati del nuovo simbolo
                        console.log("AZIENDE: ",aziende);
                        creaTabella(aziende[simbolo]);
                    }
                })
            }
        }
    });

    function searchSymbol(nome){
        let symbolTrovato = "";
        let symbolBool = false;
        for (let simbolo of json) {
            if(simbolo.name == nome){
                symbolBool=true;
                symbolTrovato=simbolo.symbol;
            } 
        }
        if(symbolBool == false){
            //vuol dire che la ricerca è da fare non nel json ma nel mio vettore
            for (let item of resultsSearch) {
                if(item["NAME"] == nome) symbolTrovato=item["SYMBOL"];
            }
        }
        return symbolTrovato;
    }
    //#endregion*/

});
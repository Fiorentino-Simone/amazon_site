"use strict";

const ITEMS = 5;

$(document).ready(function(){
    let options = window.location.search;
    let valueItemSelected;
    let idUser; //idUser
    if(window.location.search.includes("&")){
        valueItemSelected = options.substring(5, options.indexOf("&"));
        idUser = options.substring(options.indexOf("&")+10,options.length);
        let values = JSON.parse(window.localStorage.getItem('user' + idUser));
        let nomeUtente = values.Nominativo.substring(0,values.Nominativo.indexOf(" "));
        $(".utente").html("Ciao, " + nomeUtente);
        $(".indirizzo").html(values.Indirizzo);
    }
    else valueItemSelected = options.substring(5, options.length);
    console.log(valueItemSelected);

    visualizzaProdotti(valueItemSelected);


    $(".buttonAccedi").eq(0).on("click",function(){
        if(window.location.search.includes("idUtente")){
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
        if(window.location.search.includes("idUtente")){                
            window.open("carrello.html?idUtente="+idUser,"_self");
        }
        else window.open("login.html","_self");
    })  

    $(".btnOrdini").on("click",function(){
        if(window.location.search.includes("idUtente")){
            window.open("ordini.html?idUtente="+idUser,"_self");
        }
        else window.open("login.html","_self");
    }) 
    


    $("#inputSearch").on("keyup", function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $("#searchInput").trigger("click");
        }
    });

    $("#searchInput").on("click",function(){
        window.open("index.html","_self");
    })

    /*************************************FUNCTIONS *********************************/
    let tabella = [];
    let categoriePrincipali = [];
    let marche = [];
    let prezzi = []; //per la ricerca del prezzo massimo
    

    function visualizzaProdotti(valoreSession){
        let json = JSON.parse(window.sessionStorage.getItem(valoreSession));
        let prodotti = [];

        let lengthTotale = 0;
        for (const key in json) {
            lengthTotale += json[key].length;
        }
        console.log(lengthTotale);
        console.log(json);
        let index2 = 0;
        let vect=[];
        for (let key in json) {
            console.log(key);
            for(let idProdotto of json[key]){
                console.log(json[key]);
                let request = inviaRichiesta("GET","server/prodottiConRicercaTotale.php",{key, idProdotto});
                request.fail(errore);
                request.done(function(data){
                    let prod = data[0];
                    vect.push(prod);
                    if(index2 == lengthTotale-1){
                        prodotti = vect;
                        creaProdotti();
                    }
                    index2++; 
                });
            }
        }


        function creaProdotti(){
            console.log(prodotti);
            for (let key in json) {
                tabella.push(key);
            }
            console.log(tabella);
            for (let i = 0; i < prodotti.length; i++) {
                if (!(categoriePrincipali.includes(prodotti[i].CategoriaPrincipale.toUpperCase().trim())))
                    categoriePrincipali.push(prodotti[i].CategoriaPrincipale.toUpperCase().trim());
                if (!(marche.includes(prodotti[i].marca.toUpperCase().trim())))
                    marche.push(prodotti[i].marca.toUpperCase().trim());
                if (!(prezzi.includes(prodotti[i].Prezzo)))
                    prezzi.push(prodotti[i].Prezzo);
            }
            console.log(marche, prezzi, tabella);

            creaCards(prodotti);  
            
            
             //caricamento filtri 
             let filterWrapper = $("#Filter");
             ////////MARCHE:
             $("<h4>").text("Filtra la ricerca: ").appendTo(filterWrapper);
             $("<h7>").text("Marche selezionabili: ").appendTo(filterWrapper);
             let j=0;
             for (let marca of marche) {
                 $(filterWrapper).append(
                     $("<div>")
                     .addClass("form-check")
                     .append($("<input>")
                         .addClass("form-check-input")
                         .prop({
                             "type": "checkbox",
                             "value" : marca.toLowerCase().trim(),
                             "name" : "marche",
                             "id" : "Check"+ marca.toLowerCase().trim()
                         })
                     )
                     .append($("<label>")
                     .addClass("form-check-label")
                     .prop("for","Check"+marca.toLowerCase().trim())
                     .text(marca.toLowerCase().trim())));
                 if(marche.length-1 == j && j>=5){
                     $(filterWrapper).append(
                         $("<i>").addClass("fa-solid fa-caret-down"))
                         .append($("<a>").text(" Vedi altri")
                         .on("click",function(){
                             if($(this).text() == " Vedi altri"){
                                 for(let i=0; i<marche.length; i++){
                                     $(".form-check").eq(i).show();
                                 }
                                 $(this).text(" Mostra meno");
                                 $(this).prevAll("i").removeClass("fa-solid fa-caret-down").addClass("fa-solid fa-caret-up");
                             }
                             else{
                                 for(let i=5; i<marche.length; i++){
                                     $(".form-check").eq(i).hide();
                                 }
                                 $(this).text(" Vedi altri");
                                 $(this).prevAll("i").removeClass("fa-solid fa-caret-up").addClass("fa-solid fa-caret-down");
                             }
                         }));
                 }
                 j++;            
             }
             for(let i=5; i<marche.length; i++){
                 $(".form-check").eq(i).hide();
             }
             $("<hr>").appendTo(filterWrapper);
 
             ////////SOTTOCATEGORIE:
             $("<h7>").text("Categorie: ").appendTo(filterWrapper);
             $("<br>").appendTo(filterWrapper);
             j=0;
             for (let sottocategoria of categoriePrincipali) {
                 $(filterWrapper).append(
                     $("<div>")
                     .addClass("form-check sottocategorieCheck")
                     .append($("<input>")
                         .addClass("form-check-input")
                         .prop({
                             "type": "checkbox",
                             "value" : sottocategoria.toLowerCase().trim(),
                             "name" : "sottocategorie",
                             "id" : "Check"+ sottocategoria.toLowerCase().trim()
                         })
                     )
                     .append($("<label>")
                     .addClass("form-check-label")
                     .prop("for","Check"+sottocategoria.toLowerCase().trim())
                     .text(sottocategoria.toLowerCase().trim())));
                 if(categoriePrincipali.length-1 == j && j>=5){
                     $(filterWrapper).append(
                         $("<i>").addClass("fa-solid fa-caret-down"))
                         .append($("<a>").text(" Vedi altri")
                         .on("click",function(){
                             if($(this).text() == " Vedi altri"){
                                 for(let i=0; i<categoriePrincipali.length; i++){
                                     $(".sottocategorieCheck").eq(i).show();
                                 }
                                 $(this).text(" Mostra meno");
                                 $(this).prevAll("i").removeClass("fa-solid fa-caret-down").addClass("fa-solid fa-caret-up");
                             }
                             else{
                                 for(let i=5; i<categoriePrincipali.length; i++){
                                     $(".sottocategorieCheck").eq(i).hide();
                                 }
                                 $(this).text(" Vedi altri");
                                 $(this).prevAll("i").removeClass("fa-solid fa-caret-up").addClass("fa-solid fa-caret-down");
                             }
                         }));
                 }
                 j++;            
             }
             for(let i=5; i< categoriePrincipali.length; i++){
                 $(".sottocategorieCheck").eq(i).hide();
             }
             $("<hr>").appendTo(filterWrapper);
 
             ////////PRIME:
             $("<h7>").text("Amazon prime: ").appendTo(filterWrapper);
             $("<div>").appendTo(filterWrapper)
             .addClass("form-check")
             .append($("<input>")
                 .addClass("form-check-input")
                 .prop({
                     "type": "radio",
                     "name" : "isPrime",
                     "id" : "Prime",
                     "checked" : "true"
                 })
             )
             .append($("<label>")
             .addClass("form-check-label")
             .prop("for","Prime")
             .text("Spedizione con Prime"));
             $("<div>").appendTo(filterWrapper)
             .addClass("form-check")
             .append($("<input>")
                 .addClass("form-check-input")
                 .prop({
                     "type": "radio",
                     "name" : "isPrime",
                     "id" : "NoPrime"
                 })
             )
             .append($("<label>")
             .addClass("form-check-label")
             .prop("for","NoPrime")
             .text("Spedizione senza Prime"));
             $("<hr>").appendTo(filterWrapper);
 
             ////////RANGE PREZZO:
             $("<h7>").text("Range prezzo: ").appendTo(filterWrapper);
             $("<div>").appendTo(filterWrapper)
             .addClass("value").text("Costo max: ");
             $("<input>").appendTo(filterWrapper)
             .prop({
                 "type": "range",
                 "id" : "range",
                 "min" : minPrice(),
                 "max" : maxPrice(),
                 "value" : minPrice(),
                 "step" : "1"
             })
             .on("input",function(){
                 let value = $("#range").val();
                 let target = $('.value');
                 target.html("Costo max: "+value+ " euro");
             })
             $("<hr>").appendTo(filterWrapper);
 
             ////////OFFERTE:
             $("<h7>").text("Offerte: ").appendTo(filterWrapper);
             $("<div>").appendTo(filterWrapper)
             .addClass("form-check")
             .append($("<input>")
                 .addClass("form-check-input")
                 .attr({
                     "type": "radio",
                     "name" : "onlyDeals",
                     "id" : "VisualizzaOfferte",
                     "checked" : "true"
                 })
             )
             .append($("<label>")
             .addClass("form-check-label")
             .prop("for","VisualizzaOfferte")
             .text("Visualizza solo le offerte"));
 
             $("<hr>").appendTo(filterWrapper);
             //BUTTON INVIA RICERCA
             $("<button>").addClass("btn").appendTo(filterWrapper).text("INVIA RICERCA").on("click",function(){
                 filtraElementi(prodotti);
             });
        }
    }

    /******************FUNCTIONS *********/
    function maxPrice(){
        let vect = prezzi.map(parseFloat);
        for(let i=0; i< vect.length; i++) vect[i] = parseInt(vect[i]);
        let max = vect[0];
        for(let i=0; i<vect.length; i++){
            if(max < vect[i]) max = vect[i];
        }
        return max;
    }

    function minPrice(){
        let vect = prezzi.map(parseFloat);
        for(let i=0; i< vect.length; i++) vect[i] = parseInt(vect[i]);
        let min = vect[0];
        for(let i=0; i< vect.length; i++){
            if(min > vect[i]) min = vect[i];
        }
        return min;
    }

    function filtraElementi(prodotti){
        //filtra MARCHE
        let marcheRicerca = [];
        $("input:checkbox[name=marche]:checked").each(function(){
            marcheRicerca.push($(this).val());
        });
        console.log(marcheRicerca);

        //filtra SOTTOCATEGORIE
        let sottocategorieRicerca = [];
        $("input:checkbox[name=sottocategorie]:checked").each(function(){
            sottocategorieRicerca.push($(this).val());
        });
        
        //Filtra su PRIME
        let hasPrime;
        if($('input[name="isPrime"]:checked').prop("id") == "Prime") hasPrime = "1"
        else hasPrime="0"; 

        let maxPrezzo = $("#range").val();

        let onlyDeals; 
        if($('input[name="onlyDeals"]:checked').prop("id") == "VisualizzaOfferte") onlyDeals = true;
        else onlyDeals=false; 

        let prodottiFiltrati = [];
        let prodottiFiltrati1 = [];
        let prodottiFiltrati2 = [];
        let prodottiFiltrati3 = [];
        
        if(marcheRicerca.length != 0){
            for (let products of prodotti) {
                if(marcheRicerca.includes(products["marca"].toLowerCase().trim())) prodottiFiltrati.push(products);
            }
        }
        else prodottiFiltrati = prodotti;
        if(sottocategorieRicerca.length != 0){
            for (let products of prodottiFiltrati) {
                if((sottocategorieRicerca.includes(products["CategoriaPrincipale"].toLowerCase().trim()))){
                    prodottiFiltrati1.push(products);
                } 
            }
        }
        else prodottiFiltrati1 = prodottiFiltrati;
        for (let products of prodottiFiltrati1) {
            if(products["Prime"] == hasPrime){
                prodottiFiltrati2.push(products);
            } 
        }
        for (let products of prodottiFiltrati2) {
            if(parseInt(products["Prezzo"]) <= parseInt(maxPrezzo)){
                prodottiFiltrati3.push(products);
            } 
        }
        console.log(prodottiFiltrati3);
        if(prodottiFiltrati3.length == 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Nessun risultato presente, prova a cambiare i filtri",
                footer: '<a href="#">Se riscontri problematiche, contattami !</a>'
            })
        }
        else creaCards(prodottiFiltrati3, true);
    }


    let wrapCard = $("#cardsCategorie");


    function creaCards(product, filter = false){
        if(filter){
            $("#cardsCategorie").children().remove();
        } 
        let i = 0;
        for (let prodotto of product) {
            console.log(product);
            let divSezione = $("<div>").appendTo(wrapCard);
            $("<div>").appendTo(divSezione).addClass("col-lg-4")
            .append($("<div>").addClass("card").append($("<div>")
            .css({
                "height" : "200px",
                "text-align" : "center"
            }).append($("<img>").addClass("card-img-top immagine").prop("src",prodotto["Immagine"])))
            .append($("<div>").addClass("card-body")
            .append($("<h7>").addClass("card-title marca bold").text(prodotto.marca))));
            let divCard = $(".card-body").eq(i);
            $("<br>").appendTo(divCard);
            let divDescrizione = $("<div>").addClass("card-text").append($("<span>").addClass("descrizione")).appendTo(divCard);
            if(parseInt(prodotto["Descrizione Prodotto"].length) >= 50){
                let newText = prodotto["Descrizione Prodotto"].substring(0,50);
                newText += "..."
                divDescrizione.text(newText).prop("id",prodotto.IDProdotto);
            }
            else divDescrizione.text(prodotto["Descrizione Prodotto"]).prop("id",prodotto.IDProdotto);
            $("<div>").css({
                "width" : "100%",
                "text-align" : "center"
            }).append($("<img>").addClass("img-fluid stelle").prop({
                "width" : "90",
                "height" : "90",
                "src" : function(){
                    if(parseInt(prodotto["Stelle Recensioni"]) <= 1) return "img/1_stella.png"
                    else return "img/"+parseInt(prodotto["Stelle Recensioni"])+"_stella.png"
                }
            })).appendTo(divCard);
            let price = parseFloat(prodotto["Prezzo"]).toFixed(2);
            price = price.toString().replace(".",",");
            $("<div>").addClass("card-text prezzo").text(price+"€").appendTo(divCard);
            $("<div>").css({
                "width" : "100%",
                "text-align" : "center",
            }).append($("<img>").addClass("img-fluid prime").prop("src",function(){
                if(parseInt(prodotto["Prime"]) == 1) return "img/prime.png"
                else return ""
            })).appendTo(divCard);
            i++;
        }
    }
});
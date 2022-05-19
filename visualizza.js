"use strict";

const ITEMS = 5;

$(document).ready(function(){
    let valueItemSelected = window.location.search;
    valueItemSelected = valueItemSelected.substring(5,valueItemSelected.length);
    visualizzaProdotti(valueItemSelected);
    let table = valueItemSelected;
    let itemCorrente = valueItemSelected;


    $("#inputSearch").on("keyup", function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $("#searchInput").trigger("click");
        }
    });

    $("#searchInput").on("click",function(){
        let val = $(".form-control").eq(0).val();
        let request = inviaRichiesta("GET","server/ricercaElementi.php", {val, table});
        request.fail(errore);
        request.done(function(dati){
            console.log(dati);
            let categorie=[];
            for (let prodotto of dati) {
                if (!(categorie.includes(prodotto.CategoriaPrincipale.toUpperCase().trim())))
                    categorie.push(prodotto.CategoriaPrincipale.toUpperCase().trim());
            }
            creaCards(categorie, dati, true);
        });
    })


    if(valueItemSelected == "alimentari") valueItemSelected = "Alimentazione e cura della casa";
    if(valueItemSelected == "auto") valueItemSelected = "Auto e Moto - Parti e Accessori";
    if(valueItemSelected == "cancelleria") valueItemSelected = "Cancelleria e prodotti per ufficio";
    if(valueItemSelected == "casa") valueItemSelected = "Casa e cucina";
    if(valueItemSelected == "CD") valueItemSelected = "CD e vinili";
    if(valueItemSelected == "dispositiviAmazon") valueItemSelected = "Dispositivi Amazon";
    if(valueItemSelected == "faiDaTe") valueItemSelected = "Fai da te";
    if(valueItemSelected == "film") valueItemSelected = "Film e TV";
    if(valueItemSelected == "giardinaggio") valueItemSelected = "Giardino e giardinaggio";
    if(valueItemSelected == "giochi") valueItemSelected = "Giochi e giocattoli";
    if(valueItemSelected == "grandiElettrodomestici") valueItemSelected = "Grandi elettrodomestici";


    
    $(document).prop('title', valueItemSelected + ": AMAZON");
    $(".dropdown-toggle").html(valueItemSelected);

    /*************************************FUNCTIONS *********************************/
    let categorie=[];
    let sottocategorie = [];
    let marche = [];
    let prezzi = []; //per la ricerca del prezzo massimo
    function visualizzaProdotti(itemSelected){
        let request = inviaRichiesta("GET", "server/elencoProdotti.php", {"categoria" : itemSelected});
        request.fail(errore);
        request.done(function(prodotti){
            console.log(prodotti);
            //caricare cards
            for (let prodotto of prodotti) {
                if (!(categorie.includes(prodotto.CategoriaPrincipale.toUpperCase().trim())))
                    categorie.push(prodotto.CategoriaPrincipale.toUpperCase().trim());
                if (!(sottocategorie.includes(prodotto.SottoCategoria.toUpperCase().trim())))
                    sottocategorie.push(prodotto.SottoCategoria.toUpperCase().trim());
                if (!(marche.includes(prodotto.marca.toUpperCase().trim())))
                    marche.push(prodotto.marca.toUpperCase().trim());
                if (!(prezzi.includes(prodotto.Prezzo)))
                    prezzi.push(prodotto.Prezzo);
            }
            console.log(categorie);

            creaCards(categorie, prodotti);
           
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
            $("<h7>").text("Sottocategorie: ").appendTo(filterWrapper);
            $("<br>").appendTo(filterWrapper);
            j=0;
            for (let sottocategoria of sottocategorie) {
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
                if(sottocategorie.length-1 == j && j>=5){
                    $(filterWrapper).append(
                        $("<i>").addClass("fa-solid fa-caret-down"))
                        .append($("<a>").text(" Vedi altri")
                        .on("click",function(){
                            if($(this).text() == " Vedi altri"){
                                for(let i=0; i<sottocategorie.length; i++){
                                    $(".sottocategorieCheck").eq(i).show();
                                }
                                $(this).text(" Mostra meno");
                                $(this).prevAll("i").removeClass("fa-solid fa-caret-down").addClass("fa-solid fa-caret-up");
                            }
                            else{
                                for(let i=5; i<sottocategorie.length; i++){
                                    $(".sottocategorieCheck").eq(i).hide();
                                }
                                $(this).text(" Vedi altri");
                                $(this).prevAll("i").removeClass("fa-solid fa-caret-up").addClass("fa-solid fa-caret-down");
                            }
                        }));
                }
                j++;            
            }
            for(let i=5; i< sottocategorie.length; i++){
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
            $("<button>").addClass("btn").appendTo(filterWrapper).text("INVIA RICERCA").on("click",function(){filtraElementi(prodotti)});

        }); 
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

    function visualizzaProdotto(){
        let idProdotto = $(this).prop("id");
        window.open("prodotto.html?cat="+itemCorrente+"&id="+idProdotto,"_self");
    }

    function openScopri(table, item){
        window.open("scopri.html?table="+table+"&cat="+item,"_self");
    }

    function filtraElementi(prodotti){
        //filtra MARCHE
        let marcheRicerca = [];
        $("input:checkbox[name=marche]:checked").each(function(){
            marcheRicerca.push($(this).val());
        });

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
                if((sottocategorieRicerca.includes(products["SottoCategoria"].toLowerCase().trim()))){
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

        //nuove categorie
        let newCategorie = [];
        for (let prodotto of prodottiFiltrati3) {
            if (!(newCategorie.includes(prodotto.CategoriaPrincipale.toUpperCase().trim())))
                newCategorie.push(prodotto.CategoriaPrincipale.toUpperCase().trim());
        }
        console.log(newCategorie);
        console.log(prodottiFiltrati3);
        if(prodottiFiltrati3.length == 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Nessun risultato presente, prova a cambiare i filtri",
                footer: '<a href="#">Se riscontri problematiche, contattami !</a>'
            })
        }
        else creaCards(newCategorie,  prodottiFiltrati3, true);
    }



    function creaCards(categorie, prodotti, filter = false){
        if(filter){
            $("#cardsCategorie").remove();
            $(".titoloCategoria").remove();
        } 
        let j=0;
        let elemento = 0;
        for (let i = 0; i < categorie.length; i++) {
            if(i == 0){
                let h3 = $("<h3>").css({
                "position" : "relative",
                "z-index" : "0",
                "width" : "100%",
                "left" : "20%",
                "margin-top" : "2%",
                "margin-bottom" : "2%"
                }).addClass("firstH3 titoloCategoria");
                $(".wrapper").append(h3);
                h3.html("Sezione " + categorie[i].toLowerCase() + "  "+ "<a> Scopri di più </a>").on("click",function(){openScopri(itemCorrente, categorie[i])});
                $("<div>").appendTo(".wrapper").eq(0).addClass("row cards").prop("id","cardsCategorie");
            }
            $("<div>").appendTo("#cardsCategorie").addClass("sezione");
            if(i != 0){
                let h3 = $("<h3>").css({
                    "position" : "relative",
                    "z-index" : "0",
                    "width" : "100%",
                    "margin-top" : "2%",
                    "margin-bottom" : "2%"
                    }).addClass("firstH3 titoloCategoria");
                    h3.removeClass("firstH3");
                    h3.appendTo(".sezione").eq(i);
                    h3.html("Sezione " + categorie[i].toLowerCase() + "  "+ "<a> Scopri di più </a>").on("click",function(){openScopri(itemCorrente, categorie[i])});
            }
            for (let prodotto of prodotti) {
                if(prodotto.CategoriaPrincipale.toUpperCase().trim() == categorie[i]){
                    if(j<ITEMS){
                        let divSezione = $(".sezione").eq(i);
                        $("<div>").appendTo(divSezione).addClass("col")
                        .append($("<div>").addClass("card").append($("<div>")
                        .css({
                            "height" : "200px",
                            "text-align" : "center"
                        }).append($("<img>").addClass("card-img-top immagine").prop("src",prodotto["Immagine"])))
                        .append($("<div>").addClass("card-body")
                        .append($("<h7>").addClass("card-title marca bold").text(prodotto.marca))));
                        let divCard = $(".card-body").eq(elemento);
                        $("<br>").appendTo(divCard);
                        let divDescrizione = $("<div>").addClass("card-text").append($("<span>").addClass("descrizione")).appendTo(divCard);
                        if(parseInt(prodotto["Descrizione Prodotto"].length) >= 50){
                            let newText = prodotto["Descrizione Prodotto"].substring(0,50);
                            newText += "..."
                            divDescrizione.text(newText).prop("id",prodotto.IDProdotto).on("click",visualizzaProdotto);
                        }
                        else divDescrizione.text(prodotto["Descrizione Prodotto"]).prop("id",prodotto.IDProdotto).on("click",visualizzaProdotto);
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
                        j++;
                        elemento++;
                    }
                    else{
                        j=0;
                        break;
                    }
                }
            }
            j=0;
        }
    }
});
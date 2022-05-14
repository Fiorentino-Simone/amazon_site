"use strict";

const ITEMS = 5;

$(document).ready(function(){
    let valueItemSelected = window.location.search;
    valueItemSelected = valueItemSelected.substring(5,valueItemSelected.length);
    visualizzaProdotti(valueItemSelected);
    



    /*************************************FUNCTIONS *********************************/
    function visualizzaProdotti(itemSelected){
        let request = inviaRichiesta("GET", "server/elencoProdotti.php", {"categoria" : itemSelected});
        request.fail(errore);
        request.done(function(prodotti){
            console.log(prodotti);
            //caricare cards
            let categorie=[];
            let sottocategorie = [];
            let marche = [];
            let prezzi = []; //per la ricerca del prezzo massimo
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

            let j=0;
            for (let i = 0; i < categorie.length; i++) {
                //scorre nVolte le categorie da clonare
                if(i==0){
                    $(".titoloCategoria").eq(i).html("Sezione " + categorie[i].toLowerCase() + "  "+ "<a> Scopri di più </a>");
                    for (let prodotto of prodotti) {
                        if(j<ITEMS){
                            $(".sezione .marca").eq(j).text(prodotto.marca);
                            if(parseInt(prodotto["Descrizione Prodotto"].length) >= 50){
                                let newText = prodotto["Descrizione Prodotto"].substring(0,50);
                                newText += "..."
                                $(".sezione .descrizione").eq(j).text(newText).prop("id",prodotto.IDProdotto).on("click",visualizzaProdotto);
                            }
                            else $(".sezione .descrizione").eq(j).text(prodotto["Descrizione Prodotto"]).prop("id",prodotto.IDProdotto).on("click",visualizzaProdotto);
                            $(".sezione .immagine").eq(j).prop("src",prodotto["Immagine"]);
                            if(parseInt(prodotto["Stelle Recensioni"]) <= 1) $(".sezione .stelle").eq(j).prop("src","img/1_stella.png");
                            else $(".sezione .stelle").eq(j).prop("src","img/"+parseInt(prodotto["Stelle Recensioni"])+"_stella.png");
                            let price = parseFloat(prodotto["Prezzo"]).toFixed(2);
                            price = price.toString().replace(".",",");
                            $(".sezione .prezzo").eq(j).text(price+"€");
                            if(parseInt(prodotto["Prime"]) == 1) $(".sezione .prime").eq(j).prop("src","img/prime.png");
                            else $(".sezione .prime").eq(j).prop("src","");
                            j++;
                        }
                        else
                            break;
                    }
                }
                else{
                    $(".titoloCategoria").eq(0).clone().appendTo(cardsCategorie);
                    $(".titoloCategoria").eq(i).html("Sezione " + categorie[i].toLowerCase() + "  "+ "<a>Scopri di più</a>")
                    .removeClass("firstH3").css("left","0%");
                    $(".sezione").eq(0).clone().appendTo(cardsCategorie);
                    $(".sezione").eq(i).prop("id","sezione_"+i);
                    j=0;
                    for (let prodotto of prodotti) {
                        if(prodotto.CategoriaPrincipale.toUpperCase().trim() == categorie[i]){
                            if(j<ITEMS){
                                console.log(prodotto);
                                $("#sezione_"+i+" .marca").eq(j).text(prodotto.marca);
                                if(parseInt(prodotto["Descrizione Prodotto"].length) >= 50){
                                    let newText = prodotto["Descrizione Prodotto"].substring(0,50);
                                    newText += "..."
                                    $("#sezione_"+i+" .descrizione").eq(j).text(newText).prop("id",prodotto.IDProdotto).on("click",visualizzaProdotto);
                                }
                                else $("#sezione_"+i+" .descrizione").eq(j).text(prodotto["Descrizione Prodotto"]).prop("id",prodotto.IDProdotto).on("click",visualizzaProdotto);
                                $("#sezione_"+i+" .immagine").eq(j).prop("src",prodotto["Immagine"]);
                                if(parseInt(prodotto["Stelle Recensioni"]) <= 1) $("#sezione_"+i+" .stelle").eq(j).prop("src","img/1_stella.png");
                                else $("#sezione_"+i+" .stelle").eq(j).prop("src","img/"+parseInt(prodotto["Stelle Recensioni"])+"_stella.png");
                                let price = parseFloat(prodotto["Prezzo"]).toFixed(2);
                                price = price.toString().replace(".",",");
                                $("#sezione_"+i+" .prezzo").eq(j).text(price+"€");
                                if(parseInt(prodotto["Prime"]) == 1) $("#sezione_"+i+" .prime").eq(j).prop("src","img/prime.png");
                                else $("#sezione_"+i+" .prime").eq(j).prop("src","");
                                j++;
                            }
                            else
                                break;
                        }
                    }
                }  
            }
            //caricamento filtri 
            let filterWrapper = $("#Filter");
            ////////MARCHE:
            $("<h4>").text("Filtra la ricerca: ").appendTo(filterWrapper);
            $("<h7>").text("Marche selezionabili: ").appendTo(filterWrapper);
            j=0;
            for (let marca of marche) {
                $(filterWrapper).append(
                    $("<div>")
                    .addClass("form-check")
                    .append($("<input>")
                        .addClass("form-check-input")
                        .prop({
                            "type": "checkbox",
                            "value" : marca.toLowerCase(),
                            "id" : "Check"+ marca.toLowerCase()
                        })
                    )
                    .append($("<label>")
                    .addClass("form-check-label")
                    .prop("for","Check"+marca.toLowerCase())
                    .text(marca.toLowerCase())));
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
            $("<div>").appendTo(filterWrapper).addClass("btn-group dropend")
            .append($("<button>").attr({
                "type" : "button",
                "data-bs-toggle" : "dropdown",
                "aria-expanded" : "false"
            }).addClass("btn dropdown-toggle").text(itemSelected))
            .append($("<ul>").addClass("dropdown-menu"));
            for (let sottocategoria of sottocategorie) {
                $(".dropdown-menu")
                .eq(1)
                .append($("<li>")
                    .append($("<a>")
                    .addClass("dropdown-item")
                    .text(sottocategoria)
                ));
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
                    "name" : "flexRadioDefault",
                    "id" : "Prime"
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
                    "name" : "flexRadioDefault",
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
                    "name" : "flexRadioDefault3",
                    "id" : "VisualizzaOfferte"
                })
            )
            .append($("<label>")
            .addClass("form-check-label")
            .prop("for","VisualizzaOfferte")
            .text("Visualizza solo le offerte"));



            /******************FUNCTIONS *********/
            function maxPrice(){
                let vect = prezzi.map(parseFloat);
                console.log(vect);
                return Math.max(...vect);
            }

            function minPrice(){
                let vect = prezzi.map(parseFloat);
                console.log(vect);
                return Math.min(...vect);
            }

            function visualizzaProdotto(){
                let idProdotto = $(this).prop("id");
                window.open("prodotto.html?cat="+valueItemSelected+"&id="+idProdotto,"_self");
            }
        });
    }
});
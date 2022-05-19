"use strict";

const ELEMENTI = 3;

$(document).ready(function(){
    let sezione = window.location.search;
    let tableSezione = sezione.substring(7, sezione.indexOf("&"));
    let categoria = sezione.substring(sezione.indexOf("&") + 5, sezione.length).replaceAll("%20"," ");

    visualizzaProdottiPerCategoria(tableSezione, categoria);

    if(tableSezione == "alimentari") tableSezione = "Alimentazione e cura della casa";
    if(tableSezione == "auto") tableSezione = "Auto e Moto - Parti e Accessori";
    if(tableSezione == "cancelleria") tableSezione = "Cancelleria e prodotti per ufficio";
    if(tableSezione == "casa") tableSezione = "Casa e cucina";
    if(tableSezione == "CD") tableSezione = "CD e vinili";
    if(tableSezione == "dispositiviAmazon") tableSezione = "Dispositivi Amazon";
    if(tableSezione == "faiDaTe") tableSezione = "Fai da te";
    if(tableSezione == "film") tableSezione = "Film e TV";
    if(tableSezione == "giardinaggio") tableSezione = "Giardino e giardinaggio";
    if(tableSezione == "giochi") tableSezione = "Giochi e giocattoli";
    if(tableSezione == "grandiElettrodomestici") tableSezione = "Grandi elettrodomestici";


    $(document).prop('title', tableSezione + ": AMAZON");
    $(".titoloCategoria").text("Tutti i risultati per " + categoria.toLowerCase());
    $(".dropdown-toggle").html(tableSezione);


    /******************************FUNCTIONS **************************/
    function visualizzaProdottiPerCategoria(table, categoria){
        let itemCorrente = table;
        let request = inviaRichiesta("GET","server/elencoProdottiPerCategoria.php", {"table" : table, "categoria" : categoria});
        request.fail(errore);
        request.done(function(prodotti){
            console.log(prodotti);

            //caricare cards
            let sottocategorie = [];
            let marche = [];
            let prezzi = []; //per la ricerca del prezzo massimo
            for (let prodotto of prodotti) {
                if (!(sottocategorie.includes(prodotto.SottoCategoria.toUpperCase().trim())))
                    sottocategorie.push(prodotto.SottoCategoria.toUpperCase().trim());
                if (!(marche.includes(prodotto.marca.toUpperCase().trim())))
                    marche.push(prodotto.marca.toUpperCase().trim());
                if (!(prezzi.includes(prodotto.Prezzo)))
                    prezzi.push(prodotto.Prezzo);
            }


            let wrapCard = $("#cardsCategorie");
            let i = 0;
            for (let prodotto of prodotti) {
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
                i++;
            }


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
            }).addClass("btn dropdown-toggle").text(categoria.toLowerCase()))
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
        
        });      
    }
});
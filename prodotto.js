"use strict";

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

$(document).ready(function(){
    $("input[type='number']").inputSpinner()

    let prodotto = window.location.search;
    let catProdotto = prodotto.substring(5, prodotto.indexOf("&"));
    let idProdotto = prodotto.substring(prodotto.indexOf("&") + 4, prodotto.length);
    visualizzaProdotto(catProdotto, parseInt(idProdotto));


    /*******************************FUNCTIONS ********************************/
    function visualizzaProdotto(categoria, id){
        console.log(categoria, id);
        let request = inviaRichiesta("GET", "server/prodotto.php", {"categoria" : categoria, "idProdotto": id});
		request.fail(errore);
		request.done(function(prod){
            let prodotto = prod[0];
            console.log(prodotto);
            $(".image").prop("src",prodotto.Immagine).css("width","30%");
            $(".title").text(prodotto["Descrizione Prodotto"]);
            $(document).prop('title', prodotto["Descrizione Prodotto"]);

            if(parseInt(prodotto["Stelle Recensioni"]) <= 1) $(".stelle").prop("src","img/1_stella.png");
            else $(".stelle").prop("src","img/"+parseInt(prodotto["Stelle Recensioni"])+"_stella.png");
           
            if(parseFloat(prodotto["Prezzo"]) == 0){
                $(".prezzo").text("Gratuito");
            }
            else{
                $(".prezzo").text(parseFloat(prodotto["Prezzo"]).toFixed(2) + "€");
            }
            $("tr .prezzo").css({
                "color": "red",
                "font-size" : "22pt",
                "font-weight" : "bold"
            });
            $(".categoria").text(categoria);
            $(".sottocategoria").text(prodotto.SottoCategoria);
            $(".marca").text(prodotto.marca);
            $(".materiale").text(prodotto.Materiale);
            $(".maxAcquistabili").text(prodotto["Max Quantità"]);
            $("#inputQuantità").prop("max",prodotto["Max Quantità"])
            if(prodotto["Disponibilità"]==1) $(".disponibilità").text("Disponibile");
            else $(".disponibilità").text("Non disponibile");
            if(prodotto["Prime"]==1) $(".prime").text("Spedizione con prime");
            else $(".prime").text("Spedizione senza prime");

            if(prodotto["Prime"]==1) {
                $(".primeFoto").prepend($("<img>").prop("src","img/Prime.jpg"));
            }
            else{
                $(".primeFoto").text("");
                $(".primeFoto").remove();
            }
            //gestione date
            let giorno = moment().locale('it')
            .add(parseInt(prodotto["Tempo di Consegna"]), 'd')
            .format('dddd[,] D MMMM')

            $(".consegna").text(giorno).css("font-weight","bold");
            if(prodotto["Disponibilità"]!=1) $(".disponibilitàTesto").text("Non disponibile").css("color","red");
        });
    }
    
});
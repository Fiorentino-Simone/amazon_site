"use strict";


$(document).ready(function(){
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
            if(parseInt(prodotto["Stelle Recensioni"]) <= 1) $(".stelle").prop("src","img/1_stella.png");
            else $(".stelle").prop("src","img/"+parseInt(prodotto["Stelle Recensioni"])+"_stella.png");
            $(".prezzo").text(prodotto.Prezzo + "€").css({
                "color": "red",
                "font-size" : "22pt",
                "font-weight" : "bold"
            });
            $(".categoria").text(categoria);
            $(".sottocategoria").text(prodotto.SottoCategoria);
            $(".marca").text(prodotto.marca);
            $(".materiale").text(prodotto.Materiale);
            $(".maxAcquistabili").text(prodotto["Max Quantità"]);
            if(prodotto["Disponibilità"]==1) $(".disponibilità").text("Disponibile");
            else $(".disponibilità").text("Non disponibile");
            if(prodotto["Prime"]==1) $(".prime").text("Spedizione con prime");
            else $(".prime").text("Spedizione senza prime");
        });
    }
    
});
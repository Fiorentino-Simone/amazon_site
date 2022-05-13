"use strict"


$(document).ready(function(){
    let request = inviaRichiesta("GET", "server/elencoAbbigliamento.php");
    request.fail(errore);
    request.done(function(abbigliamento){
        console.log(abbigliamento);
        
        //carico card
        let i=0;
        if(i<=4){
            for (let vestito of abbigliamento) {
                $(" .marca").eq(i).text(vestito.marca);
                if(parseInt(vestito["Descrizione Prodotto"].length) >= 50){
                    let newText = vestito["Descrizione Prodotto"].substring(0,50);
                    newText += "..."
                    $(".descrizione").eq(i).text(newText);
                }
                else $(".descrizione").eq(i).text(vestito["Descrizione Prodotto"]);
                $(".immagine").eq(i).prop("src",vestito["Immagine"]);
                if(parseInt(vestito["Stelle Recensioni"]) <= 1) $(" .stelle").eq(i).prop("src","img/1_stella.png");
                let price = parseFloat(vestito["Prezzo"]).toFixed(2);
                price = price.toString().replace(".",",");
                $(".prezzo").eq(i).text(price+"€");
                if(parseInt(vestito["Prime"]) == 1) $(" .prime").eq(i).prop("src","img/prime.png");
                else $(" .prime").eq(i).prop("src","");
                i++;
            }
        }
    });
});
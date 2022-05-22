"use strict";

$(document).ready(function(){

    let options = window.location.search;
    let idUser = options.substring(10, options.length);
    let values = JSON.parse(window.localStorage.getItem('user' + idUser));
    let nomeUtente = values.Nominativo.substring(0,values.Nominativo.indexOf(" "));
    $(".utente").html("Ciao, " + nomeUtente);
    $(".indirizzo").html(values.Indirizzo);

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


    $(".buttonCarrello").eq(0).on("click",function(){
        if(window.location.search.includes("idUtente")){
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
    
    

    visualizzaOrdini();



    /*************************FUNCTIONS *************************************/
    function visualizzaOrdini(){
        let request = inviaRichiesta("GET","server/richiediOrdini.php",{idUser});
        request.fail(errore);
        request.done(function(dati){
            console.log(dati);
            if(dati.length == 0){
                $(".wrapper h6").html("Nessun ordine ancora effettuato per:  "+nomeUtente).css("display","initial");
            }
            else{
                let elemento = 0;
                for (let prodotto of dati) {
                    console.log(prodotto);
                    let prodotti = prodotto.Descrizione.split('|');
                    console.log(prodotti);
                    $("<div>").appendTo(cardsArticoli).css("width","80%")
                    .append($("<div>").addClass("card")
                    .append($("<div>").addClass("card-body")
                    .append($("<h4>").addClass("card-title descrizione bold").html("Ordine numero: " + ++elemento))));
                    elemento--;
                    let divCard = $(".card-body").eq(elemento);
                    $("<h6>").html("Prodotti acquistati: ").appendTo(divCard);
                    for (let item of prodotti) {
                        $("<li>").appendTo(divCard)
                        .html(item);
                    }
                    let price = parseFloat(prodotto["PrezzoTotale"]).toFixed(2);
                    price = price.toString().replace(".",",");
                    $("<div>").addClass("card-text prezzo").text("Prezzo totale pagato: " + price+"€").appendTo(divCard);
                    $("<div>").css({
                        "width" : "100%",
                        "text-align" : "center",
                    });
                    if(prodotto.Restituito == 0){
                        $("<button>").html("Vuoi restituire i prodotti?").appendTo(divCard).addClass("btn").prop("id",prodotto.IdTransazione).css({"text-align":"center", "padding-left" : "0"}).on("click", richiediOrdine);
                    }
                    else{
                        $("<h5>").text("Prodotti già restituiti").appendTo(divCard).css("color","#0f0");
                    }
                    elemento++;
                }
            }
        })


        function richiediOrdine(){
            Swal.fire({
                title: 'Sei sicuro?',
                text: "Se premi si, partirà la procedura di reso",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, restituisci tutto',
                cancelButtonText: 'Annulla',
            }).then((result) => {
                if (result.isConfirmed) {
                    let id = $(this).prop("id");
                    let request = inviaRichiesta("GET","server/richiediReso.php", {id});
                    request.fail(errore);
                    request.done(function(ris){
                        if(ris.ris == "ok") {
                            Swal.fire({
                                title : 'Restituiti!',
                                showCancelButton: true,
                            });
                            window.location.reload();
                        }
                    })
                }
            })
        }
    }
});
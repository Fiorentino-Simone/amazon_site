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
        if(window.location.search.includes("idUtente")){
            window.open("ordini.html?idUtente="+idUser,"_self");
        }
        else window.open("login.html","_self");
    }) 
    
    let elemento = 0;
    let prezzo = 0;
    let prodotti = 0;
    let descrizione = "";
    

    visualizzaCarrello();



    /*************************FUNCTIONS *************************************/
    function visualizzaCarrello(){
        let carrelloUser = JSON.parse(window.localStorage.getItem("carrello_user" + idUser));
        if(carrelloUser != null && carrelloUser.length != 0){ 
            for (let prodotto of carrelloUser) {
                console.log(prodotto);
                $("<div>").appendTo(cardsArticoli).css("width","80%")
                .append($("<div>").addClass("card").append($("<div>")
                .append($("<img>").addClass("card-img-top immagine").prop("src",prodotto["Immagine"])))
                .append($("<div>").addClass("card-body")
                .append($("<h7>").addClass("card-title descrizione bold").text(prodotto["Descrizione Prodotto"]).prop("id",prodotto.IDProdotto).on("click",function(){
                    visualizzaProdotto(prodotto["table"],prodotto.IDProdotto);
                }))));
                descrizione += prodotto["table"]+";"+prodotto.IDProdotto + "&";
                let divCard = $(".card-body").eq(elemento);
                let divDescrizione = $("<div>").addClass("card-text").text("di ").append($("<span>").addClass("marca")).appendTo(divCard);
                divDescrizione.text(prodotto["marca"])
                let price = parseFloat(prodotto["Prezzo"]).toFixed(2);
                prezzo += (price * parseInt(prodotto["quantità"]));
                prodotti += parseInt(prodotto["quantità"]);
                price = price.toString().replace(".",",");
                $("<div>").addClass("card-text prezzo").text(price+"€").appendTo(divCard);
                $("<div>").css({
                    "width" : "100%",
                    "text-align" : "center",
                }).append($("<img>").addClass("img-fluid prime").prop("src",function(){
                    if(parseInt(prodotto["Prime"]) == 1) return "img/prime.png"
                    else return ""
                })).appendTo(divCard);
                $("<div>").html("Quantità selezionate: "+prodotto["quantità"]).appendTo(divCard).css("text-align","center");
                $("<button>").html("rimuovi articolo").appendTo(divCard).addClass("btn").prop("id",elemento).css("text-align","center").on("click", rimuoviArticoloDalCarrello);
                elemento++;
            }
            $(".numeroProdotti").text(elemento);
            $("<div>").css({"margin-left":"50%","width": "fit-content"}).appendTo("#cardsArticoli").append(
                $("<h5>").text("Costo totale: " + prezzo.toFixed(2) + "€")
            ).append($("<button>").addClass("btn").text("COMPRA ADESSO").on("click",compraProdotti));
            
        }
        else if(carrelloUser == null || carrelloUser.length==0){
            console.log(carrelloUser);
            $("#cardsArticoli").remove();
            $(".wrapper a").eq(0).remove();
            $(".wrapper h6").html("Nessun prodotto nel carrello per:  "+nomeUtente).css("display","initial");
        }


        function rimuoviArticoloDalCarrello(){
            let newCarrello = [];
            let i = 0;
            let index = $(this).prop("id");
            for (let item of carrelloUser) {
                if(i != index) newCarrello.push(item);
                i++;
            }
            window.localStorage.removeItem('carrello_user'+idUser);
            window.localStorage.setItem('carrello_user'+idUser, JSON.stringify(newCarrello));
            window.location.reload();
        }

        function compraProdotti(){
            let prodotti = "";
            for (let item of carrelloUser) {
                prodotti += item["Descrizione Prodotto"] + "\n";
            }
            let user = JSON.parse(window.localStorage.getItem("user" + idUser));
            let email = user.Email;
            let nome = user.Nominativo;
            /*let request = inviaRichiesta("GET","server/inviaEmail.php", {prodotti, nome, email});
            request.fail(errore);
            request.done(function(ris){
                console.log(ris);
            })*/
            let request = inviaRichiestaEmail("GET","server/inviaEmail.php");
            request.fail(errore);
            request.done(function(data){
                console.log(data);
            })
            /*let user = JSON.parse(window.localStorage.getItem("user" + idUser));
            let indirizzo = user.Indirizzo;
            descrizione = JSON.stringify(descrizione);
            let request = inviaRichiesta("GET","server/aggiungiAcquisto.php", {prodotti,idUser,descrizione,prezzo, indirizzo});
            request.fail(errore);
            request.done(function(ris){
                if(ris.ris == "ok"){
                    Swal.fire({
                        title : 'Acquistati!',
                        showCancelButton: true,
                    }).then(function() {
                        window.localStorage.removeItem('carrello_user'+idUser);
                        window.open("index.html?idUtente="+idUser,"_self");
                    });
                }
            })*/
        }
    }


    function visualizzaProdotto(table, idProdotto){
        let query = "prodotto.html?cat="+table+"&id="+idProdotto;
        query += "&idUtente=" + idUser;
        window.open(query, "_self");
    }
});
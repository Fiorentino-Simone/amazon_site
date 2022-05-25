"use strict";

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

$(document).ready(function(){
    $("#inputQuantità").inputSpinner();

    let prodotto = window.location.search;
    let userActive = false;
    let catProdotto = prodotto.substring(5, prodotto.indexOf("&"));
    let idProdotto;
    let idUtente;
    if(window.location.search.includes("idUtente")){
        let idAndUtente = prodotto.substring(prodotto.indexOf("&") + 4, prodotto.length);
        idProdotto = idAndUtente.substring(0, idAndUtente.indexOf("&"));
        idUtente = idAndUtente.substring(idAndUtente.indexOf("&") + 10, idAndUtente.length);
        console.log("ID PRODOTTO" ,idProdotto);
        console.log("ID UTENTE " , idUtente);
        let values = JSON.parse(window.localStorage.getItem('user' + idUtente));
        let nomeUtente = values.Nominativo.substring(0,values.Nominativo.indexOf(" "));
        $(".utente").html("Ciao, " + nomeUtente);
        $(".indirizzo").html(values.Indirizzo);
        userActive = true;
    }
    else{
        idProdotto = prodotto.substring(prodotto.indexOf("&") + 4, prodotto.length);
    }
    console.log("ID PRODOTTO" ,idProdotto);

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
        window.localStorage.removeItem("user"+idUtente);
        window.open("index.html","_self");
    })

    let carrelloUser = JSON.parse(window.localStorage.getItem("carrello_user" + idUtente));
    if(carrelloUser != null){
        $(".numeroProdotti").eq(0).text(carrelloUser.length);
    }

    $(".buttonCarrello").eq(0).on("click",function(){
        if(window.location.search.includes("idUtente")){                
            window.open("carrello.html?idUtente="+idUtente,"_self");
        }
        else window.open("login.html","_self");
    })  

    $(".btnOrdini").on("click",function(){
        if(window.location.search.includes("idUtente")){
            window.open("ordini.html?idUtente="+idUtente,"_self");
        }
        else window.open("login.html","_self");
    }) 

    let tabella = catProdotto;
    let idProduct = parseInt(idProdotto);
    visualizzaProdotto(catProdotto, parseInt(idProdotto));
    visualizzaRecensioni(catProdotto, parseInt(idProdotto));

    if(catProdotto == "alimentari") catProdotto = "Alimentazione e cura della casa";
    if(catProdotto == "auto") catProdotto = "Auto e Moto - Parti e Accessori";
    if(catProdotto == "cancelleria") catProdotto = "Cancelleria e prodotti per ufficio";
    if(catProdotto == "casa") catProdotto = "Casa e cucina";
    if(catProdotto == "CD") catProdotto = "CD e vinili";
    if(catProdotto == "dispositiviAmazon") catProdotto = "Dispositivi Amazon";
    if(catProdotto == "faiDaTe") catProdotto = "Fai da te";
    if(catProdotto == "film") catProdotto = "Film e TV";
    if(catProdotto == "giardinaggio") catProdotto = "Giardino e giardinaggio";
    if(catProdotto == "giochi") catProdotto = "Giochi e giocattoli";
    if(catProdotto == "grandiElettrodomestici") catProdotto = "Grandi elettrodomestici";


    
    $(".dropdown-toggle").html(catProdotto);



    /*******************************FUNCTIONS ********************************/
    function visualizzaProdotto(categoria, id){
        console.log(categoria, id);
        let request = inviaRichiesta("GET", "server/prodotto.php", {"categoria" : categoria, "idProdotto": id});
		request.fail(errore);
		request.done(function(prod){
            let prodotto = prod[0];
            console.log(prodotto);
            if(parseInt(prodotto["Disponibilità"]) == 0){
                $("#btnAcquista").prop("disabled",true);
                $("#btnAcquistaOra").prop("disabled",true);
            } 
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
            $(".miPiace").text(prodotto["Mi Piace"]);
            let miPiace = false;
            $("#like").on("click",function(){
                if(miPiace == false) miPiace = true;
                else miPiace = false;
                if(miPiace){
                    let like = parseInt($(".miPiace").text());
                    like++;
                    let request = inviaRichiesta("GET", "server/miPiace.php",{categoria, id, like});
                    request.fail(errore);
                    request.done(function(ris){
                        $("#like").css({"background-image":"url(img/likeClick.png)",
                        "background-color" : "transparent"});
                        $(".miPiace").html(like);
                    })
                }
                else{
                    let like = parseInt($(".miPiace").text());
                    like--;
                    let request = inviaRichiesta("GET", "server/miPiace.php",{categoria, id, like});
                    request.fail(errore);
                    request.done(function(ris){
                        $("#like").css({"background-image":"url(img/like.png)",
                        "background-color" : "transparent"});
                        $(".miPiace").html(like);
                    })
                }
            })
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
        

            $("#btnAcquista").on("click",compra);
            $("#btnAcquistaOra").on("click",compra);

            $("#inputQuantità").on("change",function(){
                $("#btnAcquista").html(((parseFloat(prodotto["Prezzo"]).toFixed(2)) * $(this).val())  + "€" + " -- Aggiungi al carrello");
            })
            
            function compra(){
                if(userActive){
                    if(window.localStorage.getItem('carrello_user' + idUtente) == null){
                        //devo creare il carrello per quel utente
                        let array = [];
                        array.push(aggiungiAlCarrello());
                        window.localStorage.setItem('carrello_user' + idUtente, JSON.stringify(array));
                        window.open("carrello.html?idUtente="+idUtente,"_self");
                    }
                    else{
                        let carrello = JSON.parse(window.localStorage.getItem('carrello_user' + idUtente));
                        carrello.push(aggiungiAlCarrello());
                        window.localStorage.removeItem('carrello_user'+idUtente);
                        window.localStorage.setItem('carrello_user'+idUtente, JSON.stringify(carrello));
                        window.open("carrello.html?idUtente="+idUtente,"_self");
                    }
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: "Devi prima fare l'accesso per visualizzare il carrello",
                        footer: '<a>Se riscontri problematiche, contattami !</a>'
                    })
                }
            }
        
            function aggiungiAlCarrello(){
                let vect = {
                    "Immagine" : prodotto.Immagine,
                    "table" : categoria,
                    "Descrizione Prodotto" : prodotto["Descrizione Prodotto"],
                    "IDProdotto" : id,
                    "Tempo di Consegna" : prodotto["Tempo di Consegna"], 
                    "marca" : prodotto.marca,
                    "Prezzo" : prodotto["Prezzo"],
                    "Prime" : prodotto["Prime"],
                    "quantità" : $("#inputQuantità").val()
                }
                return vect;
            }
        
        });
    }

    function visualizzaRecensioni(table, id){
        let request = inviaRichiesta("GET", "server/richiediRecensioni.php", {table,id});
        request.fail(errore);
        request.done(function(data){
            let container = $(".containerRecensioni .containerUser");            
            if(data.length != 0) {
                for (let recensioni of data) {
                    let divUser = $("<div>").appendTo(container).css("display","flex");
                    divUser.append($("<i>").addClass("fa-solid fa-user"));
                    divUser.append($("<span>").css("margin-left","15px").text("Utente di nome: ").append($("<span>").text(recensioni.NomeUser)));
                    let divUserParent = $("<div>").appendTo(container);
                    divUserParent.append($("<div>").text("Stelle assegnate: ").append($("<img>").prop({
                        "src":"img/"+recensioni.Stelle+"_stella.png",
                        "height" : "40"
                    })));
                    divUserParent.append($("<div>").text("Descrizione prodotto:  ").append($("<span>").text(recensioni.Descrizione)));
                    divUserParent.append($("<br>"));
                }     
                $(".divInserisciRecensione").css("display","initial");
            }
            else{
                container.children("br").remove();
                container.append($("<div>").html("Nessuna recensioni disponibile"));
                $(".divInserisciRecensione").css("display","initial");
            }           
        });
    }

    $("#inviaRecensione").on("click",function(){
        let nomeUser = $("#user").val();
        let descrizioneUser = $("#descrizioneUser").val();
        let stelle = parseInt($("#stelleUser").val());
        if(nomeUser != "" && descrizioneUser != ""){
            let request = inviaRichiesta("GET","server/scriviRecensione.php",{tabella, idProduct, nomeUser,descrizioneUser,stelle});
            request.fail(errore);
            request.done(function(data){
                console.log(data);
                if(data.ris == "ok"){
                    alert("Recensione inserita correttamente!");
                    window.location.reload();
                }
            });
        }
        else alert("Compila i campi prima di inviare");
    })
});
"use strict";

$(document).ready(function(){
    let button = `.buttonHeader, 
    .buttonAccedi, 
    .buttonOrdini,
    .buttonCarrello,
    .buttonAll`;
    $(button).on("mouseenter",function(){
        $(this).css("border","1px solid white");
    });
    $(button).on("mouseleave",function(){
        $(this).css("border","");
    });

    $("#dropdownMenuButton1").on("click",
    function(){
        $(this).show();
    });

    /*
    .buttonBestSeller,
    .buttonAmazonBasic,
    .buttonClienti,
    .buttonOfferte,
    .buttonNovita,
    .buttonPrime,
    .buttonMusic,
    .buttonModa,
    .buttonLibri,
    .buttonVideogiochi,
    .buttonElettronica,
    .buttonCucina

    DA CORRREGGERE IL BORDER*/
});
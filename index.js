"use strict";

$(document).ready(function(){
    let buttons = `.buttonHeader, 
    .buttonAccedi, 
    .buttonOrdini,
    .buttonCarrello,
    .buttonAll,
    .buttonBestSeller div,
    .buttonAmazonBasic div,
    .buttonClienti div,
    .buttonOfferte div,
    .buttonNovita div,
    .buttonPrime div,
    .buttonMusic div,
    .buttonModa div,
    .buttonLibri div,
    .buttonVideogiochi div,
    .buttonElettronica div,
    .buttonCucina div`;

    $(buttons).on("mouseenter",function(){
        $(this).css("border","1px solid white");
        if($(this).hasClass("libri")) $(this).css("left","510%");
    });

    $(buttons).on("mouseleave",function(){
        $(this).css("border","");
        if($(this).hasClass("libri")) $(this).css("left","");
    });

    $("#dropdownMenuButton1").on("click",
    function(){
        $(this).show();
    });

    let items = $(".categorie .dropdown-item");
    let itemSelected;
    items.on("click",function(){
        itemSelected = $(this).text();
        console.log(itemSelected);
        if(itemSelected == "Alimentazione e cura della casa") itemSelected = "alimentari";
        window.open("visualizzazione.html?cat="+itemSelected,"_self");
    });

    
});
"use strict";

$(document).ready(function(){
    $(".buttonHeader, .buttonAccedi, .buttonOrdini, .buttonCarrello").on("mouseenter",function(){
        $(this).css("border","1px solid white");
    });
    $(".buttonHeader, .buttonAccedi, .buttonOrdini, .buttonCarrello").on("mouseleave",function(){
        $(this).css("border","");
    });

    $("#dropdownMenuButton1").on("click",
    function(){
        $(this).show();
    });
});
console.log("das gfld");
var elem = document.getElementById("grid-ct");
elem.style.fontFamily= '"Open Sans",Arial,"Lucida Grande",sans-serif !important';
//elem.style.fontSize= '16px !important';

var searchBtn = document.getElementById("splitbutton1-button");
searchBtn.innerText = "";


var header = document.getElementById("Header");
header.style.width = "100%";
header.style.backgroundColor =  "rgb(36, 41, 46) !important;";

var tickets = $(".x-grid3-col-hpColHeading_0ticket_type").each(function(){
    var _name = $(this).children("img").attr("title");
    if( _name !== undefined){
        $(this).text(_name);
    }
});






$(function(){
    var homepageDiv = $("[id^=homepageGrid]");
    var tableHeader = $(".x-grid3-hd-row");

    $.moveColumn = function (table, from, to) {
        var rows = $('tr', table);
        var cols;
        rows.each(function() {
            cols = $(this).children('th, td');
            cols.eq(from).detach().insertBefore(cols.eq(to));
        });
    };

    $.moveColumn(tableHeader, 7, 5);
    $.moveColumn(homepageDiv, 7, 5);

    $.moveColumn(tableHeader, 7, 9);
    $.moveColumn(homepageDiv, 7, 9);

    var num_open = $('.x-grid3-col-hpColHeading_status:contains("Open")').empty().addClass("openIcon");
    var num_test = $('.x-grid3-col-hpColHeading_status:contains("Testing")').empty().addClass("testIcon");
    var num_dev = $('.x-grid3-col-hpColHeading_status:contains("Development")').empty().addClass("devIcon");
    var num_appro = $('.x-grid3-col-hpColHeading_status:contains("Approvals")').empty().addClass("appIcon");
    var num_prod = $('.x-grid3-col-hpColHeading_status:contains("Scheduled for Prod")').empty().addClass("prodIcon");
});

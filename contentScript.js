console.log("das gfld");
var elem = document.getElementById("grid-ct");
elem.style.fontFamily= '"Open Sans",Arial,"Lucida Grande",sans-serif !important';
//elem.style.fontSize= '16px !important';

var searchBtn = document.getElementById("splitbutton1-button");
searchBtn.innerText = "";


var header = document.getElementById("Header");
header.style.width = "100%";
header.style.backgroundColor =  "rgb(36, 41, 46) !important;";

console.log("now in jquery");
var tickets = $(".x-grid3-col-hpColHeading_0ticket_type").each(function(){
    var _name = $(this).children("img").attr("title");
    if( _name !== undefined){
        $(this).text(_name);
    }
    console.log(_name);
});
console.log(tickets.length);


$.moveColumn = function (table, from, to) {
    var rows = $('tr', table);
    var cols;
    rows.each(function() {
        cols = $(this).children('th, td');
        cols.eq(from).detach().insertBefore(cols.eq(to));
    });
};

var homepageDiv = $("[id^=homepageGrid]");
var _table = $(".x-grid3-row-table");
//$.moveColumn(homepageDiv, 7, 3);
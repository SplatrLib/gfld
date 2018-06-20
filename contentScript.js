$(function(){
    console.log("das gfld");
    var elem = document.getElementById("grid-ct");
    elem.style.fontFamily= '"Open Sans",Arial,"Lucida Grande",sans-serif !important';
    //elem.style.fontSize= '16px !important';

    var searchBtn = document.getElementById("splitbutton1-button");
    searchBtn.innerText = "";

    var header = document.getElementById("Header");
    header.style.width = "100%";
    header.style.backgroundColor =  "rgb(36, 41, 46) !important;";

    var head_row = $("#homepageGrid-LXZHUKOV-28 table[class='x-grid3-header'] tbody tr");
    console.log("rows found:" + head_row.length);

    var main_rows = $("#homepageGrid-LXZHUKOV-28 table[class='x-grid3-row-table'] tbody tr").each(function(){
        var cols = $('td', $(this));
        console.log(cols.length);
        var col_id = $('.x-grid3-td-hpColHeading_0id', $(this));
        var col_checkbox = $('.x-grid3-td-hpColHeading_0master_checkbox', $(this));
        var col_attachments = $('.x-grid3-td-hpColHeading_0attachments', $(this));
        var col_master = $('.x-grid3-td-hpColHeading_0ticket_type', $(this));
        var col_status = $('.x-grid3-td-hpColHeading_status', $(this));
        var col_system = $('.x-grid3-td-hpColHeading_System', $(this));
        var col_product = $('.x-grid3-td-hpColHeading_Product', $(this));
        var col_title = $('.x-grid3-td-hpColHeading_title', $(this));
        var col_dept = $('.x-grid3-td-hpColHeading_Dept', $(this));
        var col_ticketNumber = $('.x-grid3-td-hpColHeading_mr', $(this));
    });
    console.log("rows found:" + main_rows.length);

    var tickets = $(".x-grid3-col-hpColHeading_0ticket_type").each(function(){
        var _name = $(this).children("img").attr("title");
        if( _name !== undefined){
            $(this).text(_name);
        }
    });

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

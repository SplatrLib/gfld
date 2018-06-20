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

    var head_row = $("div[id*='homepageGrid'] table[class='x-grid3-header'] tbody tr");
    console.log("rows found:" + head_row.length);


    var num_open = 0;
    var num_test = 0;
    var num_dev = 0;
    var num_appro = 0;
    var num_prod = 0;


    var main_rows = $("div[id*='homepageGrid'] table[class='x-grid3-row-table'] tbody tr").each(function(){
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

        $(this).find(col_id).remove();
        $(this).find(col_checkbox).remove();
        $(this).find(col_attachments).remove();

        //set the status icons
        if(col_status !== undefined){
            num_open += $(':contains("Open")', col_status).empty().addClass("openIcon").length;
            num_test += $(':contains("Testing")', col_status).empty().addClass("testIcon").length;
            num_dev += $(':contains("Development")', col_status).empty().addClass("devIcon").length;
            num_appro += $(':contains("Approvals")', col_status).empty().addClass("appIcon").length;
            num_prod += $(':contains("Scheduled for Prod")', col_status).empty().addClass("prodIcon").length;
        }

        //concat system and product into one value
        if(col_system !== undefined && col_product !== undefined){
            var inner_s = $('div', col_system);
            var inner_p = $('div', col_product);
            var inner_s_text = inner_s.text();
            var inner_p_text = inner_p.text();

            var new_s_text = inner_s_text.replace("(WrightFlood / Portal)"," ");
            console.log(inner_p_text);

            var _string = new_s_text.trim() + '/' + inner_p_text;
            inner_s.empty();
            inner_s.removeAttr('style');
            col_system.removeAttr('style');
            inner_s.append( $('<div>', {class:'inner_s_class'}).append(_string));

            //add the title link to the system/product row
            if(col_title !== undefined){
                var inner_t = $('div', col_title);
                inner_s.append(inner_t);
            }
        }

        $(this).find(col_product).remove();
        $(this).find(col_title).remove();

        var row2 = $('<tr>', {class: "displayRow2"});
        row2.append($('<td>'));

        if(col_ticketNumber !== undefined){
            var inner_n = $('div', col_ticketNumber);
            var inner_d = $('div', col_dept);
            var inner_m = $('div', col_master);

            var inner_n_text = inner_n.text();
            var inner_d_text = inner_d.text();
            var inner_m_text = inner_m.text();

            //replace master ticket icon with name
            if(col_master !== undefined){
                var _name = $('div img',$(this)).attr("title");
                console.log(_name);
                if( _name !== undefined ){
                    inner_m_text = _name.replace('\xa0', "");
                }
            }

            var _string2 = '#' + inner_n_text + ' opened by ' + inner_d_text;
            if(inner_m_text !== undefined && inner_m_text.indexOf("Ticket") >= 0){
                _string2 =  _string2 + ' [ ' + inner_m_text + ' ] ';
            }

            row2.append($('<td>').append(_string2));
        }

        row2.insertAfter($(this));

        $(this).find(col_ticketNumber).remove();
        $(this).find(col_dept).remove();
        $(this).find(col_master).remove();

    });
    console.log("num_open: " + num_open);
    console.log("num_dev: " + num_dev);

    var head = $("div[id*='homepageGrid'] div[class='x-grid3-header'] tr").empty();

    head.append($('<div>', {class: 'headerInfoBar'})
        .append($('<div>', {class:'appIcon headerIcon'}))
        .append($('<div>', {class:'iconInfo'})
            .append(num_appro + " Approvals")
        )
    );

    head.append($('<div>', {class: 'headerInfoBar'})
        .append($('<div>', {class:'testIcon headerIcon'}))
        .append($('<div>', {class:'iconInfo'})
            .append(num_test + " Testing")
        )
    );

    head.append($('<div>', {class: 'headerInfoBar'})
            .append($('<div>', {class:'devIcon headerIcon'}))
            .append($('<div>', {class:'iconInfo'})
                .append(num_dev + " Development")
            )
    );

});

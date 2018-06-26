$(function(){
    //font
    var elem = document.getElementById("grid-ct");
    elem.style.fontFamily= '"Open Sans",Arial,"Lucida Grande",sans-serif !important';

    //clear the inner text of the search box
    var searchBtn = document.getElementById("splitbutton1-button");
    searchBtn.innerText = "";

    //background color of the Header
    var header = document.getElementById("Header");
    header.style.width = "100%";
    header.style.backgroundColor =  "rgb(36, 41, 46) !important;";

    //create a map out of the header row (index, innerText)
    var head_row = $("div[id*='homepageGrid'] div[class='x-grid3-header'] tr");
    var headerMap = $("td div", head_row).map(function() {
        return this.innerText;
    }).get();

    console.log(headerMap);

    //ticket type counters
    var num_open = 0;
    var num_test = 0;
    var num_dev = 0;
    var num_appro = 0;
    var num_prod = 0;
    var num_rev = 0;

    //handle the rows
    var main_rows = $("div[id*='homepageGrid'] table[class='x-grid3-row-table'] tbody tr").each(function(){
        var cols = $('td', $(this));
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
        var col_devStatus = $('.x-grid3-td-hpColHeading_Dev__bStatus', $(this));
        var TICKET_NUMBER = Math.floor(Math.random()*90000) + 10000;;

        //flag the id, checkbox, and attachments columns to be removed
        col_id.addClass("req_rm");
        col_checkbox.addClass("req_rm");
        col_attachments.addClass("req_rm");

        //set the status icons
        if(col_status !== undefined){
            num_open += $(':contains("Open")', col_status).empty().addClass("openIcon").length;
            num_test += $(':contains("Testing")', col_status).empty().addClass("testIcon").length;
            num_dev += $(':contains("Development")', col_status).empty().addClass("devIcon").length;
            num_appro += $(':contains("Approvals")', col_status).empty().addClass("appIcon").length;
            num_prod += $(':contains("Scheduled for Prod")', col_status).empty().addClass("prodIcon").length;
            num_rev += $(':contains("Code Review")', col_status).empty().addClass("reviewIcon").length;

            //keep the status column
            col_status.addClass("req_fp");
        }

        //task: add something for development status - development
        if(col_devStatus !== undefined){
           if($(':contains("Development")', col_devStatus).length === 1){
            }
            //col_devStatus.addClass("req_rm");
        }


        //concat system and product into one value
        if(col_system !== undefined && col_product !== undefined){
            var inner_s = $('div', col_system);
            var inner_p = $('div', col_product);
            var inner_s_text = inner_s.text();
            var inner_p_text = inner_p.text();

            var new_s_text = inner_s_text.replace("(WrightFlood / Portal)"," ");

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

        //flag the system, product, and title columns to be removed
        col_system.addClass("req_fp");
        col_product.addClass("req_rm");
        col_title.addClass("req_rm");

        //create the 2nd row
        var row2 = $('<tr>', {class: "displayRow2"});
        row2.append($('<td>'), {class:"req_fp"});

        //ticket number, department, master ticket info
        if(col_ticketNumber !== undefined){
            var inner_n = $('div', col_ticketNumber);
            var inner_d = $('div', col_dept);
            var inner_m = $('div', col_master);

            var inner_n_text = inner_n.text();
            var inner_d_text = inner_d.text();
            var inner_m_text = inner_m.text();

            TICKET_NUMBER = inner_n_text;

            //replace master ticket icon with name
            if(col_master !== undefined){
                var _name = $('div img',$(this)).attr("title");
                if( _name !== undefined ){
                    inner_m_text = _name.replace('\xa0', "");
                }
            }

            //master ticket link
            var _string2 = '#' + inner_n_text + ' opened by ' + inner_d_text + '  ';
            var _ticket = $('<div>', {class:"noFmt"}).append(_string2);

            var _td = $('<td>',{class:"req_fp"});
            _td.append(_ticket);

            if(inner_m_text !== undefined && inner_m_text.indexOf("Ticket") >= 0){
                var master_ticket = inner_m_text.match(/\d+/);
                var masterTicketLink = $('<div>', {class:"noFmt padLeft", onClick:"goToDetails("+master_ticket+", 28);", style:"cursor: pointer;"});
                var link_string =  ' [ ' + inner_m_text + ' ] ';
                masterTicketLink.append(link_string);
                _td.append(masterTicketLink);
            }

            row2.append(_td);
        }

        col_ticketNumber.addClass("req_rm");
        col_dept.addClass("req_rm");
        col_master.addClass("req_rm");

        //insert the new row after the current row, in the same table
        row2.insertAfter($(this));

        //create tooltips out of any remaining colums that have
        //not been flagged to keep (.req_fp) or remove (.req_rm)
        var resCard = dataCard($(this), headerMap, TICKET_NUMBER);

        $(this).find('.req_rm').remove();

        col_status.addClass('tipped');

        col_status.tooltipster({
                content: resCard,
                animation: 'fade',
                delay: 200,
                theme: 'tooltipster-light',
                position: 'left'
        });
    });

    //empty the head row
    head_row.empty();

    //ticket summary header lables
    head_row.append($('<div>', {class: 'headerInfoBar'})
        .append($('<div>', {class:'appIcon headerIcon'}))
        .append($('<div>', {class:'iconInfo'})
            .append(num_appro + " Approvals")
        )
    );

    head_row.append($('<div>', {class: 'headerInfoBar'})
        .append($('<div>', {class:'testIcon headerIcon'}))
        .append($('<div>', {class:'iconInfo'})
            .append(num_test + " Testing")
        )
    );

    head_row.append($('<div>', {class: 'headerInfoBar'})
            .append($('<div>', {class:'devIcon headerIcon'}))
            .append($('<div>', {class:'iconInfo'})
                .append(num_dev + " Development")
            )
    );


    function dataCard(row, headerMap, id){
        var card = $('<div>', {id: (id+'card'), class:'tooltip_templates'});
        var innercard = $('<div>', {class:"innerCard"});
        var others = $('td:not(.req_fp,.req_rm)', row).map(function(){
            var _div = $('div', this);
            var inner = $('<div>');
            var _text = _div.text();
            var _name = headerMap[this.cellIndex];
            var result =  _name + ": " + _text;
            innercard.append(inner.append(result));
        });

        card.append(innercard);
        return card;
    }

});

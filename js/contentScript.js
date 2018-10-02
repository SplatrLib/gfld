(($, undefined) => {
	$.fn.extend({
		/**
		 * Iterate over a jQuery object, executing a function for each matched element.
		 * Similar to the jQuery .each function. The only difference is the second argument passed to the callback
		 * function is a jQuery object instead of the DOMElement. Execution speed is much better than instantiating
		 * a new jQuery object on each iteration. The `this` keyword still points to the DOMElement.
		 * Inspired by Ben Alman's each2 jQuery plugin.
		 * @author jason.dimeo
		 * @see http://benalman.com/projects/jquery-misc-plugins/
		 * @param {function} fn - Function to call at each iteration. function(index, jQuery)
		 * @returns {jQuery} The jQuery object passed to the function.
		 */
		each$(fn) {
			for (let i = 0, length = this.length, $elem = $([1]); i < length; i++) {
				if (fn.call($elem.context = $elem[0] = this[i], i, $elem) === false) {
					break;
				}
			}
			return this;
		},
		exists() {
			return this.length > 0;
		}
	});

	$(() => {
        //clear the inner text of the search box
		document.getElementById('splitbutton1-button').innerText = '';
		document.getElementById('grid-ct').style.fontFamily = '"Open Sans", Arial, "Lucida Grande", sans-serif !important';

        $('link[rel="SHORTCUT ICON"]').attr('href', 'data:image/png;base64,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');


        //background color of the Header
		const header = document.getElementById('Header');
		header.style.width = '100%';
		header.style.backgroundColor = 'rgb(36, 41, 46) !important;';

        //create a map out of the header row (index, innerText)
        const head_row = $("div[id*='homepageGrid'] div[class='x-grid3-header'] tr");
        const headerMap = $("td div", head_row).map(function() {
            return this.innerText;
        }).get();

        //ticket type counters
		let openTickets = 0;
		let testingTickets = 0;
		let devTickets = 0;
		let approvedTickets = 0;
		let productionTickets = 0;
		let codeReviewTickets = 0;

		let shownGroups = 0;

        //handle the rows
		$('[id^=grid-ct]').attr('style', '');
        $('[id^=ext-gen]').attr('style', '');
        $('[class^=x-grid3-row]').attr('style', '');
        $('[class^=x-grid3-header]').attr('style', '');
        $('[class^=x-grid3-header]').children().attr('style', '');
		const $homePage = $('div[id*="homepageGrid"]');
        $homePage.attr('style', '');
        //$('#ext-gen12').attr('style', '');
		$homePage.find('table[class="x-grid3-row-table"] tbody tr').each$((index, $elem) => {

			$elem.attr('style', '');

		    //flag the id, checkbox, and attachments columns to be removed
			$elem.find('.x-grid3-td-hpColHeading_0id').addClass("req_rm");
			$elem.find('.x-grid3-td-hpColHeading_0master_checkbox').addClass("req_rm");
			$elem.find('.x-grid3-td-hpColHeading_0attachments').addClass("req_rm");

			//grab the last edited value
			let $lastEditedOn = $elem.find('.x-grid3-td-hpColHeading_date');
			const lastEditedOn = $lastEditedOn.children('div:first').text();
			//$lastEditedOn.addClass("req_rm");

			//set the status icons
			const $status = $elem.find('.x-grid3-td-hpColHeading_status');
			if ($status.exists()) {
				$status.prependTo($elem);
				openTickets += $status.find(':contains("Open")').empty().addStatusIcon('ticket-group-openIcon').length;
				testingTickets += $status.find(':contains("Testing")').empty().addStatusIcon('ticket-group-testIcon').length;
				devTickets += $status.find(':contains("Development")').empty().addStatusIcon('ticket-group-devIcon').length;
				approvedTickets += $status.find(':contains("Approvals")').empty().addStatusIcon('ticket-group-appIcon').length;
				productionTickets += $status.find(':contains("Scheduled for Prod")').empty().addClass("ticket_complete").addStatusIcon('ticket-group-prodIcon').length;
				codeReviewTickets += $status.find(':contains("Code Review")').empty().addStatusIcon('ticket-group-codeIcon').length;
			}

            //set the status icons
            const $devStatus = $elem.find('.x-grid3-td-hpColHeading_Dev__bStatus');
			if($devStatus.exists()){
                if($devStatus.find(':contains("Request for Close")').exists()){
                    console.log("REQUEST FOR CLOSE");
                    $status.addClass("ticket_complete");
                }
                if($devStatus.find(':contains("Development")').exists()){
                    console.log("DEVELOPMENT");
                }
			}

			const $branch1 = $elem.find('.x-grid3-td-hpColHeading_Branch');
            const $branch2 = $elem.find('.x-grid3-td-hpColHeading_Branch__b2');
            if($branch1.find(':contains("https")').exists() || $branch2.find(':contains("https")').exists()){
            	$status.addClass("ticket_active_branch");
			}


            let class_i = $elem.find('[class*=ticket-group]')[0];

			let group_name = "";
			for(let v_class of class_i.classList.values()){
				if(v_class.toString().includes('ticket-group')){
					group_name = v_class;
				}
			}

			//add the status as an attribute to the parent row
			$elem.closest('.x-grid3-row').attr('status-group', group_name);

            //keep the status column
			$status.addClass("req_fp");

            //create the 2nd row
            const $additionalDetailsRow = $('<tr>', {'class': 'displayRow2'});
            $additionalDetailsRow.append($('<td>'));


            //id we will use with the tooltip
            let cardId = Math.floor(Math.random()*90000) + 10000;

            const $ticketNumber = $elem.find('.x-grid3-td-hpColHeading_mr');
            const $title = $elem.find('.x-grid3-td-hpColHeading_title');
			const $system = $elem.find('.x-grid3-td-hpColHeading_System');
			const $product = $elem.find('.x-grid3-td-hpColHeading_Product');
			const $department = $elem.find('.x-grid3-td-hpColHeading_Dept');
			if ($system.exists()) {
                const system = $system.children('div:first').text();
                const product = $product.children('div:first').text();
                const systemAndProduct = `${system.replace('(WrightFlood / Portal)', '').replace('(AS/400)', '').trim()} | ${product}`;

                const department = $department.children('div:first').text();
                const $ticketNumberContent = $ticketNumber.removeAttr('style').children('div:first');
                const ticketNumber = $ticketNumberContent.text();
                cardId = ticketNumber;
                $elem.closest('.x-grid3-row').attr('ticket-row-id', ticketNumber);

                let $titleElements = $title.children('div:first');
                let $titleText = $titleElements.children('a[href="#"][onclick]');
                $titleText.replaceWith($('<div/>', {class:'ticketLink', onClick:`goToDetails(${ticketNumber.match(/\d+/)},28);`})
					.append($titleText.text()));

                $system.empty().removeAttr('style').append($('<div/>',{class:'inner_s_class'}).append('#'+ticketNumber));
                $system.append($titleElements);


                const $td = $('<td/>');


				$td.append($('<div/>', {'class': 'noFmt'}).append(systemAndProduct));
				$td.append($('<div/>', {'class': 'noFmt padLeft'}).append(`Opened by ${department}`));
				//$td.append($('<div/>', {'class': 'noFmt padLeft'}).append(`[ Last Edited On: ${lastEditedOn} ]`));

				// Replace master ticket icon with name
				const $ticketType = $elem.find('.x-grid3-td-hpColHeading_0ticket_type');
				const $ticketTypeImage = $ticketType.find('img[title]');
				if ($ticketTypeImage.exists()) {
					const ticketType = $ticketTypeImage.attr('title').replace('\xa0', '');
					if (ticketType && ticketType.includes('Ticket')) {
						$td.append($('<a/>', { 'class': 'noFmt padLeft inline-ticket-link', href: `javascript:goToDetails(${ticketType.match(/\d+/)}, 28);` })
							.append(`[ ${ticketType} ]`));
                        $elem.closest('.x-grid3-row').attr('master-ticket-group', ticketType);
					}
					$ticketType.addClass("req_rm");
				}

				$additionalDetailsRow.append($td);
			}

			$additionalDetailsRow.insertAfter($elem);

			$ticketNumber.addClass("req_rm");
            $title.addClass("req_rm");
			$system.addClass("req_fp");
			$product.addClass("req_rm");
			$department.addClass("req_rm");

            //create tooltips out of any remaining colums that have
            //not been flagged to keep (.req_fp) or remove (.req_rm)
            let resCard = dataCard($elem, headerMap, cardId);

            $status.addClass('tipped');
            $status.tooltipster({
                content: resCard,
                animation: 'fade',
                delay: 200,
                theme: 'tooltipster-light',
                position: 'left'
            });

            //remove all flagged colums
            $elem.find('.req_rm').remove();
		});

		const headerInfo = [{
			iconClass: 'ticket-group-devIcon',
			text: `${devTickets} Development`
		}, {
			iconClass: 'ticket-group-codeIcon',
			text: `${codeReviewTickets} Code Review`
		}, {
			iconClass: 'ticket-group-testIcon',
			text: `${testingTickets} Testing`
		}, {
			iconClass: 'ticket-group-appIcon',
			text: `${approvedTickets} Approvals`
		}, {
			iconClass: 'ticket-group-prodIcon',
			text: `${productionTickets} Scheduled for Production`
		}, {
			iconClass: 'ticket-group-openIcon',
			text: `${openTickets} Open`
		}];

		const $headerGroup = $('<div/>', {'class': 'headerItemContainer'});
		const $headerInfoBar = $('<div/>', { 'class': 'headerInfoBar' });
		const $headerIcon = $('<div/>', { 'class': 'headerIcon' });
		const $iconText = $('<div/>', { 'class': 'iconInfo' });
		const $header = $homePage.find('div[class="x-grid3-header"] tr').empty();
		headerInfo.forEach((header) => $header.append($headerGroup.clone().on('click', function(){
		                                                    toggleShowGroup(header.iconClass, $(this));
		                                                })
											  			.append($headerIcon.clone().addStatusIcon(header.iconClass))
										      			.append($iconText.clone().append(header.text)

												))
							);

		$(this).addTags();

        let toInject = document.querySelectorAll('img.svg');
        SVGInjector(toInject);
	});



    function dataCard(row, headerMap, id){
        let card = $('<div>', {id: (id+'card'), class:'tooltip_templates'});
        let innercard = $('<div>', {class:"innerCard"});
        let others = $('td:not(.req_fp,.req_rm)', row).map(function(){
            let _div = $('div', this);
            let inner = $('<div>');
            let _text = _div.text();
            let _name = headerMap[this.cellIndex];
            let result =  _name + ": " + _text;
            innercard.append(inner.append(result));
            $(this).addClass('req_rm');
        });

        card.append(innercard);
        return card;
    }

    $.fn.addStatusIcon = function(iconClass) {
        this.addClass(iconClass).append($('<img>', {'class':'svg','src': chrome.extension.getURL(iconPathByClass(iconClass))}));
        return this;
    };


	function iconPathByClass(iconClass){
    	if(iconClass === 'ticket-group-openIcon'){ return 'svg/issue-opened.svg' }
        if(iconClass === 'ticket-group-testIcon'){ return 'svg/beaker.svg' 		 }
        if(iconClass === 'ticket-group-devIcon'){ return 'svg/git-branch.svg' 	 }
        if(iconClass === 'ticket-group-appIcon'){ return 'svg/eye.svg' 			 }
        if(iconClass === 'ticket-group-prodIcon'){ return 'svg/issue-closed.svg' }
        if(iconClass === 'ticket-group-codeIcon'){ return 'svg/code.svg' 		 }
        return 'svg/note.svg'
    };

    function toggleShowGroup(iconClass, $elem){
        $elem.toggleClass('show-tg');
        $(`div[status-group=${iconClass}]`).toggleClass('show-tg');

        $('[status-group]').not('.show-tg').hide();
        let shown = $('[status-group].show-tg').show().length;

        let selected = $('.headerItemContainer.show-tg').length;
        if(shown === 0 && selected === 0){
            $('[status-group]').show();
        }
    }

})(jQuery);

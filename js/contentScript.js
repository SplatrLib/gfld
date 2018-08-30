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

        //handle the rows
		const $homePage = $('div[id*="homepageGrid"]');
		$homePage.find('table[class="x-grid3-row-table"] tbody tr').each$((index, $elem) => {

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
				openTickets += $status.find(':contains("Open")').empty().addClass('openIcon').length;
				testingTickets += $status.find(':contains("Testing")').empty().addClass('testIcon').length;
				devTickets += $status.find(':contains("Development")').empty().addClass('devIcon').length;
				approvedTickets += $status.find(':contains("Approvals")').empty().addClass('appIcon').length;
				productionTickets += $status.find(':contains("Scheduled for Prod")').empty().addClass('prodIcon').length;
				codeReviewTickets += $status.find(':contains("Code Review")').empty().addClass('appIcon').length;
			}
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
			iconClass: 'devIcon',
			text: `${devTickets} Development`
		}, {
			iconClass: 'reviewIcon',
			text: `${codeReviewTickets} Code Review`
		}, {
			iconClass: 'testIcon',
			text: `${testingTickets} Testing`
		}, {
			iconClass: 'appIcon',
			text: `${approvedTickets} Approvals`
		}, {
			iconClass: 'prodIcon',
			text: `${productionTickets} Scheduled for Production`
		}, {
			iconClass: 'openIcon',
			text: `${openTickets} Open`
		}];

		const $headerInfoBar = $('<div/>', { 'class': 'headerInfoBar' });
		const $headerIcon = $('<div/>', { 'class': 'headerIcon' });
		const $iconText = $('<div/>', { 'class': 'iconInfo' });
		const $header = $homePage.find('div[class="x-grid3-header"] tr').empty();
		headerInfo.forEach((header) => $header.append($headerInfoBar.clone())
											  .append($headerIcon.clone().addClass(header.iconClass))
										      .append($iconText.clone().append(header.text)));
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
        });

        card.append(innercard);
        return card;
    }

    function toggleStatus(status){

	}

})(jQuery);

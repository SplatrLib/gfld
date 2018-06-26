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
		document.getElementById('splitbutton1-button').innerText = '';
		document.getElementById('grid-ct').style.fontFamily = '"Open Sans", Arial, "Lucida Grande", sans-serif !important';

		const header = document.getElementById('Header');
		header.style.width = '100%';
		header.style.backgroundColor = 'rgb(36, 41, 46) !important;';

		let openTickets = 0;
		let testingTickets = 0;
		let devTickets = 0;
		let approvedTickets = 0;
		let productionTickets = 0;
		let codeReviewTickets = 0;

		const $homePage = $('div[id*="homepageGrid"]');
		$homePage.find('table[class="x-grid3-row-table"] tbody tr').each$((index, $elem) => {
			$elem.find('.x-grid3-td-hpColHeading_0id').remove();
			$elem.find('.x-grid3-td-hpColHeading_0master_checkbox').remove();
			$elem.find('.x-grid3-td-hpColHeading_0attachments').remove();

			let $lastEditedOn = $elem.find('.x-grid3-td-hpColHeading_date');
			const lastEditedOn = $lastEditedOn.children('div:first').text();
			$lastEditedOn.remove();

			//set the status icons
			const $status = $elem.find('.x-grid3-td-hpColHeading_status');
			if ($status.exists()) {
				$status.prependTo($elem);
				openTickets += $status.find(':contains("Open")').empty().addClass('openIcon').length;
				testingTickets += $status.find(':contains("Testing")').empty().addClass('testIcon').length;
				devTickets += $status.find(':contains("Development")').empty().addClass('devIcon').length;
				approvedTickets += $status.find(':contains("Approvals")').empty().addClass('integrateIcon').length;
				productionTickets += $status.find(':contains("Scheduled for Prod")').empty().addClass('prodIcon').length;
				codeReviewTickets += $status.find(':contains("Code Review")').empty().addClass('reviewIcon').length;
			}

			// Concat system and product into one value
			const $ticketNumber = $elem.find('.x-grid3-td-hpColHeading_mr');
			const $title = $elem.find('.x-grid3-td-hpColHeading_title');
			if ($title.exists()) {
				const $ticketNumberContent = $ticketNumber.removeAttr('style').children('div:first');
				const ticketNumber = $ticketNumberContent.text();
				$ticketNumberContent.empty().removeAttr('style').append($('<div/>', { 'class': 'inner_s_class' }).append(`#${ticketNumber}`)).append($title.children('div:first'));
			}

			$title.remove();

			const $additionalDetailsRow = $('<tr>', {'class': 'displayRow2'});
			$additionalDetailsRow.append($('<td>'));

			const $system = $elem.find('.x-grid3-td-hpColHeading_System');
			const $product = $elem.find('.x-grid3-td-hpColHeading_Product');
			const $ticketType = $elem.find('.x-grid3-td-hpColHeading_0ticket_type');
			const $department = $elem.find('.x-grid3-td-hpColHeading_Dept');
			if ($system.exists()) {
				const system = $system.children('div:first').text();
				const department = $department.children('div:first').text();
				let ticketType = $ticketType.children('div:first').text();

				// Replace master ticket icon with name
				if ($ticketType.exists()) {
					const projectTitle = $('div img', $elem).attr('title');
					if (projectTitle !== undefined) {
						ticketType = projectTitle.replace('\xa0', '');
					}
				}

				const systemAndProduct = `${system.replace('(WrightFlood / Portal)', '').replace('(AS/400)', '').trim()} | ${$product.children('div:first').text()}`;

				const $td = $('<td/>');
				$td.append($('<div/>', {'class': 'noFmt'}).append(systemAndProduct));
				$td.append($('<div/>', {'class': 'noFmt padLeft'}).append(`Opened by ${department}`));
				$td.append($('<div/>', {'class': 'noFmt padLeft'}).append(`[ Last Edited On: ${lastEditedOn} ]`));

				if (ticketType !== undefined && ticketType.indexOf('Ticket') >= 0) {
					const $masterTicketLink = $('<div/>', { 'class': 'noFmt padLeft', onClick: `goToDetails(${ticketType.match(/\d+/)}, 28);`, style: 'cursor: pointer;' });
					$masterTicketLink.append(`[ ${ticketType} ]`);
					$td.append($masterTicketLink);
				}

				$additionalDetailsRow.append($td);
			}

			$additionalDetailsRow.insertAfter($elem);


			$system.remove();
			$product.remove();
			$department.remove();
			$ticketType.remove();
		});

		const headerInfo = [{
			iconClass: 'devIcon',
			text: `${devTickets} Development`
		}, {
			iconClass: 'testIcon',
			text: `${testingTickets} Testing`
		}, {
			iconClass: 'integrateIcon',
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
		headerInfo.forEach((header) => $header.append($headerInfoBar.clone()).append($headerIcon.clone().addClass(header.iconClass)).append($iconText.clone().append(header.text)));
	});
})(jQuery);

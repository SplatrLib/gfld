import {callbackMap} from "./types";

$.fn.extend({
    addItemMenu(prefix: string, menuItems: string[], handlers: callbackMap[]): any {
        let header = document.createElement('div');
        header.setAttribute('id', prefix + 'issue_header');

        let dropdown = document.createElement('div');
        dropdown.id = prefix + 'tipped_dropdown';
        let img = document.createElement('img');
        img.setAttribute('class', 'svg header_options');
        img.setAttribute('src', chrome.extension.getURL('svg/plus.svg'));

        let img2 = document.createElement('img');
        img2.setAttribute('class', 'svg header_options');
        img2.setAttribute('src', chrome.extension.getURL('svg/chevron-down.svg'));

        dropdown.appendChild(img);
        dropdown.appendChild(img2);

        header.appendChild(dropdown);
        this.append(header);

        let issue_menu = document.createElement('div');
        issue_menu.id = 'issue_menu';


        let options = document.createElement('div');
        options.id = prefix + 'issue_dropdown';

        dropdown.setAttribute('class', 'tipped headerDropDown');

        for (let opt of menuItems) {
            let op = document.createElement("div");
            op.id = 'goption_' + opt;
            op.setAttribute('class', 'header_option');
            op.innerText = opt;
            let cb = handlers.find(i => i.item == opt);
            op.addEventListener('click', cb.callback);
            options.appendChild(op);
        }

        issue_menu.appendChild(options);

        let $dropdown = $(dropdown);

        $dropdown.tooltipster({
            content: $(issue_menu),
            animation: 'fade',
            delay: 2,
            theme: 'tooltipster-shadow',
            position: 'bottom',
            trigger: 'click',
            interactive: true,
            debug: true
        });

        return this;
    }
});

/**************************
 * dont edit .js file directly
***************************/

interface Issue {
    id: number;
    message: string;
    group?: string;
    color?: string;
}

interface UserIssues{
    issues: Issue[]
}

let local_container;

let user_issues: UserIssues = {
    issues: Array()
};

let display_mode: string = "grouped";



getIssues();

function addIssue(lid, lmsg, grp?){
    let i: Issue = {id: lid, message: lmsg, group: grp};

    user_issues.issues.push(i);

    saveIssues(user_issues);
}

function saveIssues(issues: UserIssues) {
    chrome.storage.sync.set({user_definied_issues: issues.issues}, function() {
        reloadIssues();
    });
}

function getIssues(){
    chrome.storage.sync.get(['user_definied_issues'], function(result) {
        console.log('Value currently is ');
        console.log(result);
        user_issues.issues = result.user_definied_issues;
        console.log(user_issues);
        console.log(user_issues.issues);
        showIssues();
    })
}

function addIssueHeader(){
    let header = document.createElement('div');
    header.setAttribute('id', 'issue_header');

    let dropdown = document.createElement('div');
    dropdown.id = 'tipped_dropdown';
    let img = document.createElement('img');
    img.setAttribute('class', 'svg header_options');
    img.setAttribute('src', chrome.extension.getURL('svg/plus.svg'));

    let img2 = document.createElement('img');
    img2.setAttribute('class', 'svg header_options');
    img2.setAttribute('src', chrome.extension.getURL('svg/chevron-down.svg'));


    SVGInjector(img);
    SVGInjector(img2);

    let arrow = document.createElement('span');
    arrow.setAttribute('class', 'dropdown-caret');
    arrow.setAttribute('style', 'margin-top: 8px;');

    dropdown.appendChild(img);
    dropdown.appendChild(img2);

    header.appendChild(dropdown);
    local_container.appendChild(header);

    let issue_menu = document.createElement('div');
    issue_menu.id = 'issue_menu';


    let options = document.createElement('div');
    options.id = 'issue_dropdown';

    //dropdown.appendChild(issue_menu);
    dropdown.setAttribute('class', 'tipped headerDropDown');
    let issue_options: string[] = Array("add", "remove", "group", "reset", "hide", "show");
    for(let opt of issue_options){
        let op = document.createElement("div");
        op.id = 'option_' + opt;
        op.setAttribute('class', 'header_option');
        op.innerText = opt;
        options.appendChild(op);
    }

    addOptionCallbacks(options);

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

}

function addOptionCallbacks(options){
    console.log("adding callbacks for");
    console.log(options);

    let $items = $(options);

    let $add = $items.find('#option_add');
    let $remove = $items.find("#option_remove");
    let $reset = $items.find('#option_reset');
    let $group = $items.find('#option_group');
    let $hide = $items.find('#option_hide');
    let $show = $items.find('#option_show');

    $add.on('click', showPrompt);

    $remove.on('click', removeSelected);

    $reset.on('click', function(){
        display_mode = "list";
        sortReset();
    });

    $group.on('click', function(){
        display_mode = "grouped";
        groupIssues();
    });

    $hide.on('click', function(e){
        //e.preventDefault();
        console.log("hide callback");
        $('#issues_container').hide();
        $('#tipped_dropdown').tooltipster('close');
    });

    $show.on('click', function(e){
        //e.preventDefault();
        console.log("show callback");
        $('#issues_container').show();
        $('#tipped_dropdown').tooltipster('close');
    });
}

function removeSelected(){
    console.log("'remove' option callback");
    $('#tipped_dropdown').tooltipster('close');

    var selectedElements = local_container.getElementsByClassName('selected');
    var removed = Array.prototype.filter.call(selectedElements, function(testElement){
        let _i : Issue = JSON.parse(testElement.getAttribute('data'));
        removeIssue(_i);
    });

    console.log(user_issues);
    saveIssues(user_issues);
}

function removeIssue(issue: Issue){
    let _index : number = NaN;

    user_issues.issues.forEach((item, index) => {
        if(issuesEqual(item, issue)){ _index = index;}
    });

    user_issues.issues.splice(_index, 1);
}

function issuesEqual(source: Issue, target: Issue) : boolean {
    return source.id == target.id && source.message == target.message && source.group == target.group;
}


function showPrompt(e) {
    console.log("'show' option callback");
    $('#tipped_dropdown').tooltipster('close');

    let container = document.createElement('div');
    container.className = "issue_add";

    let form = document.createElement('div');

    let msg = document.createElement('input');
    msg.className = 'issue_add_msg';
    msg.placeholder = 'issue text';

    let ticket = document.createElement('input');
    ticket.className = 'issue_add_tid';
    ticket.placeholder = 'cm:id';


    let button = document.createElement('div');
    button.className = 'issue_add_btn';
    button.innerText = 'add';


    let bimg = document.createElement('img');
    bimg.setAttribute('class', 'svg');
    bimg.setAttribute('data-src', chrome.extension.getURL('svg/plus.svg'));
    //SVGInjector(bimg);
    //button.appendChild(bimg);


    form.appendChild(ticket);
    form.appendChild(msg);
    form.appendChild(button);
    container.appendChild(form);

    $(local_container).tooltipster({
        content: $(container),
        animation: 'fade',
        delay: 2,
        theme: 'tooltipster-shadow',
        interactive: true,
        //contentCloning: true,
        side: 'left',
        trigger: 'custom'
    });

    $(local_container).tooltipster('open');

    $(button).on('click', function(){
        submitAdd(ticket.value, msg.value);
    });
}

function submitAdd(tid: string, msg: string){
    console.log("submitted");
    $(local_container).tooltipster('close');
    console.log("tid: ", tid);
    console.log("msg: ", msg);

    let _ticket = parseInt(tid);
    if(isNaN(_ticket)){
        //console.log("is nan");
        addIssue(0, msg, tid);
    }else{
        //console.log("is number");
        addIssue(_ticket, msg);
    }

    reloadIssues();
}

function reloadIssues(){
    console.log("reload issues");
    let elem = document.querySelector('#issues_container');
    elem.parentNode.removeChild(elem);

    let issues_container = document.createElement('div');
    issues_container.id ='issues_container';

    local_container.appendChild(issues_container);

    renderIssues(issues_container);
}

function renderIssues(issues_container){
    console.log("render issues");
    let _issues = user_issues.issues;

    for(let issue of _issues){
        let row = document.createElement('div');
        row.setAttribute('class', 'issue_row');

        let msg = document.createElement('span');
        msg.setAttribute('class', 'issue_message');
        msg.textContent = issue.message;

        let tid = document.createElement('span');
        tid.setAttribute('class', 'issue_ticket_number');
        tid.textContent = (issue.id == 0 ? '' : issue.id) + (issue.group == undefined ? '' : issue.group);

        let icon = document.createElement('div');
        icon.setAttribute('class', 'issue_icon');
        let img = document.createElement('img');
        img.setAttribute('class', 'svg');
        img.setAttribute('src', chrome.extension.getURL('svg/dash.svg'));

        icon.appendChild(img);

        row.appendChild(icon);
        row.appendChild(tid);
        row.appendChild(msg);

        row.setAttribute('data', JSON.stringify(issue));

        row.addEventListener('click', function(e){
            if($(this).hasClass("selected")){
                $(this).removeClass("selected");
            }else{
                $(this).addClass("selected");
            }
        });

        issues_container.appendChild(row);
    }


    sortReset();
}

function showIssues(){
    local_container = document.createElement('div');
    local_container.id = 'local_issues_container';

    let issues_container = document.createElement('div');
    issues_container.id ='issues_container';
    issues_container.setAttribute('class','issues_fixed');

    local_container.appendChild(issues_container);

    addIssueHeader();
    console.log("current issues");

    renderIssues(issues_container);

    document.body.appendChild(local_container);

    let mySVGsToInject = document.querySelectorAll('img.svg');

    // Do the injection
    SVGInjector(mySVGsToInject);

    sortReset();

}

function sortReset(){
    console.log("list reset");
    $('#tipped_dropdown').tooltipster('close');
    let $issues_container = $('#issues_container');
    let $issues_row = $('.issue_row');

    $('.group_header').hide();
    $('.grouped').removeClass('grouped');

    // @ts-ignore
    let sorted = $issues_row.sort(function(a,b){
        let av = $(a).find("span.issue_ticket_number").text();
        let bv = $(b).find("span.issue_ticket_number").text();
        let r = av.localeCompare(bv);
        return r;
    });

    console.log(sorted);

    $issues_container.html(sorted);



    if(display_mode === "grouped"){groupIssues();}
}

function groupIssues(){
    console.log("grouping");
    $('#tipped_dropdown').tooltipster('close');
    let $issues_container = $('#issues_container');
    let $issues_row = $('.issue_row');



    $issues_row.each(function(){
        let group = $(this).find("span.issue_ticket_number").text();

        let $groupContainer = $(local_container).find('div.group_'+group);
        if(!$groupContainer.length){
            $groupContainer = $('<div>', {'class': 'issue_group_container group_'+group}).appendTo($issues_container);
            $('<div>', {'class': 'group_header'}).text(group).appendTo($groupContainer);
        }

        $('.group_header').show();
        $groupContainer.append($(this));

        $(this).children().addClass('grouped');
    });
}

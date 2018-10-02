
import {callbackMap} from "./types";


interface Issue {
    id: number;
    message: string;
    group?: string;
    color?: string;
    position?: number;
}

/*
interface UserIssues{
    issues: Issue[]
}
*/

let local_container;

/*
let user_issues: UserIssues = {
    issues: Array()
};
*/

let local_user_issues: Issue[];

let display_mode: string = "grouped";

let optionCallbacks : callbackMap[] = [
    {item: 'add', callback: showPrompt},
    {item: 'remove', callback: removeSelected},
    {item: 'reset', callback: sortReset},
    {item: 'group', callback: groupIssues},
    {item: 'hide', callback: hideIssues},
    {item: 'show', callback: unhideIssues}
];



getIssues();

function addIssue(lid, lmsg, grp?){
    let i: Issue = {id: lid, message: lmsg, group: grp};
    if(local_user_issues == undefined){
        console.log('local_user_issues temp');
        local_user_issues = [i];
    }else{
        console.log('local_user_issues not empty');
        local_user_issues.push(i);
    }



    saveIssues(local_user_issues);
}

function saveIssues(issues: Issue[]) {
    chrome.storage.sync.set({user_definied_issues: issues}, function() {
        reloadIssues();
    });
}

function getIssues(){

    chrome.storage.sync.get(['user_definied_issues'], function(result) {
        local_user_issues = result.user_definied_issues;
        showIssues();
    })
}

function removeSelected(){
    $('#tipped_dropdown').tooltipster('close');

    var selectedElements = local_container.getElementsByClassName('selected');
    var removed = Array.prototype.filter.call(selectedElements, function(testElement){
        let _i : Issue = JSON.parse(testElement.getAttribute('data'));
        removeIssue(_i);
    });
    saveIssues(local_user_issues);
}

function removeIssue(issue: Issue){
    let _index : number = NaN;

    local_user_issues.forEach((item, index) => {
        if(issuesEqual(item, issue)){ _index = index;}
    });

    local_user_issues.splice(_index, 1);
}

function issuesEqual(source: Issue, target: Issue) : boolean {
    return source.id == target.id && source.message == target.message && source.group == target.group;
}


function showPrompt(e) {
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
    $(local_container).tooltipster('close');

    let _ticket = parseInt(tid);
    if(isNaN(_ticket)){
        addIssue(0, msg, tid);
    }else{
        addIssue(_ticket, msg);
    }

    reloadIssues();
}

function reloadIssues(){
    let elem = document.querySelector('#issues_container');
    elem.parentNode.removeChild(elem);

    let issues_container = document.createElement('div');
    issues_container.id ='issues_container';

    local_container.appendChild(issues_container);

    if(local_user_issues != undefined){
        renderIssues(issues_container);
    }
}

function renderIssues(issues_container){
    let _issues = local_user_issues;

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

    let menuPrefix = '';
    let menuTarget = $(local_container);
    let issue_options: string[] = Array("add", "remove", "group", "reset", "hide", "show");

    // @ts-ignore
    menuTarget.addItemMenu(menuPrefix, issue_options, optionCallbacks);


    if(local_user_issues != undefined){
        renderIssues(issues_container);
    }


    document.body.appendChild(local_container);

    let mySVGsToInject = document.querySelectorAll('img.svg');

    // @ts-ignore
    SVGInjector(mySVGsToInject);

    sortReset();
}

function sortReset(){
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

    $issues_container.html(sorted);

    if(display_mode === "grouped"){groupIssues();}
}

function hideIssues(){
    $('#issues_container').hide();
    $('#tipped_dropdown').tooltipster('close');
}

function unhideIssues(){
    $('#issues_container').show();
    $('#tipped_dropdown').tooltipster('close');
}

function groupIssues(){
    display_mode = "grouped";
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

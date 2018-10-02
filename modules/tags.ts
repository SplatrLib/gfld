interface JQuery {
    addTag($elem : JQuery, tag : UserTag): JQuery;
    addTags() : JQuery;
}

enum TagGroup{svnrepo, vendors, lifecycle, mine, ticketStatus}

interface UserTag{
    id: number;
    label: string;
    color?: string;
    textColor?: string;
    border?: string;
    group?: TagGroup;
}

interface TagMap{
    ticket_id: number;
    tag: UserTag;
}


let local_tag_map: TagMap[];


let tagMenuOptionList = ['tags', 'manage'];

let tagOptionCallbacks = [
    {item: 'tags', callback: toggleTagDisplay},
    {item: 'manage', callback: manageTags}
];

const $tagTemplate = $('<div/>', { 'class': 'IssueLabel' });
const $spaceTemplate = $('<div/>', { 'class': 'IssueLabelSpace' });

let CLICKEDTAGID : number;
let CLICKEDTICKETID : string;


let xuser_tags: UserTag[];
let user_tags: UserTag[] = [
    {id: 0, label: 'process one', color: '#a577a4', textColor: '#00263e', group:TagGroup.vendors},
    {id: 3, label: 'logMeIn', color: '#0d2244', textColor: '#ffffff', group:TagGroup.vendors},
    {id: 5, label: 'genesys', color: '#AF244B', textColor: '#ffffff', group:TagGroup.vendors},
    {id: 10, label: 'image keeper', color: '#5e445a', textColor: '#ffffff', group:TagGroup.vendors},

    {id: 1, label: 'rlovr', color: '#bfe5bf', textColor: '#000000', group: TagGroup.mine},
    {id: 2, label: 'paryl', color: '#bfd4f2', textColor: '#000000', group: TagGroup.mine},

    {id: 6, label: 'accounting nonsense', color: '#f38605', textColor: '#000000'},
    {id: 7, label: 'priority', color: '#effc10', textColor: '#000000'},
    {id: 8, label: 'tower hill', color: '#7eefd9', textColor: '#000000'},
    {id: 4, label: 'it/maint', textColor: '#d5dfe5'},

    {id: 9, label: 'needs triage', color: '#94ff00', textColor: '#000000', group: TagGroup.ticketStatus},
    {id: 11, label: 'monitor and close', color: '#eeefec', textColor: '#24292e', group: TagGroup.ticketStatus},
    {id: 15, label: 'waiting on feedback', color: '#eeefec', textColor: '#24292e', group: TagGroup.ticketStatus},

    {id: 13, label: 'dazin', color: '#cad6dd', group:TagGroup.svnrepo},
    {id: 14, label: 'gavin', color: '#cad6dd',group:TagGroup.svnrepo},
    {id: 16, label: 'floodRS', color: '#cad6dd',  group:TagGroup.svnrepo},
    {id: 17, label: 'floodWS', color: '#cad6dd', group:TagGroup.svnrepo},
    {id: 18, label: 'tyde', color: '#cad6dd', group:TagGroup.svnrepo},
    {id: 12, label: 'joomla', color: '#643eab',  group:TagGroup.svnrepo},
];

getTags();

function saveTagMap() {
    chrome.storage.sync.set({localTagMap: local_tag_map}, function() {
        reloadTagMap();
    });
}

function getTagMap(){
    chrome.storage.sync.get(['localTagMap'], function(result) {
        local_tag_map = result.localTagMap;
        console.log(result);
        console.log(local_tag_map);
        if(local_tag_map  == undefined){
            local_tag_map = [
                {tag: null, ticket_id: 0}
            ];
            saveTagMap();
        }

    })
}

function reloadTagMap() {

}

function saveTags() {
    chrome.storage.sync.set({userTags: user_tags}, function() {
        //getTags();
    });
}

function getTags(){
    console.log(user_tags);
    if(user_tags == undefined) {
        chrome.storage.sync.get(['userTags'], function (result) {
            user_tags = result.userTags;
            console.log(result);
            console.log(user_tags);
            createTagContextMenu();
            getTagMap();
        })
    }else{
        saveTags();
        createTagContextMenu();
        getTagMap();
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "TagClickHandler") {
        let contextItemId = message.clickedItemId;
        let contextItemParent = message.clickedParentId;
        console.log('context script callback for ', contextItemId, ', child of ', contextItemParent);

        if(contextItemId === 'localTagsRemove'){
            removeCurrentTag();
        }
        if(contextItemParent === 'localTagsAdd'){
            addTagClickHandler(contextItemId);
        }
    }
});

function removeCurrentTag(){
    console.log("remove current tag callback");
    let _index : number = NaN;
    local_tag_map.forEach((item, index) =>{
        if(item.ticket_id == +CLICKEDTICKETID && item.tag.id == CLICKEDTAGID){
            console.log('found ', item);
            _index = index;
            let $ticket = $('.x-grid3-row').filter(`[ticket-row-id="${CLICKEDTICKETID}"]`).first();
            let $tags = $ticket.children().filter('.tag_container');
            let _l = item.tag.label;
            let labels = $tags.children().filter('.IssueLabel');
            let founds = labels.filter(`:contains("${_l}")`);
                founds.remove();
        }
    });

    local_tag_map.splice(_index, 1);
    saveTagMap();
}

function addTagClickHandler(selectedTag) {
    console.log("SOMETHING was clicked");
    console.log('tag id: ', CLICKEDTAGID, ',ticket id: ', CLICKEDTICKETID, ', selected tag: ', selectedTag);

    let $ticket = $('.x-grid3-row').filter(`[ticket-row-id="${CLICKEDTICKETID}"]`).first();
    let tagid= selectedTag.substring(selectedTag.indexOf('-')+1, selectedTag.length);

    console.log('parsed tag id: ', tagid);
    console.log('found this ticket: ', $ticket);
    let _tag;
    user_tags.forEach((item, index) =>{
        if(item.id == tagid){
            console.log('found ', item);
            _tag = user_tags[index];
        }
    });
    console.log('using this tag: ', user_tags[_tag]);

    let $tags = $ticket.children().filter('.tag_container');
    if($tags.find(':contains("needs triage")').length){
        $tags.empty();
    }
    $tags.addTag($ticket, _tag);
    local_tag_map.push({ticket_id: +CLICKEDTICKETID, tag: _tag});
    saveTagMap();
}

function createTagContextMenu(){
    chrome.runtime.sendMessage({message: "hi"}, (response) => {
        console.log(response.message);


    });

    let requestData = {
        action: "createContextMenuItem",
        contextItemProperties: {
            id: "localTagsAdd",
            title: "add tag"
        }};

    chrome.runtime.sendMessage({message: JSON.stringify(requestData)}, (response) => {console.log(response.message)});

    requestData = {
        action: "createContextMenuItem",
        contextItemProperties: {
            id: "localTagsRemove",
            title: "remove tag"
        }};

    chrome.runtime.sendMessage({message: JSON.stringify(requestData)}, (response) => {console.log(response.message)});

    for(let _tag of user_tags){
        let tagData = {
            action: "createContextMenuItem",
            contextItemProperties: {
                id: `contextTag-${_tag.id}`,
                parentId: "localTagsAdd",
                title: _tag.label
            }};

        chrome.runtime.sendMessage({message: JSON.stringify(tagData)}, (response) => {console.log(response.message)});
    }
}


$.fn.addTags = function() {
    let rows = $('[ticket-row-id]');
    rows.each(function () {
        $(this).on('contextmenu', function(){
            CLICKEDTICKETID = $(this).attr('ticket-row-id');
            console.log('ticket context! ', CLICKEDTICKETID);
        });

        let $tags = findTagsByTicket($(this));
        if($tags.children().length == 0){
            console.log("needs triage");

            $tags.addTag($(this), user_tags[9]);
        }
        $(this).closest('.x-grid3-row').append($tags);
    });

    let tagMenuPrefix = 't';
    let tagMenuTarget = $('.x-grid3-header-inner');
    // @ts-ignore
    tagMenuTarget.addItemMenu(tagMenuPrefix, tagMenuOptionList, tagOptionCallbacks);
    $('#ttipped_dropdown').children().addClass('dark');

    return this;
};



$.fn.addTag = function($elem, tag : UserTag) : JQuery{
    let tagattr = $elem.closest('.x-grid3-row').attr('ticket-tags');
    let ticketidattr = $elem.closest('.x-grid3-row').attr('ticket-row-id');
    if(tagattr != undefined){
        $elem.closest('.x-grid3-row').attr('ticket-tags', tagattr + ' ' + tag.id);
    }else{
        $elem.closest('.x-grid3-row').attr('ticket-tags', tag.id);
    }

    let $newTag = $tagTemplate.clone().append(tag.label);
    $newTag.attr('tag-id', tag.id);
    if(tag.textColor != undefined){
        $newTag.css('color', tag.textColor);
    }
    if(tag.border != undefined){
        $newTag.css('border-style', 'solid');
        $newTag.css('border-color', tag.border);
    }
    if(tag.color != undefined){
        $newTag.css('background-color', tag.color);
        //$newTag.css('box-shadow', 'inset 0 -1px 0 rgba(27,31,35,0.12)');
    }
    $newTag.on('click', function(){
        let msgData = {
            action: "seachHandler",
            tag: tag.id,
            status: "show"
        };
        chrome.runtime.sendMessage({message: JSON.stringify(msgData)}, (response) => {
            console.log(response.message);
            applyTagFilter(response.message.tag, response.message.status);
        });

        toggleShowGroup(tag.id);
    });
    $newTag.on('contextmenu', function(){
        CLICKEDTAGID = tag.id;
        CLICKEDTICKETID = ticketidattr;
    });
    this.append($newTag);
    this.append($spaceTemplate.clone());

    return this;
};


function findTagsByTicket($elem) : JQuery{
    let $container = $('<div/>', { 'class': 'tag_container' });
    let ticket_id = $elem.attr('ticket-row-id');
    if(local_tag_map != undefined){
        for(let tags of local_tag_map){
            if(tags.ticket_id == ticket_id){
                let _tag;
                user_tags.forEach((item, index) =>{
                    if(item.id == tags.tag.id){
                        _tag = user_tags[index];
                    }
                });
                $container.addTag($elem, _tag);
            }
        }
    }

    return $container;
}

function toggleShowGroup(tagid){
    $(`div[ticket-tags*=${tagid}]`).toggleClass('show-tg');

    $('[ticket-tags]').not('.show-tg').hide();
    let shown = $('[ticket-tags].show-tg').show().length;

    let selected = $('.headerItemContainer.show-tg').length;
    if(shown === 0 && selected === 0){
        $('[ticket-tags]').show();
    }
}

function applyTagFilter(tagid, status){
    console.log("applyTagFilter callback in tags.ts");
}

function toggleTagDisplay(){
    $('#ttipped_dropdown').tooltipster('close');
    $('.tag_container').toggle();
}

function manageTags(){
    $('#ttipped_dropdown').tooltipster('close');
    console.log("callback for tag management");
}

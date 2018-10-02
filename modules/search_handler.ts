chrome.runtime.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "seachHandler") {
        if(message.searchType == 'tag'){
            tagFilter(message.tagId, message.state);
        }

        if(message.searchType == 'status'){
            statusFilter(message.statusName, message.state);
        }
    }
});

function tagFilter(tagId, state){
    console.log("searchHander tagFilter callback");
}

function statusFilter(status, state){
    console.log("searchHander statusFilter callback");
}

//create the search div at the top of the page
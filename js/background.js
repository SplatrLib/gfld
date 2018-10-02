chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Sample Context Menu",
        "contexts": ["page","selection","link","editable","image","video", "audio"]
    });
});

//subscribe on request from content.js:

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        let fullMessage = JSON.parse(request.message);
        if( fullMessage.action === "createContextMenuItem") {
            chrome.contextMenus.create(fullMessage.contextItemProperties);
            sendResponse({message: "context request recived"});
        }

        if( fullMessage.action === "seachHandler") {
            sendResponse({message: fullMessage});
        }
    });

chrome.contextMenus.onClicked.addListener(genericOnClick);


function genericOnClick(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));

    //Add all you functional Logic here

    chrome.tabs.sendMessage(tab.id, {
            functiontoInvoke: "TagClickHandler",
            clickedItemId: info.menuItemId,
            clickedParentId: info.parentMenuItemId
        });
}

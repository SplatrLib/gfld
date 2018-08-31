
    var user_issues = [];
    user_issues = getIssues();
    testIssues();
    showIssues();

    function testIssues(){

        addIssue(10499, "message text one");
        addIssue(10499, "message text two");
        console.log(user_issues);
    }

    function addIssue(tid, tmsg){
        let task = {
            ticketId: tid,
            message: tmsg
        };

        user_issues.push(task);

        saveIssues(user_issues);
    }


    function getIssues(){
        let local = chrome.storage.sync.get(['user_issues'], function(result) {
            console.log('Value currently is ' + result.key);
        });

        if(local === 'undefined'){local = []}

        return local;
    }

    function saveIssues(value){
        chrome.storage.sync.set({local_issues: value}, function() {
            console.log('Value is set to ' + value);
        });
    }

    function showIssues(){
        //let container = $('<div/>', {id:'local_issues_container'});

        for(var issue in user_issues){
            console.log(issue);
        }
    }

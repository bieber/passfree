var locked = true;
chrome.browserAction.onClicked.addListener(
    function () {
        locked = !locked;
        var path = locked ?
            {19: 'img/lock_19.png', 38: 'img/lock_38.png'} :
            {19: 'img/unlock_19.png', 38: 'img/unlock_38.png'};
        chrome.browserAction.setIcon(
            {path: path}
        );
    }
);

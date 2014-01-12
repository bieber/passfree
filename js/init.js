chrome.browserAction.onClicked.addListener(
    function (tab) {
        locked = !locked;
        var path = locked ? LOCKED_ICONS : UNLOCKED_ICONS;
        chrome.browserAction.setIcon({path: path});
        console.log(tab);
    }
);

chrome.contextMenus.create({
    title: 'Pass Free',
    id: ROOT_MENU_ID
});
chrome.contextMenus.onClicked.addListener(
    function (info, tab) {
        console.log(info, tab);
    }
);

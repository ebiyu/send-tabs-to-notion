chrome.browserAction.onClicked.addListener(() => {
    //chrome.tabs.create({ url: "https://www.google.com" });
    chrome.tabs.query({ lastFocusedWindow: true }, function (tabs) {
        console.log(tabs);
    });
});


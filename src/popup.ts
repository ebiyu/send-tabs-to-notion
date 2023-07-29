console.log('popup.ts')

document.getElementById("sendAllTabs")!.addEventListener("click", () => {
    chrome.runtime.sendMessage({}, function (response) {
        if (response.success) {
            window.close();
        } else {
            window.alert("Failed to send all tabs");
            window.close();
        }
    })
});



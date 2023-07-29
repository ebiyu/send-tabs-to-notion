import browser from "webextension-polyfill";

console.log("popup.ts");

document.getElementById("sendAllTabs")!.addEventListener("click", () => {
    (async () => {
        const res = await browser.runtime.sendMessage({});
        if (res.success) {
            window.close();
        } else {
            window.alert("Failed to send all tabs");
            window.close();
        }
    })();
});

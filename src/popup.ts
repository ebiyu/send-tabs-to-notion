import browser from "webextension-polyfill";

console.log("popup.ts");

const spinnerBg = document.getElementById("spinnerBg")!;

document.getElementById("sendAllTabs")!.addEventListener("click", () => {
    spinnerBg.style.display = "flex";
    (async () => {
        // check storage
        const { note, token } = await browser.storage.local.get([
            "note",
            "token",
        ]);
        if (!token) {
            const newToken = window.prompt("Please input your token");
            if (!newToken) {
                window.alert("Please input your token");
                return;
            }
            await browser.storage.local.set({ token: newToken });
        }
        if (!note) {
            const url = window.prompt("Please input url of your note");
            if (!url) {
                window.alert("Please input url");
                return;
            }
            const re = /.*\/.*-([a-f0-9]+)$/;
            const m = url.match(re);
            if (!m) {
                window.alert("Invalid url");
                return;
            }
            const noteId = m[1];
            await browser.storage.local.set({ note: noteId });
        }

        const res = await browser.runtime.sendMessage({});
        if (!res.success) {
            window.alert("Failed to send all tabs");
        }
    })().finally(() => {
        window.close();
    });
});

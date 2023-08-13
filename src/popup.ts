import browser from 'webextension-polyfill';

console.log('popup.ts');

const spinnerBg = document.getElementById('spinnerBg')!;

document.getElementById('sendAllTabs')!.addEventListener('click', () => {
  spinnerBg.style.display = 'flex';
  (async () => {
    // check storage
    const { note, token } = await browser.storage.local.get(['note', 'token']);
    if (!token || !note) {
        alert('Please set token and note id in options page');
        chrome.tabs.create({
            url: 'chrome-extension://' + chrome.runtime.id + '/options.html',
        });
        return;
    }

    const res = await browser.runtime.sendMessage({});
    if (!res.success) {
      window.alert('Failed to send all tabs');
    }
  })().finally(() => {
    window.close();
  });
});

document.getElementById('openOptions')!.addEventListener('click', () => {
  chrome.tabs.create({
    url: 'chrome-extension://' + chrome.runtime.id + '/options.html',
  });
});

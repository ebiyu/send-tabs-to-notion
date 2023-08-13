import browser from 'webextension-polyfill';

window.addEventListener('load', async () => {
  const pageUrlInput = document.getElementById(
    'pageUrlInput',
  ) as HTMLInputElement;
  const apiTokenInput = document.getElementById(
    'apiTokenInput',
  ) as HTMLInputElement;
  const saveButton = document.getElementById('saveButton') as HTMLButtonElement;

  const { note, token } = await browser.storage.local.get(['note', 'token']);
  pageUrlInput.value = note || '';
  apiTokenInput.value = token || '';

  saveButton.addEventListener('click', async () => {
    const newNote = pageUrlInput.value;
    const newToken = apiTokenInput.value;

    if (!newToken) {
      window.alert('Please input your token');
      return;
    }

    if (!newNote) {
      window.alert('Please input url');
      return;
    }
    const re = /^.*\/(.*-)?([a-f0-9]+)$/;
    const re2 = /^([a-f0-9]+)$/;
    const m = newNote.match(re);
    const m2 = newNote.match(re2);
    if (!m && !m2) {
      window.alert('Invalid url');
      return;
    }
    const noteId = m ? m[2] : newNote;

    // save
    await browser.storage.local.set({ token: newToken });
    await browser.storage.local.set({ note: noteId });

    window.alert('Saved');
    location.reload();
  });
});

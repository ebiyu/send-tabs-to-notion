import browser from 'webextension-polyfill';
import base64js from 'base64-js';

const CLIENT_ID = '210df544-a3b1-4cf2-b385-e3c66bf67901';
const CLIENT_SECRET = 'secret_ObxhkhhYVhTRX09XSeqKUxYbzwN9YUVQcebZUfagNoc';

window.addEventListener('load', async () => {
  const pageUrlInput = document.getElementById(
    'pageUrlInput',
  ) as HTMLInputElement;
  const saveButton = document.getElementById('saveButton') as HTMLButtonElement;
  const loginButton = document.getElementById(
    'loginButton',
  ) as HTMLButtonElement;
  const loggedOutSection = document.getElementById(
    'loggedOutSection',
  ) as HTMLDivElement;
  const loggedInSection = document.getElementById(
    'loggedInSection',
  ) as HTMLDivElement;

  const { note, token } = await browser.storage.local.get(['note', 'token']);
  pageUrlInput.value = note || '';

  loginButton.addEventListener('click', () => {
    (async () => {
      loginButton.disabled = true;
      const res = await browser.identity.launchWebAuthFlow({
        url: `https://api.notion.com/v1/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&owner=user&redirect_uri=https%3A%2F%2Flhkfhmklgajeonglhhdoahpikmkbpncp.chromiumapp.org`,
        interactive: true,
      });

      const url = new URL(res);
      const code = url.searchParams.get('code');

      const basic = `${CLIENT_ID}:${CLIENT_SECRET}`;
      const encoded = base64js.fromByteArray(new TextEncoder().encode(basic));

      const res2 = await fetch('https://api.notion.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${encoded}`,
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri:
            'https://lhkfhmklgajeonglhhdoahpikmkbpncp.chromiumapp.org',
        }),
      });
      const token = (await res2.json())['access_token'];
      await browser.storage.local.set({ token });
      window.alert('Log in success');
      location.reload();
    })().catch((e) => {
      window.alert('Log in failed');
      console.error(e);
      loginButton.disabled = false;
    });
  });

  saveButton.addEventListener('click', async () => {
    const newNote = pageUrlInput.value;

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
    await browser.storage.local.set({ note: noteId });

    window.alert('Saved');
    location.reload();
  });

  if (token) {
    loggedInSection.classList.remove('d-none');
  } else {
    loggedOutSection.classList.remove('d-none');
  }
});

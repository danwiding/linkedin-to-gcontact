import { pickDisplayName } from './pickDisplayName.js';

async function initSidePanel() {
  let info = { title: '', hostname: '', author: '', site_name: '' };
  try {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const tab = tabs && tabs[0];
    if (tab && tab.id) {
      info.title = tab.title || '';
      try {
        const u = new URL(tab.url || '');
        info.hostname = u.hostname || '';
      } catch {
        info.hostname = '';
      }
      const fromContent = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_INFO' }).catch(() => null);
      if (fromContent) {
        info = { ...info, ...fromContent };
      }
    }
  } catch (e) {
    // Silent; keep defaults
  }

  const displayEl = document.getElementById('page-display-name');
  const titleEl = document.getElementById('page-title');
  const hostEl = document.getElementById('page-host');
  const authorEl = document.getElementById('page-author');
  const siteNameEl = document.getElementById('page-site_name');

  displayEl.textContent = pickDisplayName(info);
  titleEl.textContent = info.title || '(unknown)';
  hostEl.textContent = info.hostname || '(unknown)';
  authorEl.textContent = info.author || '(n/a)';
  siteNameEl.textContent = info.site_name || '(n/a)';
}

initSidePanel();

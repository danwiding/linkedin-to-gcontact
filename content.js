// Inline detection and message strings to keep content script classic (non-module)
function isLinkedInProfile(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const isLinkedInHost = host === 'linkedin.com' || host.endsWith('.linkedin.com');
    const path = u.pathname;
    if (isLinkedInHost && path.startsWith('/in/')) return true;
    return false;
  } catch {
    if (typeof url === 'string') {
      const lower = url.toLowerCase();
      return lower.includes('linkedin.com') && lower.includes('/in/');
    }
    return false;
  }
}

const MSG = {
  REFRESH_PANEL: 'REFRESH_PANEL',
  GET_PAGE_INFO: 'GET_PAGE_INFO',
  IS_LINKEDIN_PROFILE: 'IS_LINKEDIN_PROFILE',
  GET_LINKEDIN_NAME: 'GET_LINKEDIN_NAME',
};

// Content script: responds with page info and detection when requested
(function() {
  function getMetaContentByName(name) {
    const meta = document.querySelector(`meta[name="${name}"]`);
    return meta ? meta.getAttribute('content') || '' : '';
  }

  function getMetaContentByProperty(prop) {
    const meta = document.querySelector(`meta[property="${prop}"]`);
    return meta ? meta.getAttribute('content') || '' : '';
  }

  function collectPageInfo() {
    const title = document.title || '';
    const hostname = location.hostname || '';
    const author = getMetaContentByName('author');
    const siteName = getMetaContentByProperty('og:site_name') || getMetaContentByName('application-name');
    const isLinkedIn = isLinkedInProfile(location.href || '');
    return { title, hostname, author, site_name: siteName, is_linkedin_profile: isLinkedIn };
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === MSG.GET_PAGE_INFO) {
      sendResponse(collectPageInfo());
      // Indicate asynchronous if needed (not needed here)
      return true;
    }
    if (message && message.type === MSG.IS_LINKEDIN_PROFILE) {
      sendResponse({ is_linkedin_profile: isLinkedInProfile(location.href || '') });
      return true;
    }
  });
})();

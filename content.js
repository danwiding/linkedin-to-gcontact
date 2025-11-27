// Content script: responds with page info when requested
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
    return { title, hostname, author, site_name: siteName };
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === 'GET_PAGE_INFO') {
      sendResponse(collectPageInfo());
      // Indicate asynchronous if needed (not needed here)
      return true;
    }
  });
})();

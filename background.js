// Pre-enable panel for all existing tabs when extension loads
chrome.tabs.query({}, (tabs) => {
  tabs.forEach((tab) => {
    chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: 'sidepanel.html',
      enabled: true
    });
  });
});

// Pre-enable panel for new tabs when created
chrome.tabs.onCreated.addListener((tab) => {
  chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidepanel.html',
    enabled: true
  });
});

// Open the side panel for the specific tab when the extension's toolbar button is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

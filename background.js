// Open the side panel only for the specific tab when the extension's toolbar button is clicked
chrome.action.onClicked.addListener((tab) => {
  // Open first within user gesture context, then configure the panel
  chrome.sidePanel.open({ tabId: tab.id }).then(() => {
    chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: 'sidepanel.html',
      enabled: true
    });
  });
});

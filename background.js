// Disable side panel globally by default
chrome.sidePanel.setOptions({ enabled: false });

// Open the side panel only for the specific tab when the extension's toolbar button is clicked
chrome.action.onClicked.addListener((tab) => {
  // Enable and open the side panel for this specific tab
  // Both calls must be synchronous (no await) to stay within the user gesture context
  chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidepanel.html',
    enabled: true
  });
  chrome.sidePanel.open({ tabId: tab.id });
});

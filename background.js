// Disable side panel globally by default
chrome.sidePanel.setOptions({ enabled: false });

// Allow Chrome to open the side panel when the action button is clicked
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Enable the side panel only for the specific tab when clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidepanel.html',
    enabled: true
  });
});

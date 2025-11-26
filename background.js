// Disable side panel globally by default
chrome.sidePanel.setOptions({ enabled: false });

// Open the side panel only for the specific tab when the extension's toolbar button is clicked
chrome.action.onClicked.addListener(async (tab) => {
  // Enable the side panel for this specific tab
  await chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidepanel.html',
    enabled: true
  });
  
  // Open the side panel for this tab
  await chrome.sidePanel.open({ tabId: tab.id });
});

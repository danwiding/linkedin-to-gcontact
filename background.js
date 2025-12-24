import { LI2GC_MESSAGE_TYPES } from './messageTypes.js';

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

// Refresh sidebar when active tab URL changes or reloads
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only refresh when page has finished loading
  if (changeInfo.status === 'complete') {
    chrome.runtime.sendMessage({ type: LI2GC_MESSAGE_TYPES.REFRESH_PANEL, tabId }).catch(() => {
      // Silently ignore if side panel is not open
    });
  }
});

// Refresh sidebar when user switches to a different tab
chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.runtime.sendMessage({ type: LI2GC_MESSAGE_TYPES.REFRESH_PANEL, tabId }).catch(() => {
    // Silently ignore if side panel is not open
  });
});

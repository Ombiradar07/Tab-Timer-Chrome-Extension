const TIME_KEY = 'tab_timer_data';

// Initialize the storage
chrome.storage.local.get(TIME_KEY, (data) => {
  if (!data[TIME_KEY]) {
    chrome.storage.local.set({ [TIME_KEY]: {} });
  }
});

let currentTabId = null;
let startTime = null;

// Check if a tab is playing audio or using media
function isTabPlayingMedia(tabId, callback) {
  chrome.tabs.get(tabId, (tab) => {
    callback(tab?.audible); // tab.audible is true if media is playing
  });
}

// Function to update time spent on each tab
function updateTabTime(tabId, timeSpent) {
  chrome.storage.local.get(TIME_KEY, (data) => {
    const tabData = data[TIME_KEY] || {};
    tabData[tabId] = (tabData[tabId] || 0) + timeSpent;
    chrome.storage.local.set({ [TIME_KEY]: tabData });
  });
}

// Handle tab switch (activation)
chrome.tabs.onActivated.addListener((activeInfo) => {
  const newTabId = activeInfo.tabId;
  
  if (currentTabId !== null) {
    const endTime = Date.now();

    // Check if the previous tab was playing media
    isTabPlayingMedia(currentTabId, (isPlayingMedia) => {
      if (!isPlayingMedia) {
        // Only update the time if media was NOT playing
        updateTabTime(currentTabId, endTime - startTime);
      }
    });
  }

  // Start the timer for the new tab
  currentTabId = newTabId;
  startTime = Date.now();
});

// Handle tab updates (e.g., refresh or page load)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (tabId === currentTabId && changeInfo.status === 'complete') {
    const endTime = Date.now();

    // We only want to update the time if the tab was not playing media
    isTabPlayingMedia(tabId, (isPlayingMedia) => {
      if (!isPlayingMedia) {
        updateTabTime(tabId, endTime - startTime);
        startTime = Date.now(); // Restart timer after refresh
      }
    });
  }
});

// Handle tab closure - Reset the timer for closed tabs
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === currentTabId) {
    const endTime = Date.now();

    // Check if media is playing before removing
    isTabPlayingMedia(tabId, (isPlayingMedia) => {
      if (!isPlayingMedia) {
        // Update the time and remove the tab from storage
        updateTabTime(tabId, endTime - startTime);
        resetTabTime(tabId); // Remove the timer on tab close
      }
    });

    currentTabId = null;
    startTime = null;
  }
});

// Function to reset or remove the time data for a specific tab
function resetTabTime(tabId) {
  chrome.storage.local.get(TIME_KEY, (data) => {
    const tabData = data[TIME_KEY] || {};
    delete tabData[tabId]; // Remove the specific tab's time
    chrome.storage.local.set({ [TIME_KEY]: tabData });
  });
}

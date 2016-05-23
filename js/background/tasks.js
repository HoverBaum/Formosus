chrome.tabs.onUpdated.addListener(function(tabid, changeinfo, tab) {

    // Only run the code once, when the tab render is complete
    // Without this, the retrievePhoto is called 3 times.
    if (changeinfo.status == "loading") {
		updateSavedBackground();
    }
});


chrome.runtime.onInstalled.addListener(function() {
    updateSavedBackground();
});

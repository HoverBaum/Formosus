//Task to run every time a new tab is loaded.
chrome.tabs.onUpdated.addListener(function(tabid, changeinfo, tab) {

    // Only run the code once, when the tab render is complete
    // Without this, the retrievePhoto is called 3 times.
    if (changeinfo.status == "loading") {
		console.debug(`Tab opened, checking background...`)
		updateSavedBackground()
    }
});

//Tasks to run when installed.
chrome.runtime.onInstalled.addListener(function() {
    updateSavedBackground()
});

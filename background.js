chrome.runtime.onMessage.addListener((message, sendResponse) => {
    if (message.action === "TOGGLE_FOCUS_MODE") {
        chrome.storage.sync.set({ focusMode: message.state }, () => {
            console.log("Focus Mode updated:", message.state);
            sendResponse({ status: "success" });

            // Use scripting API to inject content script dynamically if needed
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]?.id) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: applyFocusMode
                    });
                }
            });
        });
    }
    return true;  // Return true to send a response asynchronously
});

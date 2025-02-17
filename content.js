// Function to remove YouTube Shorts
function removeShorts() {
    document.querySelectorAll('ytd-rich-section-renderer, ytd-reel-shelf-renderer').forEach((el) => {
        el.style.display = "none";  // Hide shorts instead of removing them
    });
}

// Function to filter out non-educational videos
function filterVideos() {
    const educationalKeywords = ["tutorial", "lecture", "course", "learning", "education", "study", "science", "math"];//can be modifided according to the need of the user
    
    document.querySelectorAll("ytd-rich-item-renderer, ytd-grid-video-renderer").forEach((video) => {
        const titleElement = video.querySelector("#video-title");
        if (titleElement) {
            const titleText = titleElement.innerText.toLowerCase();
            const isEducational = educationalKeywords.some(keyword => titleText.includes(keyword));

            if (!isEducational) {
                video.style.display = "none";  // Hide non-educational videos
            } else {
                video.style.display = "";  // Restore educational videos
            }
        }
    });
}

// Function to check if focus mode is ON and apply changes
function applyFocusMode() {
    chrome.storage.sync.get("focusMode", (data) => {
        if (data.focusMode) {
            console.log("Focus Mode is ON - Filtering Content...");
            removeShorts();
            filterVideos();
        } else {
            console.log("Focus Mode is OFF - Restoring Content...");
            // When turning off, restore the visibility of all videos and shorts
            document.querySelectorAll("ytd-rich-item-renderer, ytd-grid-video-renderer").forEach((video) => {
                video.style.display = "";  // Reset to normal display
            });

            document.querySelectorAll('ytd-rich-section-renderer, ytd-reel-shelf-renderer').forEach((el) => {
                el.style.display = "";  // Restore shorts display
            });
        }
    });
}

// Start the observer after function definitions
const observer = new MutationObserver(() => {
    applyFocusMode();
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Listen for toggle messages from the popup
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "TOGGLE_FOCUS_MODE") {
        console.log("Received Toggle Message:", message.state);
        applyFocusMode();
    }
});

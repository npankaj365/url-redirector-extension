/**
 * This script is the extension's service worker. It runs in the background
 * to manage the redirection rules. It uses Chrome's declarativeNetRequest API,
 * which is a modern and efficient way to handle redirects without intercepting
 * every network request.
 */

/**
 * Updates the declarativeNetRequest rules based on the redirects stored in chrome.storage.
 * This function is the core of the redirection logic.
 */
async function updateRules() {
    try {
        // Retrieve the list of redirects from synced storage.
        // Default to an empty array if no redirects are set.
        const { redirects = [] } = await chrome.storage.sync.get({ redirects: [] });

        // Get the currently active rules to prepare for an update.
        const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
        const existingRuleIds = existingRules.map(rule => rule.id);

        // Create a new set of rules based on the stored redirects.
        const newRules = redirects.map((redirect, index) => {
            // The API requires a unique ID for each rule. We'll use the array index + 1.
            // For a more complex extension, a UUID stored with the redirect object would be more robust.
            const ruleId = index + 1;
            return {
                id: ruleId,
                priority: 1,
                action: {
                    type: 'redirect',
                    redirect: { url: redirect.to } // The URL to redirect to.
                },
                condition: {
                    // This filter will match the specified domain on any path.
                    // e.g., "facebook.com" becomes "*://*.facebook.com/*"
                    urlFilter: `*://*.${redirect.from}/*`, 
                    // We only want to redirect the main page, not images, scripts, etc.
                    resourceTypes: ['main_frame'] 
                }
            };
        });

        // Use the updateDynamicRules method to atomically remove all old rules
        // and add the new ones. This is efficient and prevents race conditions.
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: existingRuleIds, // Remove all previously registered rules
            addRules: newRules              // Add all the currently configured rules
        });
        
        console.log("Redirect rules updated successfully.", newRules);

    } catch (error) {
        // Log any errors for debugging.
        console.error("Error updating redirect rules:", error);
    }
}

// Add a listener for when the extension is first installed or updated.
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed. Initializing rules.");
    // Perform an initial rule update.
    updateRules();
});

// Add a listener for when the stored redirect data changes.
// This allows the rules to update in real-time as the user adds/removes redirects in the popup.
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.redirects) {
        console.log("Redirects storage changed. Updating rules.");
        updateRules();
    }
});


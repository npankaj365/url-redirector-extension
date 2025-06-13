/**
 * This script controls the behavior of the popup (popup.html).
 * It handles loading redirects from storage, displaying them,
 * adding new ones, and deleting existing ones.
 */

// Get references to the interactive DOM elements from popup.html
const form = document.getElementById('add-redirect-form');
const fromInput = document.getElementById('from-url');
const toInput = document.getElementById('to-url');
const redirectList = document.getElementById('redirect-list');
const noRedirectsMessage = document.getElementById('no-redirects-message');
const messageArea = document.getElementById('message-area');

/**
 * Displays a temporary message to the user (e.g., for success or error).
 * @param {string} text - The message to display.
 * @param {'success'|'error'} type - The type of message, for styling.
 */
function showMessage(text, type = 'error') {
    messageArea.textContent = text;
    // Apply different styles based on the message type
    messageArea.className = `p-3 mb-3 rounded-md text-sm transition-opacity duration-300 ${
        type === 'error' 
        ? 'bg-red-100 text-red-800' 
        : 'bg-green-100 text-green-800'
    }`;
    messageArea.classList.remove('hidden');
    // Hide the message after 3 seconds
    setTimeout(() => {
        messageArea.classList.add('hidden');
    }, 3000);
}


/**
 * Renders the list of redirects in the popup UI.
 * @param {Array<Object>} redirects - An array of redirect objects {from, to}.
 */
function renderRedirects(redirects) {
    // Clear the existing list to prevent duplicates on re-render
    redirectList.innerHTML = '';
    
    if (!redirects || redirects.length === 0) {
        // If there are no redirects, show the placeholder message
        redirectList.appendChild(noRedirectsMessage);
        noRedirectsMessage.style.display = 'block';
    } else {
        // Otherwise, hide the placeholder and render each redirect
        noRedirectsMessage.style.display = 'none';
        redirects.forEach((redirect, index) => {
            const redirectItem = document.createElement('div');
            redirectItem.className = 'flex items-center justify-between p-2 bg-slate-50 rounded-md border border-slate-200';
            
            const textContainer = document.createElement('div');
            textContainer.className = 'flex-1 mr-2 min-w-0';

            const fromText = document.createElement('p');
            fromText.className = 'text-sm font-medium text-slate-700 truncate';
            fromText.textContent = `From: ${redirect.from}`;
            fromText.title = redirect.from;

            const toText = document.createElement('p');
            toText.className = 'text-xs text-indigo-600 truncate';
            toText.textContent = `To: ${redirect.to}`;
            toText.title = redirect.to;

            textContainer.appendChild(fromText);
            textContainer.appendChild(toText);

            const deleteButton = document.createElement('button');
            // Using an inline SVG for the trash icon to avoid extra file dependencies
            deleteButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 hover:text-red-500 transition-colors">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>`;
            deleteButton.className = 'flex-shrink-0';
            deleteButton.title = 'Delete redirect';
            deleteButton.addEventListener('click', () => deleteRedirect(index));

            redirectItem.appendChild(textContainer);
            redirectItem.appendChild(deleteButton);
            redirectList.appendChild(redirectItem);
        });
    }
}

/**
 * Deletes a redirect from storage based on its index.
 * @param {number} index - The index of the redirect to delete.
 */
async function deleteRedirect(index) {
    const { redirects } = await chrome.storage.sync.get('redirects');
    // Remove the item at the specified index
    redirects.splice(index, 1);
    // Save the modified array back to storage
    await chrome.storage.sync.set({ redirects });
    // The storage listener in background.js will automatically update the rules.
}

/**
 * Handles the form submission to add a new redirect.
 * @param {Event} e - The form submission event.
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    const from = fromInput.value.trim();
    const to = toInput.value.trim();

    if (from && to) {
        const { redirects = [] } = await chrome.storage.sync.get('redirects');
        
        // Prevent adding a duplicate "from" URL
        if (redirects.some(r => r.from.toLowerCase() === from.toLowerCase())) {
            showMessage("A redirect for this 'From' domain already exists.", 'error');
            return;
        }

        redirects.push({ from, to });
        await chrome.storage.sync.set({ redirects });
        showMessage("Redirect added successfully!", 'success');
        form.reset();
        fromInput.focus();
    }
}

/**
 * Main function to initialize the popup.
 */
async function init() {
    // Load and render existing redirects when the popup is opened
    const { redirects = [] } = await chrome.storage.sync.get({ redirects: [] });
    renderRedirects(redirects);

    // Listen for changes in storage to keep the popup UI in sync.
    // This is useful if the data is changed from another context.
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync' && changes.redirects) {
            renderRedirects(changes.redirects.newValue || []);
        }
    });

    // Attach the event listener to the form
    form.addEventListener('submit', handleFormSubmit);
}

// Run the initialization function when the script loads
init();


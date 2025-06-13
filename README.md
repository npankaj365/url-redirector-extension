# URL Redirector Chrome Extension

A simple, lightweight Chrome Extension to redirect URLs based on a custom list. For example, you can set a rule to redirect `facebook.com` to `readsomethingwonderful.com`, helping you stay focused or customize your browsing experience.

The popup interface allows you to easily add and remove redirection rules, which are stored securely using Chrome's sync storage and applied efficiently using the Declarative Net Request API.

## Features

* **Simple UI**: An intuitive popup for managing your redirects.
* **Add & Delete Rules**: Easily create new redirect rules and remove them with a single click.
* **Domain-Based Redirection**: Redirects an entire domain (e.g., `example.com`) to a specific URL.
* **Persistent Storage**: Your rules are saved to your Chrome profile and synced across devices.
* **Efficient & Private**: Uses Chrome's modern `declarativeNetRequest` API, which respects user privacy and offers high performance without reading page content.

## Installation

To install this extension from the source code, follow these steps:

1.  **Clone the repository** (or download the ZIP and extract it) to a local folder on your computer.
    ```bash
    git clone https://github.com/npankaj365/url-redirector-extension.git
    ```
2.  Open Google Chrome and navigate to the Extensions page at `chrome://extensions`.
3.  Enable **Developer mode** using the toggle switch in the top-right corner.
4.  Click the **"Load unpacked"** button that appears on the top-left.
5.  In the file selection dialog, choose the folder where you cloned or extracted the repository.
6.  The "URL Redirector" extension will now appear in your list of extensions and is ready to use!

## How to Use

1.  **Pin the Extension**: Click the puzzle piece icon in the Chrome toolbar and then click the pin icon next to "URL Redirector" to keep it visible.
2.  **Open the Popup**: Click the extension's icon in your toolbar to open the management popup.
3.  **Add a Redirect**:
    * In the "From" field, enter the domain you want to redirect (e.g., `x.com`).
    * In the "To" field, enter the full URL you want to redirect to (e.g., `https://lobste.rs`).
    * Click "Add Redirect".
4.  **Remove a Redirect**: Your active redirects are listed at the bottom. Click the trash can icon next to any rule to delete it.

Changes are saved automatically and take effect immediately.

## Built With

* HTML5
* Tailwind CSS
* Vanilla JavaScript
* Chrome Extension APIs (Storage, Declarative Net Request)

## Context of Creation

I wanted a no-frills self-sufficient extension that I could trust without having to verify the extension developer. Thus this project was born.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

* This Chrome Extension was generated and authored by **Gemini**, a large language model from Google.
* Icons provided by [Freepik.com](https://freepik.com/).

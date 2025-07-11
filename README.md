# Google-Multi-Search
Appends YouTube, Reddit, and Github to the toolbar for faster, more granular searching.

---

## Introduction
This userscript enhances the Google search results page by adding direct search links to YouTube, Reddit, and Github. The motivation behind this extension is to streamline the process of searching across different platforms by using the same search query, thus providing a more efficient and integrated search experience. The core purpose is to save time and clicks for users who frequently search these sites.

---

## Features
* **Name:** Dynamic Search Links
* **What it does:** It adds buttons to the Google search interface that, when clicked, will perform the same search on YouTube, Reddit, or Github.
* **How it improves the target interface:** Instead of manually navigating to each site and re-typing the search query, this script makes it a one-click process, seamlessly integrating these search options into the Google UI.
* **Example usage or code snippet:**
    When you search for "web development tutorials" on Google, you will see three new buttons: "YouTube," "Reddit," and "Github." Clicking the "YouTube" button will take you to a Youtube for "web development tutorials."

---

## Installation
### Prerequisites
* A modern web browser like Chrome, Firefox, or Edge.
* A userscript manager extension, such as **Tampermonkey** or **Greasemonkey**.

### Step-by-step instructions
1.  Install a userscript manager in your browser.
2.  Click on the "Install" button for this script on Greasy Fork or OpenUserJS.
3.  The userscript manager will open a new tab. Click on the "Install" button on that page.
4.  The script is now installed and will automatically run on Google search pages.

---

## Usage
Once installed, the extension works automatically. When you perform a search on Google, new links for "YouTube," "Reddit," and "Github" will appear in the toolbar below the search bar. Clicking on any of these links will open a new search on the respective platform using your current Google search query.

---

## Configuration
The userscript includes a configuration menu that allows you to toggle the visibility of the search links.
* To access the configuration, click on the userscript manager's icon in your browser's toolbar, and under the "Google to Youtube" script, select "Configure."
* This will open a dialog where you can check or uncheck "YouTube," "Reddit," and "Github" to show or hide the corresponding links.
* The configuration is managed using `MonkeyConfig`, and the settings are stored by the userscript manager. The storage keys are `YouTube`, `Reddit`, and `Github`.

---

## Screenshots
*(This section should be updated with actual screenshots of the extension in action.)*

A screenshot of the Google search results page with the added links:
`![Screenshot of the extension in action](screenshot-1.png)`

A screenshot of the configuration menu:
`![Screenshot of the configuration menu](screenshot-2.png)`

---

## Architecture
### File and folder layout
The project consists of a single JavaScript file:
* `Google Multi Search.js`: This is the main file containing the entire userscript code.

### Core modules and their responsibilities
* **jQuery:** Used for DOM manipulation, such as selecting elements and inserting the new search links.
* **MonkeyConfig:** A library used to create a user-friendly configuration menu for the script.
* **Main script logic:** The core logic that runs on document ready. It initializes the configuration, retrieves the search query from the page, and then calls the `createLink` function for each enabled site.

---

## API / Function Reference
* **Name:** `createLink`
* **Parameters and types:**
    * `site` (String): The name of the site for the link text (e.g., "YouTube").
    * `url` (String): The base URL for the search on the target site.
    * `query` (String): The search query to be appended to the URL.
* **Return value:** None.
* **Purpose within the extension:** This function creates and inserts the `<a>` element for the search link into the Google search results page.

---

## Contributing
### How to report issues
* Please use the GitHub issue tracker to report any bugs or request features.
* Use the provided issue templates if available.
* When reporting a bug, please include:
    * A clear and descriptive title.
    * Steps to reproduce the issue.
    * The expected and actual results.
    * Your browser and userscript manager version.
    * Any relevant console errors.

### How to submit pull requests
* Fork the repository and create a new branch for your feature or bug fix.
* Make your changes and ensure the code follows the existing style.
* Submit a pull request with a clear description of the changes.

### Coding style guidelines
* Follow the existing coding style.
* Use descriptive variable and function names.
* Comment your code where necessary.

---

## Changelog
### [6.6] - 2025-07-11
* Initial release of the comprehensive `README.md`.
* The userscript adds search links for YouTube, Reddit, and Github to the Google search page.
* Includes a configuration menu to toggle the links.

---

## License
This project is licensed under the **MIT License**.

The original userscript header specifies the **CC-BY-NC-SA-4.0** license. Please be aware of both when using or contributing to this project.

---

## Disclosure
This userscript is not affiliated with, endorsed by, or in any way officially connected with Google LLC or any of its subsidiaries or its affiliates. The official Google website can be found at [https://www.google.com](https://www.google.com). The name Google as well as related names, marks, emblems, and images are registered trademarks of their respective owners.

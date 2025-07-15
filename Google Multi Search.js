// ==UserScript==
// @name         Google Multi Search
// @namespace    https://github.com/SysAdminDoc/Google-Multi-Search
// @version      2.2
// @description  Adds a configurable menu of search buttons to Google. Enable, disable, or add your own.
// @author       Matthew Parker
// @match        https://www.google.com/search*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @updateURL    https://github.com/SysAdminDoc/Google-Multi-Search/raw/refs/heads/main/Google%20Multi%20Search.js
// @downloadURL  https://github.com/SysAdminDoc/Google-Multi-Search/raw/refs/heads/main/Google%20Multi%20Search.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Default Configuration ---
    const DEFAULT_SITES = [
        { name: 'YouTube', modifier: 'site:youtube.com', type: 'site', enabled: true },
        { name: 'Reddit', modifier: 'site:reddit.com', type: 'site', enabled: true },
        { name: 'Github', modifier: 'site:github.com', type: 'site', enabled: true },
        { name: 'Bing', modifier: 'https://www.bing.com/search?q=', type: 'redirect', enabled: false },
        { name: 'DuckDuckGo', modifier: 'https://duckduckgo.com/?q=', type: 'redirect', enabled: false },
        { name: 'Brave', modifier: 'https://search.brave.com/search?q=', type: 'redirect', enabled: false },
        { name: 'Yahoo', modifier: 'https://search.yahoo.com/search?p=', type: 'redirect', enabled: false },
        { name: 'Yandex', modifier: 'https://yandex.com/search/?text=', type: 'redirect', enabled: false },
        { name: 'Startpage', modifier: 'https://www.startpage.com/sp/search?query=', type: 'redirect', enabled: false }
    ];

    let currentSites = [];
    const BUTTON_CONTAINER_ID = 'custom-search-buttons-container';

    // --- Main Functions ---

    function renderSearchButtons() {
        const existingContainer = document.getElementById(BUTTON_CONTAINER_ID);
        if (existingContainer) existingContainer.remove();

        const linkContainer = document.querySelector('[role="navigation"] [role="list"]');
        if (!linkContainer) return;

        const queryInput = document.querySelector('textarea[name="q"], input[name="q"]');
        const currentFullQuery = queryInput ? queryInput.value : '';
        if (!currentFullQuery) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.id = BUTTON_CONTAINER_ID;
        linkContainer.appendChild(buttonContainer);

        let baseQuery = currentFullQuery;
        currentSites.forEach(site => {
            if (site.type === 'site' && baseQuery.startsWith(site.modifier + ' ')) {
                baseQuery = baseQuery.substring(site.modifier.length + 1);
            }
        });

        const templateLink = linkContainer.querySelector('a');
        if (!templateLink) return;

        currentSites.forEach(site => {
            if (!site.enabled) return;

            let href = '';
            if (site.type === 'site') {
                const newQuery = `${site.modifier} ${baseQuery}`;
                href = `/search?q=${encodeURIComponent(newQuery)}`;
            } else {
                href = `${site.modifier}${encodeURIComponent(baseQuery)}`;
            }

            const newButtonWrapper = templateLink.parentElement.cloneNode(true);
            const newButton = newButtonWrapper.querySelector('a');
            newButton.href = href;
            newButton.removeAttribute('aria-disabled');
            newButton.removeAttribute('aria-current');

            const textElement = newButton.querySelector('div');
            if (textElement) textElement.textContent = site.name;

            buttonContainer.appendChild(newButtonWrapper);
        });
    }

    function showSettingsPanel() {
        if (document.getElementById('settings-panel-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'settings-panel-overlay';
        document.body.appendChild(overlay);

        const panel = document.createElement('div');
        panel.id = 'settings-panel';
        overlay.appendChild(panel);

        panel.innerHTML = `
            <h2>Search Button Settings</h2>
            <div id="settings-site-list"></div>
            <hr>
            <h3>Add a New Button</h3>
            <div class="settings-add-form">
                <input type="text" id="add-name" placeholder="Button Name (e.g., Wikipedia)">
                <input type="text" id="add-modifier" placeholder="URL or Site Modifier">
                <select id="add-type">
                    <option value="site">Google Site Search</option>
                    <option value="redirect">Redirect to URL</option>
                </select>
                <button id="add-button">Add</button>
            </div>
            <div class="settings-footer">
                <button id="save-button">Save & Close</button>
            </div>
        `;

        const siteListDiv = panel.querySelector('#settings-site-list');
        const tempSites = JSON.parse(JSON.stringify(currentSites));

        function renderSiteList() {
            siteListDiv.innerHTML = '';
            tempSites.forEach((site, index) => {
                const siteDiv = document.createElement('div');
                siteDiv.className = 'settings-site-item';
                siteDiv.innerHTML = `
                    <label>
                        <input type="checkbox" ${site.enabled ? 'checked' : ''}>
                        <span>${site.name}</span>
                    </label>
                    <button data-index="${index}">Remove</button>
                `;
                siteDiv.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
                    tempSites[index].enabled = e.target.checked;
                });
                siteDiv.querySelector('button').addEventListener('click', () => {
                    tempSites.splice(index, 1);
                    renderSiteList();
                });
                siteListDiv.appendChild(siteDiv);
            });
        }

        renderSiteList();

        panel.querySelector('#add-button').addEventListener('click', () => {
            const name = panel.querySelector('#add-name').value.trim();
            const modifier = panel.querySelector('#add-modifier').value.trim();
            const type = panel.querySelector('#add-type').value;

            if (name && modifier) {
                tempSites.push({ name, modifier, type, enabled: true });
                renderSiteList();
                panel.querySelector('#add-name').value = '';
                panel.querySelector('#add-modifier').value = '';
            } else {
                alert('Please provide a name and a URL/modifier.');
            }
        });

        panel.querySelector('#save-button').addEventListener('click', () => {
            currentSites = tempSites;
            GM_setValue('search_sites', JSON.stringify(currentSites));
            overlay.remove();
            renderSearchButtons();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    function injectStyles() {
        GM_addStyle(`
            #settings-cog {
                position: fixed; top: 15px; left: 15px; z-index: 9999;
                cursor: pointer; background: #f1f3f4; border-radius: 50%;
                width: 40px; height: 40px; display: grid; place-items: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: transform 0.2s ease;
            }
            #settings-cog:hover { transform: rotate(45deg); }
            #custom-search-buttons-container { display: flex; align-items: center; }
            #custom-search-buttons-container > div { display: inline-block; }
            #settings-panel-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); z-index: 10000; display: grid; place-items: center;
            }
            #settings-panel {
                background: white; padding: 20px; border-radius: 8px;
                width: 90%; max-width: 500px; font-family: sans-serif;
            }
            #settings-panel h2, #settings-panel h3 { margin-top: 0; color: #202124; }
            #settings-site-list {
                max-height: 250px; overflow-y: auto; border: 1px solid #ddd;
                padding: 10px; border-radius: 4px;
            }
            .settings-site-item {
                display: flex; justify-content: space-between; align-items: center;
                padding: 5px; border-bottom: 1px solid #eee;
            }
            .settings-site-item:last-child { border-bottom: none; }
            .settings-site-item label { display: flex; align-items: center; cursor: pointer; }
            .settings-site-item input[type="checkbox"] { margin-right: 10px; }
            .settings-add-form { display: flex; gap: 10px; margin-top: 15px; }
            .settings-add-form input, .settings-add-form select {
                padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex-grow: 1;
            }
            #settings-panel button {
                padding: 8px 12px; cursor: pointer; border: 1px solid #ccc;
                border-radius: 4px; background: #f8f9fa;
            }
            #settings-panel button:hover { background: #f1f3f4; }
            .settings-footer { text-align: right; margin-top: 20px; }
            #save-button { background: #1a73e8; color: white; border-color: #1a73e8; }
        `);
    }

    async function init() {
        const savedSites = await GM_getValue('search_sites', null);
        if (savedSites) {
            currentSites = JSON.parse(savedSites);
        } else {
            currentSites = DEFAULT_SITES;
            GM_setValue('search_sites', JSON.stringify(currentSites));
        }
        injectStyles();
        const cog = document.createElement('div');
        cog.id = 'settings-cog';
        cog.innerHTML = '⚙️';
        cog.title = 'Configure Search Buttons';
        cog.addEventListener('click', showSettingsPanel);
        document.body.appendChild(cog);
        renderSearchButtons();
    }

    init();
})();

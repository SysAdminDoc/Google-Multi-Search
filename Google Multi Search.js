// ==UserScript==
// @name         Google Multi Search
// @namespace    https://github.com/SysAdminDoc/Google-Multi-Search
// @version      7.5
// @description  Adds extensive search page customization: themeable UI, adjustable width, URL cleaning, element hiding, custom search engine shortcuts, and custom dropdown menus.
// @author       Matthew Parker
// @match        https://*.google.com/search?*
// @match        https://*.google.com/
// @exclude      *://*.google.com/calendar*
// @exclude      *://*.googleusercontent.com/maps.google.com/0
// @exclude      *://mail.google.com/*
// @exclude      *://news.google.com/*
// @exclude      *://*.googleusercontent.com/photos.google.com/1
// @exclude     https://webcache.googleusercontent.com/*
// @exclude     https://images.google.*/*
// @exclude     https://books.google.*/*
// @exclude     https://support.google.*/*
// @exclude     https://accounts.google.*/*
// @exclude     https://myaccount.google.*/*
// @exclude     https://aboutme.google.*/*
// @exclude     https://cse.google.*/*
// @exclude     https://www.google.com/cloudprint*
// @exclude     https://www.google.com/calendar*
// @exclude     https://www.google.com/intl/*/drive*
// @exclude     https://www.google.com/earth*
// @exclude     https://www.google.com/finance*
// @exclude     https://www.google.com/maps*
// @exclude     https://www.google.com/voice*
// @icon        https://raw.githubusercontent.com/SysAdminDoc/Google-Multi-Search/main/goog.ico
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const DEFAULT_SITES = [
        { name: 'Reddit', modifier: 'site:reddit.com', enabled: true },
        { name: 'YouTube', modifier: 'site:youtube.com', enabled: true },
        { name: 'GitHub', modifier: 'site:github.com', enabled: true }
    ];

    const REPLACEMENT_TOOLS = [
        {
            name: 'Images',
            setting: 'showCustomImages',
            urlTemplate: 'https://www.google.com/search?num=50&udm=2&q={{SEARCH TERM}}'
        },
        {
            name: 'News',
            setting: 'showCustomNews',
            urlTemplate: 'https://www.google.com/search?num=10&sca_esv=9cc9d8b9600304b9&q={{SEARCH TERM}}&tbm=nws&source=lnms&fbs='
        },
        {
            name: 'Videos',
            setting: 'showCustomVideos',
            urlTemplate: 'https://www.google.com/search?num=10&sa=X&sca_esv=9cc9d8b9600304b9&biw=1536&bih=713&udm=7&fbs=AIIjpHxU7SXXniUZfeShr2fp4giZ1Y6MJ25_tmWITc7uy4KIeioyp3OhN11EY0n5qfq-zEMZldv_eRjZ2XLYc5GnVnMEIxC4WQfoNDH7FwchyAayylELsgfAj8BII40QoR58PCqSgAEBgGXxhCs_P2VRKK0fqJmJQAFtLqxN_BLVsD1lBj4oSktli1md6S-L0JmY0DnmDOVwu_tKZviJd7kxwlIz8G5UvA&q={{SEARCH TERM}}'
        }
    ];

    const DEFAULT_DROPDOWNS = [
        {
            title: 'Search',
            links: [
                { name: 'FilePursuit', url: 'https://filepursuit.com/' },
                { name: 'WebOasis', url: 'https://weboas.is/' },
                { name: 'FileSearch', url: 'https://filesearch.link/' },
                { name: 'IPFS Search', url: 'https://ipfs-search.com/' }
            ]
        },
        {
            title: 'GDrive',
            links: [
                { name: 'DeDigger', url: 'https://www.dedigger.com/' },
                { name: 'WhatInTheWorld', url: 'https://whatintheworld.xyz/' },
                { name: 'Torrentables', url: 'https://w3abhishek.github.io/torrentables/' },
                { name: 'EyeDex', url: 'https://eyedex.org/' }
            ]
        },
        {
            title: 'Open Directory',
            links: [
                { name: 'ODCrawler', url: 'https://odcrawler.xyz/' },
                { name: 'FileChef', url: 'https://www.filechef.com/' },
                { name: 'OpenDirSearch', url: 'https://opendirsearch.abifog.com/' },
                { name: 'Palined', url: 'http://palined.com/search/' },
                { name: 'OD Finder', url: 'https://ewasion.github.io/opendirectory-finder/' },
                { name: 'OD (ReeceMercer)', url: 'https://open-directories.reecemercer.dev/' },
                { name: 'LumpySoft', url: 'https://lumpysoft.com/' },
                { name: 'EyeOfJustice', url: 'https://www.eyeofjustice.com/od/' },
                { name: 'L33Tech ODS', url: 'https://sites.google.com/view/l33tech/tools/ods' },
                { name: 'Lendx', url: 'http://lendx.org/' }
            ]
        },
        {
            title: 'Archives',
            links: [
                { name: 'The Eye', url: 'https://the-eye.eu/' },
                { name: 'Archive.ph', url: 'http://archive.ph/' },
                { name: 'Internet Archive', url: 'https://archive.org/' },
                { name: 'Wayback Machine', url: 'https://archive.org/web/' }
            ]
        },
        {
            title: 'Torrent',
            links: [
                { name: 'FileListing', url: 'https://filelisting.com/' },
                { name: 'SolidTorrents', url: 'https://solidtorrents.net/' },
                { name: 'Torrents.csv', url: 'https://torrents-csv.ml/' }
            ]
        }
    ];

    const DEFAULT_SETTINGS = {
        // Feature Toggles
        cleanURL: true,
        endlessGoogle: true,
        restoreFullURLs: true,
        useClassicFavicon: true,
        cleanupHomepage: true,
        useFullWidth: false,
        hideSidebar: true,

        // Theme & Style
        resultsWidth: 1200,
        highlightDate: true,
        searchBarTheme: 'default', // 'default', 'glow', 'strangerThings'
        searchBarWidth: 700,
        headerWidth: 900,
        searchBarFont: 'monospace',
        changeVisitedLinks: true,

        // Element Hiding Toggles
        hideSponsoredResults: true,
        removeAI: true,
        hidePeopleAlsoAsk: true,
        hideRelatedSearches: true,
        hidePeopleAlsoSearchFor: true,
        hideVideoThumbnails: true,
        hideKeyMoments: true,
        hideTopAnswers: true,
        hideAppRatings: true,
        hide3DotMenu: true,
        hideBottomButtons: true,
        hideLabsButton: true,
        hideFooter: true,
        hideMoreResultsBar: true,
        hideDefaultTools: true,

        // New Custom Toolbar Links
        showCustomImages: true,
        showCustomNews: true,
        showCustomVideos: true,
    };

    // --- Early Execution (runs before the page loads) ---
    function executeEarly() {
        const earlySettings = JSON.parse(GM_getValue('gms_settings', JSON.stringify(DEFAULT_SETTINGS)));

        // Homepage Cleanup
        if (earlySettings.cleanupHomepage && window.location.pathname === '/') {
            GM_addStyle(`
                .c93Gbe, a:has-text(/Store/), a:has-text(/About/),
                a[aria-label="Search Labs"], div.bvUkz, .Y5MKCd.plR5qb, .olrp5b {
                    display: none !important;
                }
            `);
        }

        // URL Cleaning
        if (earlySettings.cleanURL && window.location.pathname === '/search') {
            const url = new URL(window.location.href);
            const paramsToRemove = ['ved', 'oq', 'gs_lcrp', 'sclient', 'source', 'ei', 'sa', 'aqs', 'sxsrf', 'uact', 'gs_lp', 'sourceid'];
            let paramsChanged = false;
            paramsToRemove.forEach(param => {
                if (url.searchParams.has(param)) {
                    url.searchParams.delete(param);
                    paramsChanged = true;
                }
            });
            if (paramsChanged) {
                window.history.replaceState({}, document.title, url.toString());
            }
        }
    }
    executeEarly();


    // Exit early for non-search pages, as the rest of the script only applies to them.
    if (window.location.pathname !== '/search' || new URL(window.location.href).searchParams.get('tbm')) {
        return;
    }

    // --- Main Script ---
    let settings = {};
    let customSites = [];
    let customDropdowns = [];
    const DYNAMIC_STYLE_ID = 'gms-dynamic-styles';

    // --- Modules (self-contained features) ---
    const classicFavicon = {
        ICON_HREF: 'https://raw.githubusercontent.com/SysAdminDoc/Google-Multi-Search/refs/heads/main/goog.ico',
        observer: null,
        update() {
            if (!document.head) return;
            document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(l => {
                if (l.href !== this.ICON_HREF) {
                    l.remove();
                }
            });
            if (!document.querySelector(`link[href="${this.ICON_HREF}"]`)) {
                const newLink = document.createElement('link');
                newLink.rel = 'icon';
                newLink.type = 'image/x-icon';
                newLink.href = this.ICON_HREF;
                document.head.appendChild(newLink);
            }
        },
        init() {
            if (this.observer) this.observer.disconnect();
            this.update();
            this.observer = new MutationObserver(() => this.update());
            this.observer.observe(document.head, { childList: true, subtree: true });
        }
    };

    const pageModifier = {
        observer: null,
        runModifications() {
            try {
                if (settings.restoreFullURLs) {
                    document.querySelectorAll('#rso .g, #rso .MjjYud, #rso [data-sok-raw]').forEach(el => {
                        if (el.classList.contains('btr-processed')) return;
                        const linkEl = el.querySelector('a[href][data-ved]');
                        const citeEl = el.querySelector('cite');
                        if (linkEl && citeEl && !citeEl.textContent.startsWith('http')) {
                            citeEl.textContent = linkEl.href;
                            el.classList.add('btr-processed');
                        }
                    });
                }
            } catch (error) {
                console.error("GMS Error (runModifications):", error);
            }
        },
        init() {
            this.runModifications();
            const rcnt = document.getElementById('rcnt');
            if (!rcnt) return;
            this.observer = new MutationObserver(() => this.runModifications());
            this.observer.observe(rcnt, { childList: true, subtree: true });
        }
    };

    const endlessGoogle = {
        page: 1,
        loading: false,
        finished: false,
        container: null,
        onScroll() {
            if (this.loading || this.finished) return;
            if (window.scrollY > document.documentElement.scrollHeight - window.innerHeight * 1.5) {
                this.loadNextPage();
            }
        },
        async loadNextPage() {
            this.loading = true;
            this.page++;
            const nextUrl = new URL(location.href);
            nextUrl.searchParams.set('start', (this.page - 1) * 10);
            try {
                const response = await fetch(nextUrl.href);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const results = doc.getElementById('rso');
                if (!results || results.children.length === 0) {
                    this.finished = true;
                    window.removeEventListener('scroll', this.boundOnScroll);
                    return;
                }
                this.container.appendChild(results);
                pageModifier.runModifications();
            } catch (error) {
                console.error("GMS Error (Endless Google):", error);
                this.finished = true;
            } finally {
                this.loading = false;
            }
        },
        init() {
            this.container = document.getElementById('rso');
            if (!this.container) return;
            this.boundOnScroll = this.onScroll.bind(this);
            window.addEventListener('scroll', this.boundOnScroll, { passive: true });
        }
    };

    // --- Core UI & Style Functions ---

    function renderReplacementTools(targetContainer) {
        const queryInput = document.querySelector('textarea[name="q"], input[name="q"]');
        const currentQuery = queryInput?.value || '';
        if (!currentQuery) return;

        REPLACEMENT_TOOLS.forEach(tool => {
            if (!settings[tool.setting]) return;

            const newHref = tool.urlTemplate.replace('{{SEARCH TERM}}', encodeURIComponent(currentQuery));

            const newButtonWrapper = document.createElement('div');
            newButtonWrapper.className = 'YmvwI';
            newButtonWrapper.setAttribute('role', 'listitem');
            const newLink = document.createElement('a');
            newLink.href = newHref;
            newLink.className = 'LatpMc nPDzT T3FoJb';
            const newText = document.createElement('div');
            newText.textContent = tool.name;
            newText.className = 'Y35s6d';
            newLink.appendChild(newText);
            newButtonWrapper.appendChild(newLink);
            targetContainer.appendChild(newButtonWrapper);
        });
    }

    function renderSearchButtons(targetContainer) {
        const queryInput = document.querySelector('textarea[name="q"], input[name="q"]');
        const currentQuery = queryInput?.value || '';
        if (!currentQuery) return;

        let baseQuery = currentQuery;
        customSites.forEach(site => {
            const modifier = site.modifier.endsWith(' ') ? site.modifier : `${site.modifier} `;
            if (baseQuery.toLowerCase().startsWith(modifier.toLowerCase())) {
                baseQuery = baseQuery.substring(modifier.length);
            }
        });

        customSites.forEach(site => {
            if (!site.enabled) return;
            const newHref = `/search?q=${encodeURIComponent(`${site.modifier} ${baseQuery}`)}`;
            const newButtonWrapper = document.createElement('div');
            newButtonWrapper.className = 'YmvwI';
            newButtonWrapper.setAttribute('role', 'listitem');
            const newLink = document.createElement('a');
            newLink.href = newHref;
            newLink.className = 'LatpMc nPDzT T3FoJb';
            const newText = document.createElement('div');
            newText.textContent = site.name;
            newText.className = 'Y35s6d';
            newLink.appendChild(newText);
            newButtonWrapper.appendChild(newLink);
            targetContainer.appendChild(newButtonWrapper);
        });
    }

    function renderDropdownMenus(targetContainer) {
        customDropdowns.forEach(dropdownData => {
            if (!dropdownData.links || dropdownData.links.length === 0) return;

            const dropdownWrapper = document.createElement('div');
            dropdownWrapper.className = 'YmvwI gms-dropdown';
            dropdownWrapper.setAttribute('role', 'listitem');

            const dropdownToggle = document.createElement('div');
            dropdownToggle.className = 'LatpMc nPDzT T3FoJb';
            dropdownToggle.style.cursor = 'pointer';

            const dropdownToggleText = document.createElement('div');
            dropdownToggleText.textContent = dropdownData.title;
            dropdownToggleText.className = 'Y35s6d';
            dropdownToggle.appendChild(dropdownToggleText);


            const dropdownMenu = document.createElement('div');
            dropdownMenu.className = 'gms-dropdown-menu';

            dropdownData.links.forEach(link => {
                const item = document.createElement('a');
                item.className = 'gms-dropdown-item';
                item.href = link.url;
                item.textContent = link.name;
                item.target = '_blank';
                item.rel = 'noopener noreferrer';
                dropdownMenu.appendChild(item);
            });

            dropdownWrapper.appendChild(dropdownToggle);
            dropdownWrapper.appendChild(dropdownMenu);
            targetContainer.appendChild(dropdownWrapper);
        });
    }

    function renderCustomTools() {
        try {
            const CONTAINER_ID = 'gms-custom-tools';
            const toolsMenu = document.querySelector('#hdtb-tls');
            if (!toolsMenu) return;

            const parentContainer = toolsMenu.parentNode;
            if (!parentContainer) return;

            document.getElementById(CONTAINER_ID)?.remove();

            const container = document.createElement('div');
            container.id = CONTAINER_ID;
            container.style.display = 'contents';

            renderReplacementTools(container);
            renderSearchButtons(container);
            renderDropdownMenus(container);

            if (container.hasChildNodes()) {
                parentContainer.insertBefore(container, toolsMenu);
            }
        } catch (error) {
            console.error("GMS Error (renderCustomTools):", error);
        }
    }


    function updateDynamicStyles(isLivePreview = false) {
        const styleEl = document.getElementById(DYNAMIC_STYLE_ID);
        if (!styleEl) return;
        let s = settings;
        if (isLivePreview) {
            const liveSettings = {};
            const panel = document.getElementById('settings-panel');
            if (!panel) return;
            panel.querySelectorAll('input[id^="setting-"], select[id^="setting-"]').forEach(input => {
                const key = input.id.replace('setting-', '');
                if (input.type === 'checkbox') liveSettings[key] = input.checked;
                else liveSettings[key] = input.value;
            });
             panel.querySelectorAll('input[type="radio"]:checked').forEach(input => {
                liveSettings[input.name] = input.value;
            });
            s = { ...settings, ...liveSettings };
        }

        let styles = '';
        // Page Element Hiding
        if (s.hideDefaultTools) styles += '.O1uzAe.beZ0tf { display: none !important; }';
        if (s.hideSponsoredResults) styles += '#tads, #taw, #bottomads, #tadsb, div[data-text-ad], div[aria-label="Ads"], div[aria-label="Sponsored"] { display: none !important; }';
        if (s.removeAI) styles += '#aib, .Lz5Cpe.Jz62f, .dRYYxd, div[jsname="txosbe"], .bzXtMb.M8OgIe.dRpWwb, block-component[type="web-answers-container"] { display: none !important; }';
        if (s.hideVideoThumbnails) styles += '.rIRoqf, .ITCGwe, .GfA8Hd, div[data-vido] { display: none !important; }';
        if (s.hideBottomButtons) styles += 'li.KTAFWb, .X5OiLe { display: none !important; }';
        if (s.hideAppRatings) styles += '.uo4vr, .R1i63b { display: none !important; }';
        if (s.hideLabsButton) styles += '.gb_I.gb_0.gb_dd { display: none !important; }';
        if (s.hideFooter) styles += '#sfooter, #footcnt { display: none !important; }';
        if (s.hidePeopleAlsoSearchFor) styles += 'div.ULSxyf { display: none !important; }';
        if (s.hideRelatedSearches) styles += '#botstuff > div:has(> div[role="heading"][aria-level="3"]), #related-search-payload { display: none !important; }';
        if (s.hide3DotMenu) styles += '.L48a4c, .eFM0qc { display: none !important; }';
        if (s.hideKeyMoments) styles += '[data-header-feature="KEY_MOMENTS"] { display: none !important; }';
        if (s.hideTopAnswers) styles += '.yaX1fe { display: none !important; }';
        if (s.highlightDate) styles += 'span.YrbPuc, span.MUxGbd.wuQ4Ob.WZ8Tjf, .LEsW5e { background-color: #c00 !important; color: #fff !important; padding: 2px 4px; border-radius: 4px; }';
        if (s.hidePeopleAlsoAsk) styles += '.cUnQKe { display: none !important; }';
        if (s.hideMoreResultsBar) styles += '.d86Vh { display: none !important; }';
        if (s.hideSidebar) styles += '#rhs { display: none !important; }';


        // Theme and Style
        styles += `#cnt { max-width: ${s.resultsWidth}px !important; }`;
        if (s.searchBarTheme === 'glow') styles += `.RNNXgb { box-shadow: 0 0 12px 2px rgba(70, 130, 180, 0.7) !important; border: 1px solid rgba(70, 130, 180, 0.5) !important; }`;
        if (s.searchBarTheme === 'strangerThings') styles += `.RNNXgb { background-color: #111 !important; border: 2px solid #e50914 !important; box-shadow: 0 0 10px #e50914, inset 0 0 5px #e50914 !important; }`;
        if (s.changeVisitedLinks) styles += '#search a > h3 { color: #304ffe !important; font-weight: bold !important; } #search a:visited > h3 { color: purple !important; font-weight: bold !important; } cite, cite a:link, cite a:visited { color: #37681f !important; }';
        if (s.useFullWidth) styles += 'div.ITZIwc.p4wth { width: 900px !important; } .ufC5Cb { grid-column: 2 / span 19 !important; margin-left: -85px !important; }';
        styles += `.RNNXgb { width: ${s.searchBarWidth}px !important; }`;
        styles += `.sfbg { width: ${s.headerWidth}px !important; }`;
        if (s.searchBarFont) styles += `form[role="search"] textarea { font-family: ${s.searchBarFont}, monospace !important; letter-spacing: -0.03em !important; font-size: 18px !important; }`;


        styleEl.textContent = styles;
    }

    function showSettingsPanel() {
        document.getElementById('gms-settings-overlay')?.remove();
        const hideToggles = Object.keys(DEFAULT_SETTINGS).filter(key => (key.startsWith('hide') || key.startsWith('remove')) && !key.startsWith('hideDefaultTools') && !key.startsWith('hideMoreResultsBar') && !key.startsWith('hideSidebar')).map(key => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^hide|^remove/i, '').trim();
            return `<label class="settings-toggle"><span>Hide ${label}</span><label class="toggle-switch"><input type="checkbox" id="setting-${key}" ${settings[key] ? 'checked' : ''}><span class="slider"></span></label></label>`;
        }).join('');

        const overlay = document.createElement('div');
        overlay.id = 'gms-settings-overlay';
        overlay.innerHTML = `
            <div id="settings-panel">
                <div class="settings-header"><h2>Google Multi Search</h2><button id="close-settings" title="Close">×</button></div>
                <div class="settings-body">
                    <div class="settings-section">
                        <h3>Custom Search Buttons</h3><div id="custom-sites-list"></div><button id="add-site-button" class="settings-button">Add New Site</button>
                    </div>
                     <div class="settings-section">
                        <h3>Custom Dropdown Menus</h3>
                        <div id="custom-dropdowns-list"></div>
                        <button id="add-dropdown-button" class="settings-button">Add New Dropdown</button>
                    </div>
                    <div class="settings-section">
                        <h3>Theme & Appearance</h3>
                        <div class="settings-row"><label for="setting-resultsWidth">Results Width: <span id="width-value">${settings.resultsWidth}px</span></label><input type="range" id="setting-resultsWidth" min="652" max="2000" step="4" value="${settings.resultsWidth}"></div>
                        <div class="settings-row"><label for="setting-headerWidth">Search Header Width: <span id="width-value-header">${settings.headerWidth}px</span></label><input type="range" id="setting-headerWidth" min="500" max="1200" step="10" value="${settings.headerWidth}"></div>
                        <div class="settings-row"><label for="setting-searchBarWidth">Search Input Width: <span id="width-value-searchbar">${settings.searchBarWidth}px</span></label><input type="range" id="setting-searchBarWidth" min="400" max="1100" step="10" value="${settings.searchBarWidth}"></div>
                        <div class="settings-row"><label for="setting-searchBarFont">Search Bar Font:</label><select id="setting-searchBarFont" name="searchBarFont"><option value="monospace">Monospace</option><option value="Arial">Arial</option><option value="Verdana">Verdana</option><option value="Times New Roman">Times New Roman</option><option value="Courier New">Courier New</option><option value="system-ui">System Default</option></select></div>
                        <label class="settings-toggle"><span>Highlight Result Date</span><label class="toggle-switch"><input type="checkbox" id="setting-highlightDate" ${settings.highlightDate ? 'checked' : ''}><span class="slider"></span></label></label>
                        <label class="settings-toggle"><span>Change Visited Link Color</span><label class="toggle-switch"><input type="checkbox" id="setting-changeVisitedLinks" ${settings.changeVisitedLinks ? 'checked' : ''}><span class="slider"></span></label></label>
                        <div class="settings-row"><h4>Search Bar Theme</h4><div class="radio-group"><label><input type="radio" name="searchBarTheme" value="default" ${settings.searchBarTheme === 'default' ? 'checked' : ''}> Default</label><label><input type="radio" name="searchBarTheme" value="glow" ${settings.searchBarTheme === 'glow' ? 'checked' : ''}> Glow</label><label><input type="radio" name="searchBarTheme" value="strangerThings" ${settings.searchBarTheme === 'strangerThings' ? 'checked' : ''}> Stranger Things</label></div></div>
                    </div>
                    <div class="settings-section">
                        <h3>Features</h3>
                        <label class="settings-toggle"><span>Clean URLs (Removes Trackers)</span><label class="toggle-switch"><input type="checkbox" id="setting-cleanURL" ${settings.cleanURL ? 'checked' : ''}><span class="slider"></span></label></label>
                        <label class="settings-toggle"><span>Enable Endless Scrolling</span><label class="toggle-switch"><input type="checkbox" id="setting-endlessGoogle" ${settings.endlessGoogle ? 'checked' : ''}><span class="slider"></span></label></label>
                        <label class="settings-toggle"><span>Restore Full URLs Under Results</span><label class="toggle-switch"><input type="checkbox" id="setting-restoreFullURLs" ${settings.restoreFullURLs ? 'checked' : ''}><span class="slider"></span></label></label>
                        <label class="settings-toggle"><span>Use Classic Favicon</span><label class="toggle-switch"><input type="checkbox" id="setting-useClassicFavicon" ${settings.useClassicFavicon ? 'checked' : ''}><span class="slider"></span></label></label>
                        <label class="settings-toggle"><span>Cleanup Google Homepage</span><label class="toggle-switch"><input type="checkbox" id="setting-cleanupHomepage" ${settings.cleanupHomepage ? 'checked' : ''}><span class="slider"></span></label></label>
                        <label class="settings-toggle"><span>Use Full Width Layout</span><label class="toggle-switch"><input type="checkbox" id="setting-useFullWidth" ${settings.useFullWidth ? 'checked' : ''}><span class="slider"></span></label></label>
                    </div>
                    <div class="settings-section">
                        <h3>Hide Page Elements</h3>
                        <div class="settings-grid">${hideToggles}</div>
                        <label class="settings-toggle"><span>Hide Sidebar (for Full Width)</span><label class="toggle-switch"><input type="checkbox" id="setting-hideSidebar" ${settings.hideSidebar ? 'checked' : ''}><span class="slider"></span></label></label>
                        <label class="settings-toggle"><span>Hide 'More Results' Bar (Endless Scroll)</span><label class="toggle-switch"><input type="checkbox" id="setting-hideMoreResultsBar" ${settings.hideMoreResultsBar ? 'checked' : ''}><span class="slider"></span></label></label>
                        <h4>Toolbar Customization</h4>
                         <div class="settings-grid">
                            <label class="settings-toggle"><span>Hide Google's Default Tools</span><label class="toggle-switch"><input type="checkbox" id="setting-hideDefaultTools" ${settings.hideDefaultTools ? 'checked' : ''}><span class="slider"></span></label></label>
                            <label class="settings-toggle"><span>Show Custom Images</span><label class="toggle-switch"><input type="checkbox" id="setting-showCustomImages" ${settings.showCustomImages ? 'checked' : ''}><span class="slider"></span></label></label>
                            <label class="settings-toggle"><span>Show Custom News</span><label class="toggle-switch"><input type="checkbox" id="setting-showCustomNews" ${settings.showCustomNews ? 'checked' : ''}><span class="slider"></span></label></label>
                            <label class="settings-toggle"><span>Show Custom Videos</span><label class="toggle-switch"><input type="checkbox" id="setting-showCustomVideos" ${settings.showCustomVideos ? 'checked' : ''}><span class="slider"></span></label></label>
                        </div>
                    </div>
                </div>
                <div class="settings-footer"><button id="save-settings">Save & Reload</button></div>
            </div>`;
        document.body.appendChild(overlay);
        document.getElementById('setting-searchBarFont').value = settings.searchBarFont;

        // --- Logic for Site Buttons ---
        let tempSites = JSON.parse(JSON.stringify(customSites));
        const sitesListContainer = document.getElementById('custom-sites-list');
        const renderSitesInPanel = () => {
            sitesListContainer.innerHTML = tempSites.map((site, index) => `
                <div class="site-item" data-index="${index}">
                    <label class="toggle-switch"><input type="checkbox" class="site-enabled" ${site.enabled ? 'checked' : ''}><span class="slider"></span></label>
                    <input type="text" class="site-name" placeholder="Name (e.g., Reddit)" value="${site.name}">
                    <input type="text" class="site-modifier" placeholder="Modifier (e.g., site:reddit.com)" value="${site.modifier}">
                    <button class="delete-site-button">Delete</button>
                </div>`).join('');
        };
        renderSitesInPanel();
        document.getElementById('add-site-button').addEventListener('click', () => { tempSites.push({ name: '', modifier: '', enabled: true }); renderSitesInPanel(); });
        sitesListContainer.addEventListener('input', e => { const i = e.target.closest('.site-item')?.dataset.index; if (i) { if (e.target.classList.contains('site-name')) tempSites[i].name = e.target.value; if (e.target.classList.contains('site-modifier')) tempSites[i].modifier = e.target.value; } });
        sitesListContainer.addEventListener('change', e => { const i = e.target.closest('.site-item')?.dataset.index; if (i && e.target.classList.contains('site-enabled')) tempSites[i].enabled = e.target.checked; });
        sitesListContainer.addEventListener('click', e => { if (e.target.classList.contains('delete-site-button')) { tempSites.splice(e.target.closest('.site-item').dataset.index, 1); renderSitesInPanel(); } });

        // --- Logic for Dropdown Menus ---
        let tempDropdowns = JSON.parse(JSON.stringify(customDropdowns));
        const dropdownsListContainer = document.getElementById('custom-dropdowns-list');
        const renderDropdownsInPanel = () => {
            dropdownsListContainer.innerHTML = tempDropdowns.map((dropdown, dropdownIndex) => `
                <div class="dropdown-editor" data-dropdown-index="${dropdownIndex}">
                    <div class="dropdown-editor-header">
                        <input type="text" class="dropdown-title" placeholder="Dropdown Title" value="${dropdown.title || ''}">
                        <button class="delete-dropdown-button">Delete Dropdown</button>
                    </div>
                    <div class="dropdown-links-list">
                        ${(dropdown.links || []).map((link, linkIndex) => `
                            <div class="link-item" data-link-index="${linkIndex}">
                                <input type="text" class="link-name" placeholder="Link Name" value="${link.name || ''}">
                                <input type="text" class="link-url" placeholder="URL" value="${link.url || ''}">
                                <button class="delete-link-button">Delete</button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="add-link-button settings-button">Add Link</button>
                </div>
            `).join('');
        };
        renderDropdownsInPanel();
        dropdownsListContainer.addEventListener('click', e => {
            const dropdownEditor = e.target.closest('.dropdown-editor');
            if (!dropdownEditor) return;
            const dropdownIndex = parseInt(dropdownEditor.dataset.dropdownIndex, 10);
            if (e.target.classList.contains('delete-dropdown-button')) {
                tempDropdowns.splice(dropdownIndex, 1);
                renderDropdownsInPanel();
            } else if (e.target.classList.contains('add-link-button')) {
                if(!tempDropdowns[dropdownIndex].links) tempDropdowns[dropdownIndex].links = [];
                tempDropdowns[dropdownIndex].links.push({ name: '', url: '' });
                renderDropdownsInPanel();
            } else if (e.target.classList.contains('delete-link-button')) {
                const linkItem = e.target.closest('.link-item');
                if (linkItem) {
                    const linkIndex = parseInt(linkItem.dataset.linkIndex, 10);
                    tempDropdowns[dropdownIndex].links.splice(linkIndex, 1);
                    renderDropdownsInPanel();
                }
            }
        });
        dropdownsListContainer.addEventListener('input', e => {
            const dropdownEditor = e.target.closest('.dropdown-editor');
            if (!dropdownEditor) return;
            const dropdownIndex = parseInt(dropdownEditor.dataset.dropdownIndex, 10);
            if (e.target.classList.contains('dropdown-title')) {
                tempDropdowns[dropdownIndex].title = e.target.value;
            } else {
                const linkItem = e.target.closest('.link-item');
                if (linkItem) {
                    const linkIndex = parseInt(linkItem.dataset.linkIndex, 10);
                    if (e.target.classList.contains('link-name')) tempDropdowns[dropdownIndex].links[linkIndex].name = e.target.value;
                    else if (e.target.classList.contains('link-url')) tempDropdowns[dropdownIndex].links[linkIndex].url = e.target.value;
                }
            }
        });
        document.getElementById('add-dropdown-button').addEventListener('click', () => { tempDropdowns.push({ title: 'New Dropdown', links: [{ name: '', url: '' }] }); renderDropdownsInPanel(); });


        // --- General Panel Logic ---
        const panel = document.getElementById('settings-panel');
        panel.addEventListener('input', e => {
             if (e.target.id === 'setting-resultsWidth') {
                 document.getElementById('width-value').textContent = `${e.target.value}px`;
             }
             if (e.target.id === 'setting-searchBarWidth') {
                 document.getElementById('width-value-searchbar').textContent = `${e.target.value}px`;
             }
             if (e.target.id === 'setting-headerWidth') {
                 document.getElementById('width-value-header').textContent = `${e.target.value}px`;
             }
             updateDynamicStyles(true);
        });
        const closePanel = () => { overlay.remove(); updateDynamicStyles(false); };
        overlay.addEventListener('click', e => { if (e.target === overlay) closePanel(); });
        document.getElementById('close-settings').addEventListener('click', closePanel);
        document.getElementById('save-settings').addEventListener('click', () => {
            const newSettings = {};
            Object.keys(DEFAULT_SETTINGS).forEach(key => {
                const i = document.getElementById(`setting-${key}`);
                if (i) {
                     if (i.tagName === 'SELECT') {
                        newSettings[key] = i.value;
                    } else {
                        newSettings[key] = i.type === 'checkbox' ? i.checked : i.value;
                    }
                } else {
                    if (settings.hasOwnProperty(key)) {
                       newSettings[key] = settings[key];
                    }
                }
            });
            const theme = document.querySelector('input[name="searchBarTheme"]:checked');
            if(theme) newSettings.searchBarTheme = theme.value;

            GM_setValue('gms_settings', JSON.stringify(newSettings));
            GM_setValue('gms_search_sites', JSON.stringify(tempSites.filter(s => s.name && s.modifier)));
            GM_setValue('gms_dropdown_links', JSON.stringify(tempDropdowns.filter(d => d.title && d.links.every(l => l.name && l.url))));
            location.reload();
        });
    }

    function injectStyles() {
        if (document.getElementById(DYNAMIC_STYLE_ID)) return;
        document.head.insertAdjacentHTML('beforeend', `<style id="${DYNAMIC_STYLE_ID}"></style>`);
        GM_addStyle(`
            :root {
                --gms-bg: #f8f9fa; --gms-bg-panel: #ffffff; --gms-text: #202124;
                --gms-border: #dadce0; --gms-accent: #8ab4f8; --gms-input-bg: #f1f3f4;
                --gms-button-hover-bg: #e8e8e8;
            }
            @media (prefers-color-scheme: dark) {
                :root {
                    --gms-bg: #202124; --gms-bg-panel: #292a2d; --gms-text: #e8eaed;
                    --gms-border: #3c4043; --gms-input-bg: #303134;
                    --gms-button-hover-bg: #3c4043;
                }
            }
            #gms-settings-cog { cursor: pointer; background: transparent; border: none; padding: 8px; border-radius: 50%; display: grid; place-items: center; margin: 0 8px; }
            #gms-settings-cog:hover { background-color: rgba(128,128,128,0.2); }
            #gms-settings-cog svg { fill: currentColor; width: 24px; height: 24px; }
            #gms-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; }
            #settings-panel { background: var(--gms-bg-panel); color: var(--gms-text); width: 95%; max-width: 800px; max-height: 90vh; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; border: 1px solid var(--gms-border); }
            .settings-header { padding: 16px 24px; border-bottom: 1px solid var(--gms-border); display: flex; justify-content: space-between; align-items: center; }
            .settings-header h2 { margin: 0; font-size: 1.25rem; }
            .settings-header #close-settings { background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--gms-text); padding: 0 8px; }
            .settings-body { padding: 8px 24px; overflow-y: auto; }
            .settings-section { margin-top: 20px; border-top: 1px solid var(--gms-border); padding-top: 20px; }
            .settings-section:first-child { border-top: none; }
            .settings-section h3, .settings-section h4 { margin-bottom: 16px; padding-bottom: 8px; font-size: 1.1rem; }
            .settings-section h4 { font-size: 1rem; margin-top: 16px; }
            .settings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 8px; }
            .settings-row, .settings-toggle { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 8px 0; }
            input[type="range"] { flex-grow: 1; margin-left: 15px; accent-color: var(--gms-accent); }
            #setting-searchBarFont { background-color: var(--gms-input-bg); color: var(--gms-text); border: 1px solid var(--gms-border); border-radius: 4px; padding: 4px 8px; }
            .radio-group { display: flex; gap: 20px; }
            .settings-footer { padding: 16px 24px; border-top: 1px solid var(--gms-border); text-align: right; }
            .settings-button, #save-settings { background-color: var(--gms-accent); color: var(--gms-bg); border: none; font-size: 0.9rem; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: opacity 0.2s; }
            #save-settings { font-size: 1rem; padding: 10px 20px; }
            .settings-button:hover, #save-settings:hover { opacity: 0.85; }
            .toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; flex-shrink: 0; }
            .toggle-switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 24px; }
            .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: var(--gms-accent); }
            input:checked + .slider:before { transform: translateX(20px); }
            #custom-sites-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
            .site-item { display: grid; grid-template-columns: auto 1fr 2fr auto; gap: 10px; align-items: center; }
            .site-item input[type="text"], .link-item input[type="text"], .dropdown-title { width: 100%; padding: 6px 10px; background-color: var(--gms-input-bg); border: 1px solid var(--gms-border); border-radius: 6px; color: var(--gms-text); }
            .delete-site-button, .delete-dropdown-button, .delete-link-button { background: #c93a3a; color: white; border: none; border-radius: 6px; padding: 6px 10px; cursor: pointer; }
            #custom-dropdowns-list { display: flex; flex-direction: column; gap: 24px; margin-bottom: 16px; }
            .dropdown-editor { border: 1px solid var(--gms-border); border-radius: 8px; padding: 12px; }
            .dropdown-editor-header { display: flex; gap: 10px; align-items: center; margin-bottom: 12px; }
            .dropdown-editor-header .dropdown-title { flex-grow: 1; font-weight: bold; font-size: 1.1em; }
            .dropdown-links-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
            .link-item { display: grid; grid-template-columns: 1fr 2fr auto; gap: 10px; align-items: center; }
            .add-link-button { background-color: #3a8d4a; color: white; }
            #gms-custom-tools .LatpMc { padding: 0 12px; border-radius: 18px; margin: 0 4px; transition: background-color 0.15s ease-in-out; text-decoration: none !important; display: inline-flex; align-items: center; height: 36px; box-sizing: border-box; background-color: var(--gms-input-bg); }
            #gms-custom-tools .LatpMc:hover { background-color: var(--gms-button-hover-bg); }
            .YmvwI.gms-dropdown { position: relative; padding-bottom: 8px; margin-bottom: -8px; }
            .gms-dropdown-menu { display: none; position: absolute; top: 100%; left: 0; z-index: 1000; background-color: var(--gms-bg-panel); border: 1px solid var(--gms-border); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 220px; padding: 8px 0; }
            .YmvwI.gms-dropdown:hover .gms-dropdown-menu { display: block; }
            .gms-dropdown-item { display: block; padding: 8px 16px; color: var(--gms-text); text-decoration: none; font-size: 14px; white-space: nowrap; }
            .gms-dropdown-item:hover { background-color: var(--gms-input-bg); }
        `);
    }

    // --- Initialization ---
    async function init() {
        const savedSettings = JSON.parse(await GM_getValue('gms_settings', '{}'));
        settings = { ...DEFAULT_SETTINGS, ...savedSettings };
        const savedSites = await GM_getValue('gms_search_sites', null);
        customSites = savedSites ? JSON.parse(savedSites) : DEFAULT_SITES;
        const savedDropdowns = await GM_getValue('gms_dropdown_links', null);
        customDropdowns = savedDropdowns ? JSON.parse(savedDropdowns) : DEFAULT_DROPDOWNS;


        new MutationObserver((_, obs) => {
            if (document.getElementById('rso')) {
                injectStyles();
                updateDynamicStyles();
                if (settings.endlessGoogle) endlessGoogle.init();
                if (settings.restoreFullURLs) pageModifier.init();
                if (settings.useClassicFavicon && document.head) classicFavicon.init();
                obs.disconnect();
            }
        }).observe(document.documentElement, { childList: true, subtree: true });

        new MutationObserver((_, obs) => {
            const headerActions = document.querySelector('#gbwa');
            if (headerActions && !document.getElementById('gms-settings-cog')) {
                const cogSVG = `<svg focusable="false" viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.69-1.62-0.92L14.4,2.23c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.44,0.17-0.48,0.41L9.2,4.65c-0.59,0.23-1.12,0.54-1.62,0.92L5.19,4.61c-0.22-0.08-0.47,0-0.59,0.22L2.69,8.15 c-0.11,0.2-0.06,0.47,0.12,0.61l2.03,1.58C4.78,10.69,4.76,11,4.76,11.33c0,0.33,0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.69,1.62,0.92L9.6,21.77 c0.04,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.48-0.41l0.41-2.42c0.59-0.23,1.12-0.54,1.62-0.92l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.11-0.2,0.06-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path></svg>`;
                const cog = document.createElement('button');
                cog.id = 'gms-settings-cog';
                cog.title = 'Configure Multi Search';
                cog.innerHTML = cogSVG;
                cog.addEventListener('click', showSettingsPanel);
                headerActions.insertAdjacentElement('beforebegin', cog);
            }
        }).observe(document.documentElement, { childList: true, subtree: true });

        new MutationObserver((_, obs) => {
            const anchor = document.querySelector('#hdtb-tls');
            const alreadyExists = document.getElementById('gms-custom-tools');
            const toolbar = document.querySelector('#hdtb-msb');

            if (toolbar) {
                updateDynamicStyles();
            }

            if (anchor && !alreadyExists) {
                renderCustomTools();
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
    }

    init();

})();

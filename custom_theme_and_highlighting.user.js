// ==UserScript==
// @name        DreamGen XP Theme
// @namespace   Violentmonkey Scripts
// @match       https://dreamgen.com/app/*
// @grant       none
// @author      aeroraphxp
// @description CSS Customization!
// ==/UserScript==

(function() {
    'use strict';

    const themes = [
        'default',
        'custom',
        'lavender',
    ];

    // CUSTOM SETTINGS
    const options = {
        theme: 0,
        customCSS: ``, // Make your own theme
        incrementalCustomCss: "", // Add CSS On top of another theme
        enableHighlighting: true, // Toggle highlighting on/off
        highlightingRules: [
            [/[\s\S]+/g, "rgba(255, 255, 255, 0)", "", "0", 0], // ALL
            [/[“"]([^”"]+)[”"]/g, "rgb(186, 157, 212)", "black", "2", 0], // For dialogue quotes
            [/[*]([^*]+)[*]/g, "rgb(231, 184, 245)", "black", "2", 1], // For emphasis
        ],
    };

    // ================================

    // Inject custom CSS into the page
    function injectCustomCSS(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    if (options.theme >= 2) {
        const themes_css = [
            // Lavender theme
            `
            textarea {
                color: rgba(255, 255, 255, 1);
            }

            body {
                color: rgba(215, 95, 226, 1);
                background-image: linear-gradient(to right, rgba(23, 8, 24, 1), rgba(230, 160, 24, 1));
                font-family: "Georgia", serif;
            }

            div.flex {
                background-color: rgba(23, 8, 24, 1);
                font-family: "Georgia", serif;
            }

            a.flex {
                background-color: rgba(23, 8, 24, .1);
                font-style: italic;
            }
            `
        ];
        injectCustomCSS(themes_css[options.theme - 2]);
    } else if (options.theme == 1) {
        injectCustomCSS(options.customCSS);
    }
    injectCustomCSS(options.incrementalCustomCss);

    // Highlighting text based on rules
    if (options.enableHighlighting) {
        function highlightText(text) {
            let highlightedText = text;

            options.highlightingRules.forEach(rule => {
                const [regex, textColor, shineColor, textGlowSize, regexMatch] = rule;
                let match;

                // Apply the regex to find matches in the text
                while ((match = regex.exec(text)) !== null) {
                    const matchedText = match[regexMatch];

                    const highlighted = `<span style="color: ${textColor}; text-shadow: 0 0 ${textGlowSize}px ${shineColor}, 0 0 ${textGlowSize}px ${shineColor};">${matchedText}</span>`;

                    highlightedText = highlightedText.replace(matchedText, highlighted);
                }
            });

            return highlightedText;
        }

        // Function to create and position overlay on textarea
        function createOverlay(textarea) {
            const updateOverlayPosition = () => {
                const rect = textarea.getBoundingClientRect();
                const parent = textarea.closest('.text-sm.lg\\:text-base.relative.flex.flex-row.p-3.focus-within\\:bg-muted\\/30');
                if (!parent) return;

                const overlay = parent.querySelector('.overlay');
                if (overlay) {
                    // Recalculate the overlay position and size using getBoundingClientRect
                    const parentRect = parent.getBoundingClientRect();

                    overlay.style.position = 'absolute';
                    overlay.style.top = `${rect.top - parentRect.top}px`; // Position relative to parent
                    overlay.style.left = `${rect.left - parentRect.left}px`; // Position relative to parent
                    overlay.style.width = `${rect.width}px`;
                    overlay.style.height = `${rect.height}px`;
                }
            };

            const updateOverlayContent = () => {
                const text = textarea.value;
                const overlay = textarea.closest('.text-sm.lg\\:text-base.relative.flex.flex-row.p-3.focus-within\\:bg-muted\\/30').querySelector('.overlay');
                if (overlay) {
                    overlay.innerHTML = highlightText(text);
                }
            };

            const existingOverlay = textarea.closest('.text-sm.lg\\:text-base.relative.flex.flex-row.p-3.focus-within\\:bg-muted\\/30').querySelector('.overlay');
            if (!existingOverlay) {
                const overlay = document.createElement('div');
                overlay.classList.add('overlay');
                overlay.style.position = 'absolute';
                overlay.style.pointerEvents = 'none';
                overlay.style.backgroundColor = 'transparent';
                overlay.style.color = 'inherit';
                overlay.style.whiteSpace = 'pre-wrap';
                overlay.style.overflowWrap = 'break-word';
                overlay.style.padding = window.getComputedStyle(textarea).padding;
                overlay.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
                overlay.style.fontSize = window.getComputedStyle(textarea).fontSize;
                overlay.style.lineHeight = window.getComputedStyle(textarea).lineHeight;
                overlay.style.zIndex = '1';

                const parent = textarea.closest('.text-sm.lg\\:text-base.relative.flex.flex-row.p-3.focus-within\\:bg-muted\\/30');
                if (parent) {
                    parent.appendChild(overlay);
                }

                textarea.addEventListener('scroll', () => {
                    overlay.scrollTop = textarea.scrollTop;
                    overlay.scrollLeft = textarea.scrollLeft;
                });

                // Update the overlay position and content
                updateOverlayPosition();
                updateOverlayContent();

                textarea.addEventListener('input', updateOverlayContent);
            }

            // Recalculate overlay position and content periodically when necessary
            updateOverlayPosition();
            updateOverlayContent();
        }

        // Function to initialize overlay on all relevant textareas
        function initialize() {
            const textareas = document.querySelectorAll("textarea");
            textareas.forEach((textarea) => {
                if (textarea.id && textarea.id.startsWith('interaction-') && !textarea.dataset.hasOverlay) {
                    textarea.dataset.hasOverlay = 'true';
                    createOverlay(textarea);
                }
            });
        }

        // Observe mutations in the document to handle dynamically added textareas
        const observer = new MutationObserver(initialize);
        observer.observe(document.body, { childList: true, subtree: true });

        // Initialize on page load
        initialize();

        // Add confirmation on window resize
        window.addEventListener('resize', () => {
            const userResponse = confirm('The window has been resized. Would you like to refresh the page to fix the overlay position?');
            if (userResponse) {
                location.reload(); // Refresh the page if the user agrees
            }
        });
    }
})();

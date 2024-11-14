// ==UserScript==
// @name        DreamGen XP Theme
// @namespace   Violentmonkey Scripts
// @match       https://dreamgen.com/app/*
// @grant       none
// @description CSS Customization!
// ==/UserScript==

(function () {
    'use strict';

    const themes = ['default', 'custom', 'lavender'];

    const options = {
        theme: 0,
        customCSS: ``,
        incrementalCustomCss: "",
        enableHighlighting: true,
        highlightingRules: [
            [/[\s\S]+/g, "rgba(255, 255, 255, 0)", "", "0", 0],
            [/[“"]([^”"]+)[”"]/g, "rgb(186, 157, 212)", "black", "2", 0],
            [/[*]([^*]+)[*]/g, "rgb(231, 184, 245)", "black", "2", 1],
        ],
    };


    function injectCustomCSS(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    if (options.theme >= 2) {
        const themes_css = [
            `
            textarea { color: rgba(255, 255, 255, 1); }
            body { color: rgba(215, 95, 226, 1); background-image: linear-gradient(to right, rgba(23, 8, 24, 1), rgba(230, 160, 24, 1)); }
            div.flex { background-color: rgba(23, 8, 24, 1); }
            a.flex { background-color: rgba(23, 8, 24, .1); font-style: italic; }
            `
        ];
        injectCustomCSS(themes_css[options.theme - 2]);
    } else if (options.theme == 1) {
        injectCustomCSS(options.customCSS);
    }
    injectCustomCSS(options.incrementalCustomCss);

    if (options.enableHighlighting) {
        function highlightText(text) {
            let highlightedText = text;
            options.highlightingRules.forEach(rule => {
                const [regex, textColor, shineColor, textGlowSize, regexMatch] = rule;
                let match;
                while ((match = regex.exec(text)) !== null) {
                    const matchedText = match[regexMatch];
                    const highlighted = `<span style="color: ${textColor}; text-shadow: 0 0 ${textGlowSize}px ${shineColor};">${matchedText}</span>`;
                    highlightedText = highlightedText.replace(matchedText, highlighted);
                }
            });
            return highlightedText;
        }

        function createOverlay(textarea) {
            const updateOverlayPosition = () => {
                const rect = textarea.getBoundingClientRect();
                const parent = textarea.closest('.text-sm.lg\\:text-base.relative.flex.flex-row.p-3.focus-within\\:bg-muted\\/30');
                if (!parent) return;

                const overlay = parent.querySelector('.overlay');
                if (overlay) {
                    const parentRect = parent.getBoundingClientRect();
                    overlay.style.top = `${rect.top - parentRect.top}px`;
                    overlay.style.left = `${rect.left - parentRect.left}px`;
                    overlay.style.width = `${rect.width}px`;
                    overlay.style.height = `${rect.height}px`;
                }
            };

            const updateOverlayContent = () => {
                const text = textarea.value;
                const parent = textarea.closest('.text-sm.lg\\:text-base.relative.flex.flex-row.p-3.focus-within\\:bg-muted\\/30');
                const overlay = parent ? parent.querySelector('.overlay') : null;
                if (overlay) {
                    overlay.innerHTML = highlightText(text);
                }
            };

            const parent = textarea.closest('.text-sm.lg\\:text-base.relative.flex.flex-row.p-3.focus-within\\:bg-muted\\/30');
            if (parent && textarea.dataset.hasOverlay != "true") {
                textarea.dataset.hasOverlay = true;

                const overlay = document.createElement('div');
                overlay.classList.add('overlay');
                overlay.style.position = 'absolute';
                overlay.style.pointerEvents = 'none';
                overlay.style.backgroundColor = 'transparent';
                overlay.style.color = 'inherit';
                overlay.style.whiteSpace = 'pre-wrap';
                overlay.style.overflowWrap = 'break-word';
                overlay.style.zIndex = '1';
                overlay.style.padding = window.getComputedStyle(textarea).padding;
                overlay.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
                overlay.style.fontSize = window.getComputedStyle(textarea).fontSize;
                overlay.style.lineHeight = window.getComputedStyle(textarea).lineHeight;

                parent.appendChild(overlay);

                textarea.addEventListener('scroll', () => {
                    overlay.scrollTop = textarea.scrollTop;
                    overlay.scrollLeft = textarea.scrollLeft;
                });

                textarea.addEventListener('input', updateOverlayContent);
                updateOverlayPosition();
                updateOverlayContent();
            }
        }

        function deleteOverlays() {
            const overlays = document.querySelectorAll('.overlay');
            overlays.forEach(overlay => {
                const parent = overlay.closest('.text-sm.lg\\:text-base.relative.flex.flex-row.p-3.focus-within\\:bg-muted\\/30');
                if (parent) {
                    const textarea = parent.querySelector('textarea');
                    if (textarea) {
                        textarea.dataset.hasOverlay = false; // Reset the flag properly
                    }
                }
                overlay.remove();
            });
        }

        function initialize() {
            const textareas = document.querySelectorAll("textarea");
            textareas.forEach((textarea) => {
                //debugger;
                if (textarea.id && textarea.id.startsWith('interaction-') && textarea.dataset.hasOverlay != "true") {
                    createOverlay(textarea);
                }
            });
        }

        const observer = new MutationObserver(initialize);
        observer.observe(document.body, { childList: true, subtree: true });

        initialize();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                deleteOverlays(); // Delete existing overlays
                initialize();     // Recreate overlays
            }, 0);
        });
    }
})();

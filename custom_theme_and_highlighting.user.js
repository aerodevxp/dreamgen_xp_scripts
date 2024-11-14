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

    // CUSTOM SETTINGS
    const options = {
        enableHighlighting: true, // Toggle highlighting on/off
        highlightingRules: [
            [/[\s\S]+/g, "rgba(255, 255, 255, 0)", "", "0", 0], //ALL
            [/[“"]([^”"]+)[”"]/g, "rgb(221, 198, 115)", "black", "2", 0], // For dialogue quotes
            [/[*]([^*]+)[*]/g, "rgb(221, 115, 115)", "red", "2", 1], // For emphasis
        ],
    };
    // ================================

    // Highlighting
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

        function createOverlay(textarea) {
            const updateOverlayPosition = () => {
                const rect = textarea.getBoundingClientRect();
                const parent = textarea.closest('.text-sm.lg\\:text-base.relative.flex.flex-row.p-3.focus-within\\:bg-muted\\/30');
                if (!parent) return;

                const overlay = parent.querySelector('.overlay');
                if (overlay) {
                    overlay.style.top = `${textarea.offsetTop}px`;
                    overlay.style.left = `${textarea.offsetLeft}px`;
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

                updateOverlayPosition();
                updateOverlayContent();

                textarea.addEventListener('input', updateOverlayContent);
            }

            setInterval(() => {
                updateOverlayPosition();
                updateOverlayContent();
            }, 300);
        }

        function initialize() {
            const textareas = document.querySelectorAll("textarea");
            textareas.forEach((textarea) => {
                if (textarea.id && textarea.id.startsWith('interaction-') && !textarea.dataset.hasOverlay) {
                    textarea.dataset.hasOverlay = 'true';
                    // Create overlay only if highlighting is enabled
                    createOverlay(textarea);
                }
            });
        }

        const observer = new MutationObserver(initialize);
        observer.observe(document.body, { childList: true, subtree: true });

        initialize();
    }

})();

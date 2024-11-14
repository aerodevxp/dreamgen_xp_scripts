// ==UserScript==
// @name         Quick Generate & Regenerate
// @namespace    http://tampermonkey.net/
// @description  Simulate button clicks using keyboard shortcuts (Ctrl+Enter and Alt+R mainly)
// @author       aeroraphxp
// @match        https://dreamgen.com/app/stories/v2/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a click on a button
    function simulateClick(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.click();
        }
    }

    // Listen for keyboard events
    document.addEventListener('keydown', function(event) {
        // Ctrl + Enter
        if (event.ctrlKey && event.key === 'Enter') {
            simulateClick("body > div.flex.flex-col.h-full > div.h-full.flex.flex-col.lg\\:pl-48 > div.page-content-wrapper > div > div > div.flex.h-full.w-full.max-w-5xl > div > div.focus-within\\:border-muted-foreground\\/50.flex.flex-row.items-center.justify-between.webkit-padding-right-12px > div.flex.flex-row.gap-x-3 > button.inline-flex.items-center.justify-center.whitespace-nowrap.text-sm.font-medium.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-1.focus-visible\\:ring-ring.disabled\\:pointer-events-none.disabled\\:opacity-50.bg-secondary.text-secondary-foreground.shadow-sm.hover\\:bg-secondary\\/80.h-9.px-4.py-2.rounded-md");
        }

        // Alt + R
        if (event.altKey && event.key === 'r') {
            simulateClick("body > div.flex.flex-col.h-full > div.h-full.flex.flex-col.lg\\:pl-48 > div.page-content-wrapper > div > div > div.flex.h-full.w-full.max-w-5xl > div > div.focus-within\\:border-muted-foreground\\/50.flex.flex-row.items-center.justify-between.webkit-padding-right-12px > div.flex.flex-row.gap-x-3 > button.inline-flex.items-center.justify-center.whitespace-nowrap.text-sm.font-medium.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-1.focus-visible\\:ring-ring.disabled\\:pointer-events-none.disabled\\:opacity-50.hover\\:bg-accent.hover\\:text-accent-foreground.h-9.w-9.shrink-0.rounded-md");
        }
    });
})();

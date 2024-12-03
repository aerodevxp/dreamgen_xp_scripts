// ==UserScript==
// @name         Quick Generate & Regenerate
// @namespace    http://tampermonkey.net/
// @description  Simulate button clicks using keyboard shortcuts (Ctrl+Enter and Alt+R mainly)
// @author       aeroraphxp
// @match        https://dreamgen.com/app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a click on a button
    function simulateClick(selector) {
        const button = document.querySelector(selector);
        if (button) {
            console.log("Simulating Click!");
            button.click();
        }
    }

    // Listen for keyboard events
    document.addEventListener('keydown', function(event) {
        // Ctrl + Enter
        if (event.ctrlKey && event.key === 'Enter') {
            //Story Button
            simulateClick("body > div.flex.flex-col.h-full > div.h-full.flex.flex-col.lg\\:pl-48 > div.page-content-wrapper > div > div > div.flex.h-full.w-full.max-w-5xl > div > div.focus-within\\:border-muted-foreground\\/50.flex.flex-row.items-center.justify-between.webkit-padding-right-12px > div.flex.flex-row.gap-x-3 > button.inline-flex.items-center.justify-center.whitespace-nowrap.text-sm.font-medium.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-1.focus-visible\\:ring-ring.disabled\\:pointer-events-none.disabled\\:opacity-50.bg-secondary.text-secondary-foreground.shadow-sm.hover\\:bg-secondary\\/80.h-9.px-4.py-2.rounded-md");
            //RP Button
            const RPCONTINUE = "#interaction-editor-R2htttttsrltsrla > div.flex.flex-col.w-full > div.flex.flex-col.gap-y-2.pb-0\\.5 > div.flex.flex-row.items-center.justify-between.gap-x-2 > div.flex.flex-row.items-center.gap-x-2 > button"
            simulateClick(RPCONTINUE)
            //Sandbox
            simulateClick("body > div.flex.flex-col.h-full > div.h-full.flex.flex-col.lg\\:pl-48 > div.page-content-wrapper > div > div > div.flex.flex-col.h-full.w-full.lg\\:max-w-screen-md.overflow-hidden > div.flex.flex-row.justify-between.mt-2.px-1.webkit-padding-right-12px > div > button")
        }

        // Alt + R
        if (event.altKey && event.key === 'r') {
            //Story
            simulateClick("body > div.flex.flex-col.h-full > div.h-full.flex.flex-col.lg\\:pl-48 > div.page-content-wrapper > div > div > div.flex.h-full.w-full.max-w-5xl > div > div.focus-within\\:border-muted-foreground\\/50.flex.flex-row.items-center.justify-between.webkit-padding-right-12px > div.flex.flex-row.gap-x-3 > button.inline-flex.items-center.justify-center.whitespace-nowrap.text-sm.font-medium.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-1.focus-visible\\:ring-ring.disabled\\:pointer-events-none.disabled\\:opacity-50.hover\\:bg-accent.hover\\:text-accent-foreground.h-9.w-9.shrink-0.rounded-md");
            //RP
            simulateClick("body > div.flex.flex-col.h-full > div.h-full.flex.flex-col.lg\\:pl-48 > div.page-content-wrapper > div > div > div.flex.flex-col.h-full.justify-between.w-full.lg\\:max-w-7xl.overflow-hidden.mx-auto > div.flex.flex-col.gap-y-2.overflow-auto.custom-scrollbar.dark.pr-0\\.5.pb-2 > div.pl-10.flex.flex-row.justify-between.w-full.leading-none > div > button")
        }
    });
})();

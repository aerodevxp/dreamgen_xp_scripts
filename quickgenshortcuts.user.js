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
            simulateClick("button.px-4:nth-child(2)");
            //RP Button
            const RPCONTINUE = "button.bg-primary"
            simulateClick(RPCONTINUE)
            //Sandbox
            simulateClick("body > div.flex.flex-col.h-full > div.h-full.flex.flex-col.lg\\:pl-48 > div.page-content-wrapper > div > div > div.flex.flex-col.h-full.w-full.lg\\:max-w-screen-md.overflow-hidden > div.flex.flex-row.justify-between.mt-2.px-1.webkit-padding-right-12px > div > button")
        }

        // Alt + R
        if (event.altKey && event.key === 'r') {
            //Story
            simulateClick("button.w-9:nth-child(1)");
            //RP
            simulateClick("html.dark body.__variable_d65c78.__variable_86777a.__variable_9736f3.font-sans div.flex.flex-col.h-full div.h-full.flex.flex-col.lg:pl-48 div.page-content-wrapper div.page-content.w-full.max-w-none div.flex.flex-row.overflow-hidden.h-full.gap-x-2.justify-between div.flex.flex-col.h-full.justify-between.w-full.lg:max-w-7xl.overflow-hidden.mx-auto div.flex.flex-col.gap-y-2.overflow-auto.custom-scrollbar.dark.pr-0.5.pb-2 div.pl-10.flex.flex-row.justify-between.w-full.leading-none div.mx-auto button.inline-flex.items-center.justify-center.whitespace-nowrap.text-sm.font-medium.transition-colors.focus-visible:outline-none.focus-visible:ring-1.focus-visible:ring-ring.disabled:pointer-events-none.disabled:opacity-50.hover:bg-accent.hover:text-accent-foreground.shrink-0.rounded-md.h-5.w-10")
        }
    });
})();

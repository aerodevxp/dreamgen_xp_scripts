// ==UserScript==
// @name         Chapter Outline Navigation
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds an outline button to navigate chapters in textareas
// @author       aeroraphxp
// @match        https://dreamgen.com/app/*
// @downloadURL  https://github.com/aerodevxp/dreamgen_xp_scripts/raw/refs/heads/main/storyoutline_TOC.user.js
// @updateURL    https://github.com/aerodevxp/dreamgen_xp_scripts/raw/refs/heads/main/storyoutline_TOC.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define the target URL start
    const targetUrlStart = "https://dreamgen.com/app/stories/v2/chapter/";

    // Function to check if the URL matches and run the script logic
    function checkAndRunScript() {
        if (window.location.href.startsWith(targetUrlStart)) {
            initOutlineNavigation(); // Run the main script logic
        }
    }

    // Main script logic wrapped in a function
    function initOutlineNavigation() {
        // Avoid running the script multiple times
        if (document.querySelector('.outline-button-initialized')) return;

        // Pattern to match chapters (anything surrounded by *** on each side)
        const chapterPattern = /\*\*\*(.*?)\*\*\*/g;

        // Function to extract chapters from textareas
        function extractChapters() {
            const textAreas = document.querySelectorAll('textarea');
            const chapters = [];

            textAreas.forEach((textarea, index) => {
                const matches = [...textarea.value.matchAll(chapterPattern)];
                matches.forEach(match => {
                    const chapterTitle = match[1].trim();
                    const position = match.index;
                    chapters.push({
                        title: chapterTitle || `Untitled Chapter ${index + 1}`,
                        textarea,
                        position
                    });
                });
            });

            return chapters;
        }

        // Function to scroll to a specific chapter
        function scrollToChapter(chapter) {
            const { textarea, position } = chapter;
            const scrollPosition = getCharacterScrollPosition(textarea, position);
            textarea.selectionStart = textarea.selectionEnd = position;

            textarea.blur();
            textarea.focus();

            setTimeout(() => {
                textarea.scrollTop = scrollPosition;
            }, 10);
        }

        // Calculate the scroll position based on the chapter's position
        function getCharacterScrollPosition(textarea, position) {
            const textBeforeChapter = textarea.value.substring(0, position);
            const linesBeforeChapter = textBeforeChapter.split('\n').length;
            const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
            return linesBeforeChapter * lineHeight;
        }

        // Create the Outline button
        const outlineButton = document.createElement('button');
        outlineButton.textContent = 'Outline';
        outlineButton.classList.add('outline-button-initialized'); // Mark as initialized
        outlineButton.style.position = 'fixed';
        outlineButton.style.top = '72px';
        outlineButton.style.padding = '6.3px';
        outlineButton.style.backgroundColor = '#27272a';
        outlineButton.style.color = 'white';
        outlineButton.style.border = 'none';
        outlineButton.style.borderRadius = '5px';
        outlineButton.style.cursor = 'pointer';
        outlineButton.style.zIndex = '39';

        // Adjust button position based on window width
        function adjustButtonPosition() {
            if (window.innerWidth < 1280) {
                outlineButton.style.right = '120px';
                outlineButton.style.top = '60px';
            } else {
                outlineButton.style.right = '160px';
                outlineButton.style.top = '72px';
            }
        }

        // Mini menu container
        const menu = document.createElement('div');
        menu.style.position = 'absolute';
        menu.style.backgroundColor = '#27272a';
        menu.style.color = 'white';
        menu.style.borderRadius = '5px';
        menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        menu.style.display = 'none';
        menu.style.padding = '10px';
        menu.style.zIndex = '40';
        menu.style.maxHeight = '250px';
        menu.style.overflowY = 'auto';

        // Open the menu
        function showMenu() {
            const chapters = extractChapters();
            menu.innerHTML = ''; // Clear the menu

            if (chapters.length === 0) {
                const noChapters = document.createElement('div');
                noChapters.textContent = 'No chapters found!';
                menu.appendChild(noChapters);
            } else {
                chapters.forEach((chapter, index) => {
                    const chapterButton = document.createElement('button');
                    chapterButton.textContent = `${index + 1}. ${chapter.title}`;
                    chapterButton.style.display = 'block';
                    chapterButton.style.marginBottom = '5px';
                    chapterButton.style.padding = '7px';
                    chapterButton.style.backgroundColor = '#444';
                    chapterButton.style.color = 'white';
                    chapterButton.style.border = 'none';
                    chapterButton.style.borderRadius = '5px';
                    chapterButton.style.cursor = 'pointer';
                    chapterButton.style.width = '100%';

                    // Scroll to the chapter when clicked
                    chapterButton.addEventListener('click', () => {
                        scrollToChapter(chapter);
                        menu.style.display = 'none'; // Close the menu after clicking
                    });

                    menu.appendChild(chapterButton);
                });
            }

            const buttonRect = outlineButton.getBoundingClientRect();
            menu.style.top = `${buttonRect.bottom + 10}px`;
            menu.style.right = `50px`;
            menu.style.display = 'block';
        }

        // Toggle menu visibility on button click
        outlineButton.addEventListener('click', () => {
            if (menu.style.display === 'none') {
                showMenu();
            } else {
                menu.style.display = 'none';
            }
        });

        // Adjust the button position
        adjustButtonPosition();
        window.addEventListener('resize', adjustButtonPosition);

        // Append elements to the DOM
        document.body.appendChild(outlineButton);
        window.addEventListener('resize', () => {
            if (menu.style.display === 'block') {
                showMenu();
            }
        });
    }

    // Monitor URL changes dynamically
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            checkAndRunScript();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    checkAndRunScript();
})();

// ==UserScript==
// @name         Chapter Outline Navigation
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds an outline button to navigate chapters in textareas
// @author       aeroraphxp
// @match        https://dreamgen.com/app/stories/v2/chapter/*
// @downloadURL https://github.com/aerodevxp/dreamgen_xp_scripts/raw/refs/heads/main/storyoutline_TOC.user.js
// @updateURL https://github.com/aerodevxp/dreamgen_xp_scripts/raw/refs/heads/main/storyoutline_TOC.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

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

    // Function to scroll to a specific chapter based on the position within the correct textarea
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

    // Function to calculate the scroll position based on the chapter's position (character position)
    function getCharacterScrollPosition(textarea, position) {
        const textBeforeChapter = textarea.value.substring(0, position);
        const linesBeforeChapter = textBeforeChapter.split('\n').length;
        const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
        const scrollPosition = linesBeforeChapter * lineHeight;

        return scrollPosition;
    }

    // Create the Outline button
    const outlineButton = document.createElement('button');
    outlineButton.textContent = 'Outline';
    outlineButton.style.position = 'fixed';
    outlineButton.style.top = '72px';
    outlineButton.style.padding = '6.3px';
    outlineButton.style.backgroundColor = '#27272a';
    outlineButton.style.color = 'white';
    outlineButton.style.border = 'none';
    outlineButton.style.borderRadius = '5px';
    outlineButton.style.cursor = 'pointer';
    outlineButton.style.zIndex = '39';

    // Adjust the position of the Outline button based on window width
    function adjustButtonPosition() {
        if (window.innerWidth < 1280) {
            outlineButton.style.right = '120px'; // Move the button closer to the right edge
            outlineButton.style.top = '60px';
        } else {
            outlineButton.style.right = '160px'; // Default position
            outlineButton.style.top = '72px';
        }
    }

    // Create the mini menu container
    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.backgroundColor = '#27272a';
    menu.style.color = 'white';
    menu.style.borderRadius = '5px';
    menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    menu.style.display = 'none';
    menu.style.padding = '10px';
    menu.style.zIndex = '40';
    menu.style.maxHeight = '250px';  // Limit height of the menu
    menu.style.overflowY = 'auto';   // Enable vertical scrolling if content exceeds max height

    // Function to open the menu
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

        // Position the menu below the button and center it
        document.body.appendChild(menu); // Append to calculate width
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

    // Adjust the button position based on window size
    adjustButtonPosition();
    window.addEventListener('resize', adjustButtonPosition);

    // Append the button and menu to the body
    document.body.appendChild(outlineButton);

    // Adjust menu position on window resize
    window.addEventListener('resize', () => {
        if (menu.style.display === 'block') {
            showMenu();
        }
    });
})();

// ==UserScript==
// @name         Chapter Outline Navigation
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds an outline button to navigate chapters
// @author       aeroraphxp
// @match        https://dreamgen.com/app/stories/v2/chapter/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const chapterPattern = /\*\*\*(.*?)\*\*\*/g;

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

    function getCharacterScrollPosition(textarea, position) {
        const textBeforeChapter = textarea.value.substring(0, position);
        const linesBeforeChapter = textBeforeChapter.split('\n').length;
        const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
        const scrollPosition = linesBeforeChapter * lineHeight;

        return scrollPosition;
    }

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

    function adjustButtonPosition() {
        if (window.innerWidth < 1280) {
            outlineButton.style.right = '120px';
            outlineButton.style.top = '60px';
        } else {
            outlineButton.style.right = '160px';
            outlineButton.style.top = '72px';
        }
    }

    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.backgroundColor = '#27272a';
    menu.style.color = 'white';
    menu.style.borderRadius = '5px';
    menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    menu.style.display = 'none';
    menu.style.padding = '10px';
    menu.style.zIndex = '1001';
    menu.style.maxHeight = '250px';
    menu.style.overflowY = 'auto';

    function showMenu() {
        const chapters = extractChapters();
        menu.innerHTML = '';

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

                chapterButton.addEventListener('click', () => {
                    scrollToChapter(chapter);
                    menu.style.display = 'none';
                });

                menu.appendChild(chapterButton);
            });
        }

        document.body.appendChild(menu);
        const buttonRect = outlineButton.getBoundingClientRect();
        menu.style.top = `${buttonRect.bottom + 10}px`;
        menu.style.right = `50px`;

        menu.style.display = 'block';
    }

    outlineButton.addEventListener('click', () => {
        if (menu.style.display === 'none') {
            showMenu();
        } else {
            menu.style.display = 'none';
        }
    });

    adjustButtonPosition();
    window.addEventListener('resize', adjustButtonPosition);

    document.body.appendChild(outlineButton);

    window.addEventListener('resize', () => {
        if (menu.style.display === 'block') {
            showMenu();
        }
    });
})();

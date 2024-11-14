// ==UserScript==
// @name         Clean Quick Export (As Plain TXT)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Export text from multiple text fields to clipboard or a .txt file with a UI button that responds to window width
// @author       aeroraphxp
// @match        https://dreamgen.com/app/stories/v2/chapter/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getCombinedText() {
        const textFields = document.querySelectorAll('textarea, input[type="text"]');
        let combinedText = '';

        for (const textField of textFields) {
            const grandparent = textField.closest('div').parentElement;

            const label = grandparent ? grandparent.querySelector('label') : null;
            if (label && label.textContent.toLowerCase().includes('instruction')) {
                continue;  // Skip this text field
            }

            if (textField.value && textField.id.startsWith('interaction-')) {
                combinedText += `${textField.value}\n\n`; // Add the field's content
            }
        }

        return combinedText;
    }

    function exportToTxt() {
        const combinedText = getCombinedText();
        if (combinedText) {
            const blob = new Blob([combinedText], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'yourStory.txt';
            link.click();
            menu.style.display = 'none';
        } else {
            alert('No valid text fields found or they are empty!');
        }
    }

    function exportToClipboard() {
        const combinedText = getCombinedText();
        if (combinedText) {
            navigator.clipboard.writeText(combinedText)
                .then(() => {
                    alert('Text copied to clipboard!');
                    menu.style.display = 'none';
                })
                .catch((error) => {
                    alert('Failed to copy text to clipboard. Error: ' + error);
                });
        } else {
            alert('No valid text fields found or they are empty!');
        }
    }

    const button = document.createElement('button');
    button.textContent = 'Export';
    button.style.position = 'absolute';
    button.style.padding = '7.85px 20px';
    button.style.fontSize = '14px';
    button.style.backgroundColor = '#27272a';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.backgroundColor = '#27272a';
    menu.style.color = 'white';
    menu.style.borderRadius = '5px';
    menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    menu.style.display = 'none'; // Hide the menu initially
    menu.style.padding = '10px 5px';
    menu.style.zIndex = '1001';

    const clipboardButton = document.createElement('button');
    clipboardButton.textContent = 'Export to Clipboard';
    clipboardButton.style.padding = '7.85px 20px';
    clipboardButton.style.fontSize = '14px';
    clipboardButton.style.backgroundColor = '#444';
    clipboardButton.style.color = 'white';
    clipboardButton.style.border = 'none';
    clipboardButton.style.borderRadius = '5px';
    clipboardButton.style.cursor = 'pointer';
    clipboardButton.style.marginBottom = '10px';

    const txtButton = document.createElement('button');
    txtButton.textContent = 'Export to TXT';
    txtButton.style.padding = '7.85px 20px';
    txtButton.style.fontSize = '14px';
    txtButton.style.backgroundColor = '#444';
    txtButton.style.color = 'white';
    txtButton.style.border = 'none';
    txtButton.style.borderRadius = '5px';
    txtButton.style.cursor = 'pointer';

    menu.appendChild(clipboardButton);
    menu.appendChild(txtButton);

    function positionElements() {
        const width = window.innerWidth;

        if (width > 1279) {
            button.style.top = 'auto';
            button.style.bottom = '24px'; 
            button.style.left = '740px';   
            menu.style.top = `${button.offsetTop - menu.offsetHeight - 10}px`; 
            menu.style.left = `${button.offsetLeft}px`; 
        } else {
            button.style.bottom = '11.5px';
            button.style.left = '140px';
            menu.style.top = `${button.offsetTop - menu.offsetHeight - 10}px`; 
            menu.style.left = `${button.offsetLeft}px`; 
        }
    }

    button.addEventListener('click', () => {
        menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
    });

    clipboardButton.addEventListener('click', exportToClipboard);
    txtButton.addEventListener('click', exportToTxt);

    document.body.appendChild(button);
    document.body.appendChild(menu);

    positionElements();

    // Adjust the position of button and menu on window resize
    window.addEventListener('resize', positionElements);
})();

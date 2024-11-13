(function() {
    'use strict';

    let quoteTextColor = '#FFFF00';  // Default color

    // Function to highlight quoted text with a subtle shine effect
    function highlightQuotes(text) {
        return text.replace(/("[^"]*"|'[^']*')/g, (match) => {
            return `<span style="
                color: ${quoteTextColor};
                text-shadow: 0 0 1px black;
            ">${match}</span>`;
        });
    }

    // Function to create and update the overlay
    function updateOverlay(textarea) {
        const overlay = textarea.closest('.text-sm.lg\\:text-base.relative.flex.flex-row.p-3.focus-within\\:bg-muted\\/30').querySelector('.overlay');
        if (overlay) {
            const highlightedText = highlightQuotes(textarea.value);
            overlay.innerHTML = highlightedText;
        }
    }

    // Function to apply overlay and hide the original textarea
    function createOverlay(textarea) {
        // Hide the original textarea
        textarea.style.visibility = 'hidden';
        textarea.style.position = 'absolute';

        // Create the overlay div
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.style.position = 'absolute';
        overlay.style.top = textarea.offsetTop + 'px';
        overlay.style.left = textarea.offsetLeft + 'px';
        overlay.style.width = textarea.offsetWidth + 'px';
        overlay.style.height = textarea.offsetHeight + 'px';
        overlay.style.whiteSpace = 'pre-wrap';
        overlay.style.overflowWrap = 'break-word';
        overlay.style.fontFamily = window.getComputedStyle(textarea).fontFamily;
        overlay.style.fontSize = window.getComputedStyle(textarea).fontSize;
        overlay.style.lineHeight = window.getComputedStyle(textarea).lineHeight;
        overlay.style.zIndex = '1';
        overlay.style.pointerEvents = 'none'; // Make sure the overlay doesn't interfere with text input

        // Append overlay to the parent
        const parent = textarea.closest('.text-sm.lg\\:text-base.relative.flex.flex-row.p-3.focus-within\\:bg-muted\\/30');
        if (parent) {
            parent.appendChild(overlay);
        }

        // Initially update the overlay
        updateOverlay(textarea);

        // Add event listener for changes in the textarea
        textarea.addEventListener('input', function() {
            updateOverlay(textarea);
        });
    }

    // Function to initialize and apply to textareas
    function initialize() {
        const textareas = document.querySelectorAll("textarea");
        textareas.forEach((textarea) => {
            if (!textarea.dataset.hasOverlay) {
                textarea.dataset.hasOverlay = 'true';
                createOverlay(textarea);
            }
        });
    }

    // Run every 50ms to apply to newly added textareas
    setInterval(initialize, 50);
})();

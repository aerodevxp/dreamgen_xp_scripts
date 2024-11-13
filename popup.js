document.addEventListener('DOMContentLoaded', function() {
    const highlightColorPicker = document.getElementById('highlight-color');
    const saveButton = document.getElementById('save-settings');

    // Load current settings from localStorage
    chrome.storage.sync.get(['highlightColor'], function(data) {
        if (data.highlightColor) {
            highlightColorPicker.value = data.highlightColor;
        }
    });

    // Save settings to localStorage when the button is clicked
    saveButton.addEventListener('click', function() {
        const selectedColor = highlightColorPicker.value;
        chrome.storage.sync.set({ highlightColor: selectedColor }, function() {
            console.log('Settings saved:', selectedColor);
        });
    });
});

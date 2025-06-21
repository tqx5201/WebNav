document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsOverlay = document.getElementById('settings-overlay');
    const bgImageUrlInput = document.getElementById('bg-image-url');
    const opacitySlider = document.getElementById('bg-opacity-slider');
    const opacityValueSpan = document.getElementById('bg-opacity-value');
    const applyBgBtn = document.getElementById('apply-bg-btn');
    const resetBgBtn = document.getElementById('reset-bg-btn');
    const body = document.body;

    // Early exit if essential elements are not found
    if (!settingsBtn) {
        return;
    }

    // --- Constants ---
    const BING_API_URL = 'https://bing.img.run/rand.php';
    const STORAGE_KEY = 'backgroundSettings';

    // --- Functions ---
    const showPanel = () => {
        settingsPanel.classList.add('is-visible');
        settingsOverlay.classList.add('is-visible');
    };

    const hidePanel = () => {
        settingsPanel.classList.remove('is-visible');
        settingsOverlay.classList.remove('is-visible');
    };

    const applySettings = (settings) => {
        if (!settings) return;

        // Apply background image
        if (settings.url) {
            const imageUrl = (settings.url === 'bing_daily') ? BING_API_URL : settings.url;
            body.style.backgroundImage = `url('${imageUrl}')`;
            body.classList.add('with-custom-bg');
        } else {
            body.style.backgroundImage = '';
            body.classList.remove('with-custom-bg');
        }

        // Apply opacity
        const opacity = settings.opacity || 0.9;
        body.style.setProperty('--content-opacity', opacity);

        // Update UI elements to reflect current state
        if (opacitySlider) opacitySlider.value = opacity;
        if (opacityValueSpan) opacityValueSpan.textContent = `${Math.round(opacity * 100)}%`;
        if (bgImageUrlInput) {
            bgImageUrlInput.value = (settings.url && settings.url !== 'bing_daily') ? settings.url : '';
        }
    };

    const saveAndApplySettings = (settings) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        applySettings(settings);
    };

    const resetSettings = () => {
        localStorage.removeItem(STORAGE_KEY);
        // Reloading the page is the simplest way to reset all styles and states
        window.location.reload();
    };

    // --- Event Handlers ---
    settingsBtn.addEventListener('click', showPanel);
    closeSettingsBtn.addEventListener('click', hidePanel);
    settingsOverlay.addEventListener('click', hidePanel);

    opacitySlider.addEventListener('input', () => {
        const newOpacity = opacitySlider.value;
        if (opacityValueSpan) {
            opacityValueSpan.textContent = `${Math.round(newOpacity * 100)}%`;
        }
        body.style.setProperty('--content-opacity', newOpacity);
    });

    opacitySlider.addEventListener('change', () => { // 'change' fires when user releases the slider
        const currentSettings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        currentSettings.opacity = opacitySlider.value;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
    });

    applyBgBtn.addEventListener('click', () => {
        const imageUrl = bgImageUrlInput.value.trim();
        const currentSettings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        currentSettings.url = imageUrl ? imageUrl : 'bing_daily';
        currentSettings.opacity = opacitySlider.value; // Also save current opacity
        saveAndApplySettings(currentSettings);
        hidePanel();
    });

    resetBgBtn.addEventListener('click', () => {
        resetSettings();
        hidePanel();
    });

    // --- Initialization ---
    const savedSettingsJSON = localStorage.getItem(STORAGE_KEY);
    if (savedSettingsJSON) {
        const savedSettings = JSON.parse(savedSettingsJSON);
        applySettings(savedSettings);
    }
}); 
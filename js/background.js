document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsOverlay = document.getElementById('settings-overlay');
    const bgImageUrlInput = document.getElementById('bg-image-url');
    const applyBgBtn = document.getElementById('apply-bg-btn');
    const resetBgBtn = document.getElementById('reset-bg-btn');
    const body = document.body;

    // Ensure all elements exist before proceeding
    if (!settingsBtn || !closeSettingsBtn || !settingsPanel || !settingsOverlay || !applyBgBtn || !resetBgBtn) {
        console.warn('Settings panel elements not found. Feature will be disabled.');
        return;
    }

    // --- Constants ---
    const BING_API_URL = 'https://bing.img.run/rand.php';
    const STORAGE_KEY = 'backgroundSetting';

    // --- Functions ---
    const showPanel = () => {
        settingsPanel.classList.add('is-visible');
        settingsOverlay.classList.add('is-visible');
    };

    const hidePanel = () => {
        settingsPanel.classList.remove('is-visible');
        settingsOverlay.classList.remove('is-visible');
    };

    const applyBackground = (setting) => {
        if (!setting) return;

        let url;
        if (setting === 'bing_daily') {
            url = BING_API_URL;
        } else {
            url = setting; // Assume it's a regular URL
        }
        
        body.style.backgroundImage = `url('${url}')`;
        body.classList.add('with-custom-bg');
    };
    
    const saveAndApplyBackground = (setting) => {
        localStorage.setItem(STORAGE_KEY, setting);
        applyBackground(setting);
    };

    const resetBackground = () => {
        body.style.backgroundImage = '';
        body.classList.remove('with-custom-bg');
        localStorage.removeItem(STORAGE_KEY);
        bgImageUrlInput.value = '';
    };

    // --- Event Handlers ---
    settingsBtn.addEventListener('click', showPanel);
    closeSettingsBtn.addEventListener('click', hidePanel);
    settingsOverlay.addEventListener('click', hidePanel);

    applyBgBtn.addEventListener('click', () => {
        const imageUrl = bgImageUrlInput.value.trim();
        if (imageUrl) {
            saveAndApplyBackground(imageUrl);
        } else {
            saveAndApplyBackground('bing_daily');
        }
        hidePanel();
    });

    resetBgBtn.addEventListener('click', () => {
        resetBackground();
        hidePanel();
    });

    // --- Initialization ---
    const savedBgSetting = localStorage.getItem(STORAGE_KEY);
    if (savedBgSetting) {
        applyBackground(savedBgSetting);
        if (savedBgSetting !== 'bing_daily') {
             bgImageUrlInput.value = savedBgSetting;
        }
    }
}); 
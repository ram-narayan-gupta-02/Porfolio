/**
 * Theme Switcher Component
 * Handles theme switching between dark and light modes
 */

// Global variables
let currentTheme = 'dark';
let themeToggleButton;

// Initialize theme switcher when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThemeSwitcher();
});

/**
 * Initialize theme switcher component
 */
function initThemeSwitcher() {
    // Create theme toggle button
    createThemeToggle();
    
    // Check user's preferred color scheme
    checkUserThemePreference();
}

/**
 * Create theme toggle button
 */
function createThemeToggle() {
    // Find container for theme toggle
    const container = document.getElementById('theme-toggle-container');
    if (!container) {
        console.warn('Theme toggle container not found in the document.');
        return;
    }
    
    // Create button
    themeToggleButton = document.createElement('button');
    themeToggleButton.id = 'theme-toggle';
    themeToggleButton.className = 'flex items-center justify-center p-2 rounded-full bg-dark-card hover:bg-dark-border transition-colors';
    themeToggleButton.setAttribute('aria-label', 'Toggle theme');
    themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    
    // Add event listener
    themeToggleButton.addEventListener('click', toggleTheme);
    
    // Add to container
    container.appendChild(themeToggleButton);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    // Update current theme
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply the theme
    applyTheme(currentTheme);
    
    // Save user's preference
    localStorage.setItem('theme', currentTheme);
    
    // Play sound effect if sound is enabled
    if (typeof playSoundEffect === 'function') {
        playSoundEffect('ui');
    }
}

/**
 * Apply theme to DOM
 * @param {String} theme - Theme name ('dark' or 'light')
 */
function applyTheme(theme) {
    // Add proper class to body
    document.body.classList.add('theme-transition');
    
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        
        // Update icon
        if (themeToggleButton) {
            themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggleButton.style.color = '#1A202C';
        }
        
        // Update meta theme color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#F7F9FC');
        }
    } else {
        document.body.classList.remove('light-theme');
        
        // Update icon
        if (themeToggleButton) {
            themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggleButton.style.color = '';
        }
        
        // Update meta theme color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#0F1218');
        }
    }
    
    // Remove transition class after animation completes
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 1000);
}

/**
 * Check user's theme preference
 */
function checkUserThemePreference() {
    // Check if theme is stored in local storage
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
        // Use stored theme
        currentTheme = storedTheme;
        applyTheme(currentTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        // Use system preference if available
        currentTheme = 'light';
        applyTheme(currentTheme);
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        
        // Add listener for changes (modern browsers)
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    // Only change if user hasn't manually set a preference
                    currentTheme = e.matches ? 'light' : 'dark';
                    applyTheme(currentTheme);
                }
            });
        }
    }
}
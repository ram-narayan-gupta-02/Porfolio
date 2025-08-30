/**
 * Audio Controller
 * Manages background music and audio effects
 */

// Audio elements
let backgroundMusic;
let currentVolume = 0.5;
let isMusicPlaying = false;

// Initialize audio controller when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAudioController();
});

/**
 * Initialize audio controller
 */
function initAudioController() {
    // Create background music element
    backgroundMusic = new Audio();
    
    // Using a local music file from assets/audio directory
    // To use your own music, place your music file in the assets/audio folder
    // and name it background-music.mp3 or update this path accordingly
    backgroundMusic.src = "static/assets/audio/background-music.mp3";
    backgroundMusic.loop = true;
    backgroundMusic.volume = currentVolume;
    backgroundMusic.preload = "auto";
    
    // Set up audio controls
    setupAudioControls();
    
    // Listen for page visibility changes
    handlePageVisibility();
}

/**
 * Set up audio control elements
 */
function setupAudioControls() {
    const playPauseButton = document.getElementById('play-pause');
    const volumeSlider = document.getElementById('volume-slider');
    
    if (playPauseButton) {
        playPauseButton.addEventListener('click', function() {
            toggleMusic();
        });
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            setVolume(this.value / 100);
        });
        
        // Set initial volume
        volumeSlider.value = currentVolume * 100;
    }
}

/**
 * Toggle music playback
 */
function toggleMusic() {
    const playPauseButton = document.getElementById('play-pause');
    
    if (isMusicPlaying) {
        // Pause music
        backgroundMusic.pause();
        isMusicPlaying = false;
        
        if (playPauseButton) {
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    } else {
        // Play music
        playMusic();
    }
}

/**
 * Start playing background music
 */
function playMusic() {
    const playPromise = backgroundMusic.play();
    const playPauseButton = document.getElementById('play-pause');
    
    // Handle play promise (required for modern browsers)
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Playback started successfully
            isMusicPlaying = true;
            
            if (playPauseButton) {
                playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
            }
        }).catch(error => {
            // Auto-play was prevented
            console.error("Auto-play was prevented:", error);
            
            // Show a message to the user
            showAutoPlayMessage();
        });
    }
}

/**
 * Set music volume
 * @param {Number} value - Volume value between 0 and 1
 */
function setVolume(value) {
    // Ensure value is within range
    currentVolume = Math.max(0, Math.min(1, value));
    
    // Set volume
    backgroundMusic.volume = currentVolume;
}

/**
 * Show message when auto-play is prevented
 */
function showAutoPlayMessage() {
    // Create message element if it doesn't exist
    if (!document.getElementById('autoplay-message')) {
        const message = document.createElement('div');
        message.id = 'autoplay-message';
        message.className = 'fixed top-4 right-4 bg-dark-card p-4 rounded-lg shadow-lg z-50 text-white';
        message.innerHTML = `
            <p class="mb-2">Click the play button to enable music</p>
            <button id="close-message" class="text-accent-neon hover:text-accent-purple">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(message);
        
        // Add close button functionality
        document.getElementById('close-message').addEventListener('click', function() {
            document.getElementById('autoplay-message').remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.getElementById('autoplay-message')) {
                document.getElementById('autoplay-message').remove();
            }
        }, 5000);
    }
}

/**
 * Handle page visibility changes
 */
function handlePageVisibility() {
    // Pause music when page is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause music if playing
            if (isMusicPlaying) {
                backgroundMusic.pause();
                // Don't update state, so we can resume when visible again
            }
        } else {
            // Page is visible again, resume music if it was playing
            if (isMusicPlaying) {
                backgroundMusic.play();
            }
        }
    });
}

/**
 * Play a sound effect
 * @param {String} type - The type of sound effect to play
 */
function playSoundEffect(type) {
    let soundEffect = new Audio();
    
    // Set sound effect based on type
    switch(type) {
        case 'click':
            soundEffect.src = "static/assets/audio/click.mp3";
            break;
        case 'hover':
            soundEffect.src = "static/assets/audio/hover.mp3";
            break;
        // Add more sound effects as needed
    }
    
    // Play the sound effect
    soundEffect.volume = currentVolume * 0.5;
    soundEffect.play().catch(error => {
        // Ignore errors for sound effects
        console.log("Could not play sound effect:", error);
    });
}

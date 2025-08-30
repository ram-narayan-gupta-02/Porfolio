/**
 * Enhanced Text Effects Component
 * Creates stylish, readable text effects for headings
 */

// Initialize enhanced text effects when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initEnhancedTextEffects();
});

/**
 * Initialize enhanced text effects
 */
function initEnhancedTextEffects() {
    // Find all elements with particle-text class and replace with enhanced text
    const textElements = document.querySelectorAll('.particle-text');
    
    if (textElements.length > 0) {
        textElements.forEach(element => {
            applyEnhancedTextEffect(element);
        });
    }
}

/**
 * Apply enhanced text effect to an element
 * @param {HTMLElement} element - The element to apply effect to
 */
function applyEnhancedTextEffect(element) {
    // Store the original text and computed style
    const originalText = element.textContent;
    const computedStyle = window.getComputedStyle(element);
    const originalColor = computedStyle.color;
    const fontSize = computedStyle.fontSize;
    
    // Determine accent color based on text content and position
    let accentColor;
    
    // Use the section colors
    if (element.closest('#hero')) {
        accentColor = '#7B4DFF'; // Purple for hero section
    } else if (element.closest('#skills')) {
        accentColor = '#39FF14'; // Neon green for skills section
    } else if (element.closest('#projects')) {
        accentColor = '#00F5FF'; // Teal for projects section
    } else if (element.closest('#experience')) {
        accentColor = '#FF00FF'; // Pink for experience section
    } else if (element.closest('#contact')) {
        accentColor = '#7B4DFF'; // Purple for contact section
    } else {
        accentColor = '#39FF14'; // Default to neon green
    }
    
    // Clear the element
    element.textContent = '';
    element.classList.add('enhanced-text');
    
    // Create wrapper for the text
    const wrapper = document.createElement('div');
    wrapper.className = 'enhanced-text-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    
    // Create main visible text
    const mainText = document.createElement('span');
    mainText.className = 'enhanced-text-main';
    mainText.textContent = originalText;
    mainText.style.position = 'relative';
    mainText.style.zIndex = '2';
    mainText.style.color = originalColor;
    
    // Create glow layer
    const glowText = document.createElement('span');
    glowText.className = 'enhanced-text-glow';
    glowText.textContent = originalText;
    glowText.style.position = 'absolute';
    glowText.style.left = '0';
    glowText.style.top = '0';
    glowText.style.zIndex = '1';
    glowText.style.color = accentColor;
    glowText.style.filter = 'blur(8px)';
    glowText.style.opacity = '0.6';
    
    // Create color accent layer
    const accentText = document.createElement('span');
    accentText.className = 'enhanced-text-accent';
    accentText.textContent = originalText;
    accentText.style.position = 'absolute';
    accentText.style.left = '0';
    accentText.style.top = '0';
    accentText.style.zIndex = '1';
    accentText.style.color = accentColor;
    accentText.style.opacity = '0.9';
    accentText.style.transform = 'translate(-1px, -1px)';
    
    // Create shadow layer
    const shadowText = document.createElement('span');
    shadowText.className = 'enhanced-text-shadow';
    shadowText.textContent = originalText;
    shadowText.style.position = 'absolute';
    shadowText.style.left = '2px';
    shadowText.style.top = '2px';
    shadowText.style.zIndex = '0';
    shadowText.style.color = 'rgba(0,0,0,0.5)';
    
    // Add hover effect
    wrapper.addEventListener('mouseenter', () => {
        mainText.style.transform = 'translate(-1px, -1px)';
        mainText.style.transition = 'transform 0.3s ease';
        
        glowText.style.opacity = '0.8';
        glowText.style.filter = 'blur(12px)';
        glowText.style.transition = 'all 0.3s ease';
        
        accentText.style.transform = 'translate(-2px, -2px)';
        accentText.style.transition = 'transform 0.3s ease';
    });
    
    wrapper.addEventListener('mouseleave', () => {
        mainText.style.transform = 'translate(0, 0)';
        
        glowText.style.opacity = '0.6';
        glowText.style.filter = 'blur(8px)';
        
        accentText.style.transform = 'translate(-1px, -1px)';
    });
    
    // Assemble the enhanced text
    wrapper.appendChild(shadowText);
    wrapper.appendChild(glowText);
    wrapper.appendChild(accentText);
    wrapper.appendChild(mainText);
    element.appendChild(wrapper);
    
    // Add subtle animation
    addGlowAnimation(glowText, accentColor);
}

/**
 * Add glow animation to element
 * @param {HTMLElement} element - Element to animate
 * @param {String} color - Base color for animation
 */
function addGlowAnimation(element, color) {
    // Create keyframe animation
    const animationName = `glow-pulse-${Math.floor(Math.random() * 1000)}`;
    const keyframes = `
        @keyframes ${animationName} {
            0% { opacity: 0.4; filter: blur(8px); }
            50% { opacity: 0.7; filter: blur(12px); }
            100% { opacity: 0.4; filter: blur(8px); }
        }
    `;
    
    // Add style to document
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    // Apply animation
    element.style.animation = `${animationName} 3s infinite ease-in-out`;
}
/**
 * Custom Cursor Effects Component
 * Creates an animated cursor with interactive effects
 */

// Global variables
let cursorDot;
let cursorCircle;
let cursorTrail;
let trailPoints = [];
let mouseX = 0;
let mouseY = 0;
let lastX = 0;
let lastY = 0;
let cursorVisible = true;
let requestId;
let maxTrailPoints = 15;

// Initialize cursor effects when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (!isMobileDevice()) {
        initCursorEffects();
    }
});

/**
 * Initialize cursor effects
 */
function initCursorEffects() {
    // Create cursor elements
    createCustomCursor();
    
    // Add event listeners
    addCursorListeners();
    
    // Start animation
    animateCursor();
}

/**
 * Create custom cursor elements
 */
function createCustomCursor() {
    // Add custom cursor class to body
    document.body.classList.add('custom-cursor');
    
    // Create cursor dot (inner cursor)
    cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    // Create cursor circle (outer cursor)
    cursorCircle = document.createElement('div');
    cursorCircle.className = 'cursor-circle';
    document.body.appendChild(cursorCircle);
    
    // Create trail canvas
    cursorTrail = document.createElement('canvas');
    cursorTrail.className = 'cursor-trail';
    cursorTrail.width = window.innerWidth;
    cursorTrail.height = window.innerHeight;
    document.body.appendChild(cursorTrail);
}

/**
 * Add event listeners for cursor movement
 */
function addCursorListeners() {
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Add point to trail
        addTrailPoint(mouseX, mouseY);
    });
    
    // Handle mouse leaving window
    document.addEventListener('mouseout', () => {
        cursorVisible = false;
    });
    
    // Handle mouse entering window
    document.addEventListener('mouseover', () => {
        cursorVisible = true;
    });
    
    // Add hover effect for all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"], .interactive');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
            cursorCircle.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
            cursorCircle.classList.remove('cursor-hover');
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        cursorTrail.width = window.innerWidth;
        cursorTrail.height = window.innerHeight;
    });
}

/**
 * Animate custom cursor
 */
function animateCursor() {
    lastX += (mouseX - lastX) * 0.2;
    lastY += (mouseY - lastY) * 0.2;
    
    // Set position of cursor elements
    if (cursorVisible) {
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        cursorCircle.style.transform = `translate(${lastX}px, ${lastY}px)`;
    }
    
    // Draw trail
    drawTrail();
    
    // Continue animation loop
    requestId = requestAnimationFrame(animateCursor);
}

/**
 * Add point to cursor trail
 * @param {Number} x - X coordinate
 * @param {Number} y - Y coordinate
 */
function addTrailPoint(x, y) {
    trailPoints.push({
        x: x,
        y: y,
        age: 0
    });
    
    // Limit number of trail points
    if (trailPoints.length > maxTrailPoints) {
        trailPoints.shift();
    }
}

/**
 * Draw cursor trail
 */
function drawTrail() {
    if (!cursorTrail) return;
    
    const ctx = cursorTrail.getContext('2d');
    ctx.clearRect(0, 0, cursorTrail.width, cursorTrail.height);
    
    // Update and draw trail points
    for (let i = 0; i < trailPoints.length; i++) {
        const point = trailPoints[i];
        point.age++;
        
        // Remove old points
        if (point.age > 50) {
            trailPoints.splice(i, 1);
            i--;
            continue;
        }
        
        // Calculate size and opacity based on age
        const size = Math.max(1, 8 - (point.age / 5));
        const opacity = Math.max(0, 1 - (point.age / 30));
        
        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, size * 2
        );
        
        gradient.addColorStop(0, `rgba(123, 77, 255, ${opacity})`);
        gradient.addColorStop(1, 'rgba(123, 77, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    // Connect points with line
    if (trailPoints.length > 2) {
        ctx.beginPath();
        ctx.moveTo(trailPoints[0].x, trailPoints[0].y);
        
        for (let i = 1; i < trailPoints.length; i++) {
            const point = trailPoints[i];
            ctx.lineTo(point.x, point.y);
        }
        
        ctx.strokeStyle = 'rgba(123, 77, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

/**
 * Check if device is mobile
 * @returns {Boolean} True if mobile device
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}
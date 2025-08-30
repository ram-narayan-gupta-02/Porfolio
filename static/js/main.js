/**
 * Main JavaScript File
 * Controls general functionality and initializes other modules
 */

// Wait for document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Set current year for footer
    document.getElementById('year').textContent = new Date().getFullYear();
});

/**
 * Initialize the application
 */
function initApp() {
    // Performance optimization
    const IS_MOBILE = /Mobi|Android/i.test(navigator.userAgent);
    
    // Optimize loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (document.readyState === 'complete') {
        loadingScreen.classList.add('fade-out');
    } else {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
        }, IS_MOBILE ? 1000 : 2000);
    }
    
    // Initialize navigation
    initNavigation();
    
    // Initialize contact form
    initContactForm();
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const closeMobileNav = document.getElementById('close-mobile-nav');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Handle scroll event for navbar styling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile navigation toggle
    mobileNavToggle.addEventListener('click', () => {
        mobileNav.style.transform = 'translateX(0)';
    });
    
    closeMobileNav.addEventListener('click', () => {
        mobileNav.style.transform = 'translateX(100%)';
    });
    
    // Close mobile nav when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.style.transform = 'translateX(100%)';
        });
    });
    
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize contact form
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For now, we'll just simulate success with an alert
            alert('Thank you for your message! In a real application, this would be sent to a server.');
            
            // Reset form
            contactForm.reset();
        });
    }
}

/**
 * Handle window resize events
 */
window.addEventListener('resize', function() {
    // Reinitialize any size-dependent functionality here
});

/**
 * Helper function to check if an element is in viewport
 * @param {HTMLElement} el - The element to check
 * @returns {Boolean} - True if element is in viewport
 */
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

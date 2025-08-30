/**
 * Animations Controller
 * Manages animations throughout the portfolio
 */

// Initialize animations when document is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Wait for loading screen to disappear
    setTimeout(() => {
        initAnimations();
    }, 2100);
});

/**
 * Initialize all animations
 */
function initAnimations() {
    // Initialize GSAP ScrollTrigger with optimized settings
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Optimize GSAP performance
        // Define IS_MOBILE before other scripts use it
        const IS_MOBILE = /Mobi|Android/i.test(navigator.userAgent);

        function initAnimations() {
            if (IS_MOBILE) {
                console.log("Running mobile animations...");
                // Mobile-specific animations
            } else {
                console.log("Running desktop animations...");
                // Desktop-specific animations
            }
        }

        gsap.ticker.lagSmoothing(0);

        // Batch similar animations
        gsap.set(".gsap-batch", { force3D: true });

        // Set up animations
        animateHeroSection();
        animateSections();
        animateSkillBars();
        animateProjects();
        animateTimeline();

        // Create continuous background animations
        createFloatingElements();
        animateBackgroundPatterns();
        createGlowingEffects();
        animateColorPulse();
    } else {
        console.warn('GSAP or ScrollTrigger not loaded');
    }

    // Initialize non-GSAP animations
    animateTypingEffect();
    animateOnScroll();

    // Create particle effects on key elements
    document.querySelectorAll('.section-heading').forEach(heading => {
        createParticleEffect(heading);
    });

    // Start the neural network background animation
    animateNeuralNetworkBackground();
}

/**
 * Animate hero section
 */
function animateHeroSection() {
    // Animate hero text elements
    gsap.from('.hero-text-element', {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out'
    });

    // Animate dynamic text with a special effect
    gsap.to('.dynamic-text', {
        backgroundPosition: '200% center',
        duration: 10,
        repeat: -1,
        ease: 'linear'
    });
}

/**
 * Animate sections as they come into view
 */
function animateSections() {
    // Animate section headings
    gsap.utils.toArray('.section-heading').forEach(heading => {
        gsap.from(heading, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: heading,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none none'
            }
        });
    });

    // About section animations
    gsap.from('.about-image-container', {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '#about',
            start: 'top 70%',
            end: 'center center',
            toggleActions: 'play none none none'
        }
    });

    gsap.from('.about-detail', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        scrollTrigger: {
            trigger: '.about-detail',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
}

/**
 * Animate skill bars
 */
function animateSkillBars() {
    // Animate skill bars when they come into view
    gsap.utils.toArray('.skill-bar').forEach(bar => {
        const progressBar = bar.querySelector('.bg-accent-neon, .bg-accent-purple, .bg-accent-pink, .bg-accent-teal');

        gsap.from(progressBar, {
            width: 0,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Animate tech cards
    // First make sure all tech cards are visible
    document.querySelectorAll('.tech-card').forEach(card => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.display = 'flex';
        console.log("Tech card set to visible:", card.querySelector('span').textContent);
    });

    // Count tech cards for debugging
    console.log("Tech cards found:", document.querySelectorAll('.tech-card').length);

    // Then add animation
    gsap.from('.tech-card', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        scrollTrigger: {
            trigger: '.tech-card',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
}

/**
 * Animate project cards
 */
function animateProjects() {
    // Animate project cards when they come into view
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1, // Stagger effect
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    });
}

/**
 * Animate experience timeline
 */
function animateTimeline() {
    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        // Animate the dot
        gsap.from(item.querySelector('.timeline-dot'), {
            scale: 0,
            duration: 0.5,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // Animate the content
        gsap.from(item.querySelector('.timeline-content'), {
            x: 100,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.2 + 0.2,
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
}

/**
 * Create a typing effect for text elements
 */
function animateTypingEffect() {
    // Apply typing effect to selected elements
    const typingElements = document.querySelectorAll('.typing-effect');

    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.visibility = 'visible';

        // Create a typing effect
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(interval);
                // Add blinking cursor at the end
                element.innerHTML += '<span class="typing-cursor">|</span>';
                animateBlinkingCursor();
            }
        }, 100);
    });
}

/**
 * Animate blinking cursor
 */
function animateBlinkingCursor() {
    const cursors = document.querySelectorAll('.typing-cursor');

    setInterval(() => {
        cursors.forEach(cursor => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        });
    }, 500);
}

/**
 * Animate elements when they enter viewport
 * Non-GSAP alternative for simple animations
 */
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Create a particle effect for an element
 * @param {HTMLElement} element - The element to apply particle effect
 */
function createParticleEffect(element) {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = element.offsetWidth;
    canvas.height = element.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';

    element.style.position = 'relative';
    element.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Create particles
    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: `rgba(57, 255, 20, ${Math.random() * 0.5 + 0.25})`,
            speed: Math.random() * 1 + 0.5,
            direction: Math.random() * Math.PI * 2
        });
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Move particle
            p.x += Math.cos(p.direction) * p.speed;
            p.y += Math.sin(p.direction) * p.speed;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * Create floating elements that move around the background
 */
function createFloatingElements() {
    // Create floating elements container if it doesn't exist
    let container = document.getElementById('floating-elements');
    if (!container) {
        container = document.createElement('div');
        container.id = 'floating-elements';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '0';
        document.body.appendChild(container);
    }

    // Create floating elements
    const floatingSymbols = [
        '0101', '1010', '0010', '1001',
        '{ }', '[ ]', '( )', '&lt; &gt;',
        'AI', 'ML', 'DL', 'CNN', 'RNN', 'GAN',
        '⚙️', '🔍', '📊', '🧠'
    ];

    // Create 15-20 floating elements
    const count = Math.floor(Math.random() * 6) + 15;

    for (let i = 0; i < count; i++) {
        const element = document.createElement('div');
        const symbol = floatingSymbols[Math.floor(Math.random() * floatingSymbols.length)];

        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;

        // Random size
        const size = Math.random() * 1 + 0.5;

        // Random color
        const colors = [
            'rgba(57, 255, 20, 0.15)', // neon green
            'rgba(123, 77, 255, 0.15)', // purple
            'rgba(255, 0, 255, 0.15)', // pink
            'rgba(0, 245, 255, 0.15)', // teal
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Style the element
        element.innerHTML = symbol;
        element.style.position = 'absolute';
        element.style.top = `${posY}%`;
        element.style.left = `${posX}%`;
        element.style.transform = `scale(${size})`;
        element.style.color = color;
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '1.5rem';
        element.style.opacity = '0.5';
        element.style.textShadow = `0 0 10px ${color.replace('0.15', '0.3')}`;
        element.style.zIndex = '0';
        element.style.pointerEvents = 'none';

        // Add to container
        container.appendChild(element);

        // Animate with GSAP
        gsap.to(element, {
            x: `${(Math.random() - 0.5) * 100}`,
            y: `${(Math.random() - 0.5) * 100}`,
            rotation: Math.random() * 360,
            duration: Math.random() * 30 + 30,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
        });

        // Pulse opacity
        gsap.to(element, {
            opacity: 0.2,
            duration: Math.random() * 4 + 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

/**
 * Animate background patterns with continuous motion
 */
function animateBackgroundPatterns() {
    // Get all pattern elements
    const patterns = document.querySelectorAll('.neural-network-pattern, .circuit-board-pattern, .data-flow-pattern');

    patterns.forEach((pattern, index) => {
        // Create a different animation for each pattern type
        const direction = index % 2 === 0 ? 1 : -1;

        // Animate pattern movement
        gsap.to(pattern, {
            backgroundPosition: `${direction * 50}px ${-direction * 50}px`,
            duration: 30,
            ease: 'none',
            repeat: -1
        });

        // Pulse opacity
        gsap.to(pattern, {
            opacity: '0.05',
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });
}

/**
 * Create glowing effects on key elements
 */
function createGlowingEffects() {
    // Key elements to add glowing effect
    const glowElements = [
        '.tech-card',
        '.timeline-dot',
        '.project-card',
        '.social-icon',
        '.btn-primary',
        '.dynamic-text'
    ];

    glowElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            // Add hover animation
            element.addEventListener('mouseenter', () => {
                gsap.to(element, {
                    boxShadow: '0 0 20px rgba(57, 255, 20, 0.5)',
                    duration: 0.3
                });
            });

            element.addEventListener('mouseleave', () => {
                gsap.to(element, {
                    boxShadow: element.style.boxShadow,
                    duration: 0.3
                });
            });

            // Add subtle permanent glow
            gsap.to(element, {
                boxShadow: '0 0 10px rgba(57, 255, 20, 0.2)',
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });
    });
}

/**
 * Animate color pulse on accent elements
 */
function animateColorPulse() {
    // Accent color elements
    const accentElements = [
        '.text-accent-neon',
        '.text-accent-purple',
        '.text-accent-pink',
        '.text-accent-teal'
    ];

    accentElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            // Add subtle brightness pulse
            gsap.to(element, {
                filter: 'brightness(1.3)',
                duration: Math.random() * 4 + 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });
    });
}

/**
 * Create neural network background animation
 */
function animateNeuralNetworkBackground() {
    // Add a background animation to simulate neural network activity
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        // Create a canvas for each section
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.1';
        canvas.style.zIndex = '0';

        // Only add if section has no existing pattern
        if (!section.querySelector('.neural-network-pattern, .circuit-board-pattern, .data-flow-pattern')) {
            // Add relative positioning to section if not already set
            if (window.getComputedStyle(section).position === 'static') {
                section.style.position = 'relative';
            }

            section.insertBefore(canvas, section.firstChild);

            const ctx = canvas.getContext('2d');

            // Create nodes and connections
            const nodes = [];
            const numNodes = Math.floor(Math.random() * 30) + 20;

            for (let i = 0; i < numNodes; i++) {
                nodes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    color: getRandomNeonColor(0.5)
                });
            }

            // Animation function
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Update and draw nodes
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];

                    // Update position
                    node.x += node.vx;
                    node.y += node.vy;

                    // Bounce off edges
                    if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                    if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                    // Draw node
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                    ctx.fillStyle = node.color;
                    ctx.fill();

                    // Draw connections to nearby nodes
                    for (let j = i + 1; j < nodes.length; j++) {
                        const node2 = nodes[j];
                        const dx = node.x - node2.x;
                        const dy = node.y - node2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 150) {
                            // Draw connection
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(node2.x, node2.y);
                            ctx.strokeStyle = `rgba(57, 255, 20, ${0.1 * (1 - dist / 150)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();

                            // Every now and then, animate a pulse along the connection
                            if (Math.random() < 0.001) {
                                animatePulse(node.x, node.y, node2.x, node2.y, canvas, ctx);
                            }
                        }
                    }
                }

                requestAnimationFrame(animate);
            }

            // Start animation if the section is in viewport
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animate();
                    observer.disconnect();
                }
            });

            observer.observe(section);
        }
    });
}

/**
 * Animate a pulse along a neural network connection
 */
function animatePulse(x1, y1, x2, y2, canvas, ctx) {
    const startTime = Date.now();
    const duration = 1000; // 1 second for the pulse to travel

    function drawPulse() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
            // Calculate position along the line
            const x = x1 + (x2 - x1) * progress;
            const y = y1 + (y2 - y1) * progress;

            // Draw pulse
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(57, 255, 20, 0.5)';
            ctx.fill();

            // Add a glow effect
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
            gradient.addColorStop(0, 'rgba(57, 255, 20, 0.4)');
            gradient.addColorStop(1, 'rgba(57, 255, 20, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();

            requestAnimationFrame(drawPulse);
        }
    }

    drawPulse();
}

/**
 * Get a random neon color in the theme
 * @param {Number} alpha - Alpha value for the color
 * @returns {String} CSS color string
 */
function getRandomNeonColor(alpha = 1) {
    const colors = [
        `rgba(57, 255, 20, ${alpha})`, // neon green
        `rgba(123, 77, 255, ${alpha})`, // purple
        `rgba(255, 0, 255, ${alpha})`, // pink
        `rgba(0, 245, 255, ${alpha})`, // teal
    ];

    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Three.js Scene Handler
 * Creates and manages 3D scenes for the portfolio
 */

// Global variables
let heroScene, heroCamera, heroRenderer;
let particles = [];
let projectScenes = {};

// Constants
const PARTICLE_COUNT = 800; // Reduced particle count
const PARTICLE_DISTANCE = 80; // Reduced distance
const CAMERA_DISTANCE = 300; // Reduced camera distance
const IS_MOBILE = window.innerWidth < 768;
const RENDER_QUALITY = IS_MOBILE ? 0.75 : 1;
let lastRenderTime = 0;
const RENDER_INTERVAL = IS_MOBILE ? 50 : 16.67; // 20fps on mobile, 60fps on desktop

// Initialize the hero scene when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all 3D elements
    initHeroScene();
    initProjectScenes();
    
    // Start the animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
});

/**
 * Initialize the hero section 3D scene
 */
function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    
    if (!canvas) return;
    
    // Setup the scene
    heroScene = new THREE.Scene();
    
    // Setup the camera
    const aspectRatio = window.innerWidth / window.innerHeight;
    heroCamera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    heroCamera.position.z = CAMERA_DISTANCE;
    
    // Setup the renderer
    heroRenderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true,
        alpha: true 
    });
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
    heroRenderer.setPixelRatio(window.devicePixelRatio);
    
    // Create a neural network-like particle system
    createParticles();
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    heroScene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x7B4DFF, 1);
    directionalLight.position.set(1, 1, 1);
    heroScene.add(directionalLight);
}

/**
 * Create particles for neural network visualization
 */
function createParticles() {
    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    // Create particle geometry
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * PARTICLE_DISTANCE * 2;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * PARTICLE_DISTANCE;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * PARTICLE_DISTANCE;
        
        // Store particle data for animation
        particles.push({
            position: new THREE.Vector3(
                particlePositions[i3],
                particlePositions[i3 + 1],
                particlePositions[i3 + 2]
            ),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            ),
            originalPosition: new THREE.Vector3(
                particlePositions[i3],
                particlePositions[i3 + 1],
                particlePositions[i3 + 2]
            )
        });
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Create particle system
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    heroScene.add(particleSystem);
    
    // Create connections between particles
    createConnections();
}

/**
 * Create connections between particles (neural network links)
 */
function createConnections() {
    const connectionsGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors = [];
    
    // Define gradient colors
    const colors = [
        new THREE.Color(0x39FF14), // Neon green
        new THREE.Color(0x7B4DFF), // Purple
        new THREE.Color(0xFF00FF), // Pink
        new THREE.Color(0x00F5FF)  // Teal
    ];
    
    // Create connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
        const particleA = particles[i];
        
        // Only connect to a limited number of nearby particles
        for (let j = i + 1; j < Math.min(particles.length, i + 10); j++) {
            const particleB = particles[j];
            
            // Calculate distance between particles
            const distance = particleA.position.distanceTo(particleB.position);
            
            // Connect only if they're not too far apart
            if (distance < 30) {
                linePositions.push(
                    particleA.position.x, particleA.position.y, particleA.position.z,
                    particleB.position.x, particleB.position.y, particleB.position.z
                );
                
                // Assign gradient colors based on position
                const colorIndex1 = Math.floor(Math.random() * colors.length);
                const colorIndex2 = (colorIndex1 + 1) % colors.length;
                
                lineColors.push(
                    colors[colorIndex1].r, colors[colorIndex1].g, colors[colorIndex1].b,
                    colors[colorIndex2].r, colors[colorIndex2].g, colors[colorIndex2].b
                );
            }
        }
    }
    
    connectionsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    connectionsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    
    // Create line material
    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    
    // Create line segments
    const lineSegments = new THREE.LineSegments(connectionsGeometry, lineMaterial);
    heroScene.add(lineSegments);
}

/**
 * Initialize 3D scenes for projects section
 */
function initProjectScenes() {
    // Get all project 3D containers
    const projectContainers = document.querySelectorAll('.project-3d-container');
    
    projectContainers.forEach(container => {
        const projectId = container.getAttribute('data-project');
        
        // Create a scene for each project
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x7B4DFF, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        
        // Add different 3D objects based on project type
        let object;
        
        switch(projectId) {
            case 'neural-network':
                object = createNeuralNetworkModel();
                camera.position.z = 15;
                break;
            case 'image-recognition':
                object = createImageRecognitionModel();
                camera.position.z = 4;
                break;
            case 'nlp-model':
                object = createNLPModel();
                camera.position.z = 6;
                break;
            case 'data-viz':
                object = createDataVizModel();
                camera.position.z = 5;
                break;
            case 'reinforcement':
                object = createReinforcementModel();
                camera.position.z = 4;
                break;
            case 'chatbot':
                object = createChatbotModel();
                camera.position.z = 5;
                break;
            default:
                object = new THREE.Mesh(
                    new THREE.SphereGeometry(1, 32, 32),
                    new THREE.MeshStandardMaterial({ 
                        color: 0x7B4DFF,
                        roughness: 0.5,
                        metalness: 0.8
                    })
                );
                camera.position.z = 3;
        }
        
        scene.add(object);
        
        // Store the scene data
        projectScenes[projectId] = {
            scene: scene,
            camera: camera,
            renderer: renderer,
            object: object
        };
    });
}

/**
 * Create a neural network visualization model
 * @returns {THREE.Group} Neural network model
 */
function createNeuralNetworkModel() {
    const group = new THREE.Group();
    
    // Create layers
    const layerCount = 4;
    const nodesPerLayer = [4, 6, 6, 2];
    const layerDistance = 3;
    const nodeSize = 0.3;
    
    // Colors for gradient
    const colors = [
        new THREE.Color(0x39FF14), // Neon green
        new THREE.Color(0x7B4DFF), // Purple
        new THREE.Color(0xFF00FF), // Pink
        new THREE.Color(0x00F5FF)  // Teal
    ];
    
    // Create nodes
    const nodes = [];
    
    for (let layer = 0; layer < layerCount; layer++) {
        const layerNodes = [];
        const nodeCount = nodesPerLayer[layer];
        
        for (let i = 0; i < nodeCount; i++) {
            const yPos = (i - (nodeCount - 1) / 2) * 1.2;
            
            // Create node (sphere)
            const nodeMaterial = new THREE.MeshStandardMaterial({ 
                color: colors[layer % colors.length],
                emissive: colors[layer % colors.length],
                emissiveIntensity: 0.3,
                roughness: 0.3,
                metalness: 0.8
            });
            
            const nodeMesh = new THREE.Mesh(
                new THREE.SphereGeometry(nodeSize, 16, 16),
                nodeMaterial
            );
            
            nodeMesh.position.set(layer * layerDistance - (layerCount * layerDistance) / 2 + layerDistance, yPos, 0);
            group.add(nodeMesh);
            
            layerNodes.push(nodeMesh);
        }
        
        nodes.push(layerNodes);
    }
    
    // Create connections between nodes
    for (let layer = 0; layer < layerCount - 1; layer++) {
        const currentLayerNodes = nodes[layer];
        const nextLayerNodes = nodes[layer + 1];
        
        for (let i = 0; i < currentLayerNodes.length; i++) {
            const startNode = currentLayerNodes[i];
            
            for (let j = 0; j < nextLayerNodes.length; j++) {
                const endNode = nextLayerNodes[j];
                
                // Create line geometry
                const lineGeometry = new THREE.BufferGeometry();
                const lineMaterial = new THREE.LineBasicMaterial({ 
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.3
                });
                
                // Set line positions
                const positions = new Float32Array([
                    startNode.position.x, startNode.position.y, startNode.position.z,
                    endNode.position.x, endNode.position.y, endNode.position.z
                ]);
                
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                // Create line
                const line = new THREE.Line(lineGeometry, lineMaterial);
                group.add(line);
            }
        }
    }
    
    return group;
}

/**
 * Create an image recognition model visualization
 * @returns {THREE.Group} Image recognition model
 */
function createImageRecognitionModel() {
    const group = new THREE.Group();
    
    // Create a grid of cubes representing pixels
    const gridSize = 8;
    const cubeSize = 0.2;
    const spacing = 0.05;
    
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            const brightness = Math.random();
            
            const cubeMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(brightness, brightness, brightness),
                roughness: 0.3,
                metalness: 0.7
            });
            
            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
                cubeMaterial
            );
            
            const xPos = (x - gridSize / 2) * (cubeSize + spacing);
            const yPos = (y - gridSize / 2) * (cubeSize + spacing);
            cube.position.set(xPos, yPos, 0);
            
            group.add(cube);
        }
    }
    
    // Add label/classification visual element
    const labelGeometry = new THREE.PlaneGeometry(3, 0.5);
    const labelMaterial = new THREE.MeshBasicMaterial({
        color: 0x39FF14,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(0, -2, 0);
    group.add(label);
    
    return group;
}

/**
 * Create an NLP model visualization
 * @returns {THREE.Group} NLP model
 */
function createNLPModel() {
    const group = new THREE.Group();
    
    // Create a text-like structure with connected dots
    const wordCount = 5;
    const letterCount = 4;
    const letterSpacing = 0.3;
    const wordSpacing = 1.5;
    
    // Colors
    const colors = [
        new THREE.Color(0x39FF14), // Neon green
        new THREE.Color(0x7B4DFF), // Purple
        new THREE.Color(0xFF00FF), // Pink
        new THREE.Color(0x00F5FF)  // Teal
    ];
    
    for (let word = 0; word < wordCount; word++) {
        for (let letter = 0; letter < letterCount; letter++) {
            const dotMaterial = new THREE.MeshStandardMaterial({
                color: colors[word % colors.length],
                emissive: colors[word % colors.length],
                emissiveIntensity: 0.3,
                roughness: 0.3,
                metalness: 0.8
            });
            
            const dot = new THREE.Mesh(
                new THREE.SphereGeometry(0.15, 16, 16),
                dotMaterial
            );
            
            // Position the dot
            const xPos = letter * letterSpacing - (letterCount * letterSpacing) / 2;
            const yPos = word * -wordSpacing + (wordCount * wordSpacing) / 2 - wordSpacing;
            
            dot.position.set(xPos, yPos, 0);
            group.add(dot);
            
            // Connect dots in each word
            if (letter > 0) {
                const prevDot = group.children[group.children.length - 2];
                
                const lineGeometry = new THREE.BufferGeometry();
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: colors[word % colors.length],
                    transparent: true,
                    opacity: 0.5
                });
                
                const positions = new Float32Array([
                    prevDot.position.x, prevDot.position.y, prevDot.position.z,
                    dot.position.x, dot.position.y, dot.position.z
                ]);
                
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                const line = new THREE.Line(lineGeometry, lineMaterial);
                group.add(line);
            }
        }
    }
    
    return group;
}

/**
 * Create a data visualization model
 * @returns {THREE.Group} Data visualization model
 */
function createDataVizModel() {
    const group = new THREE.Group();
    
    // Create bar chart
    const barCount = 8;
    const barWidth = 0.4;
    const barSpacing = 0.2;
    const maxBarHeight = 3;
    
    // Colors for gradient
    const colors = [
        new THREE.Color(0x39FF14), // Neon green
        new THREE.Color(0x7B4DFF), // Purple
        new THREE.Color(0xFF00FF), // Pink
        new THREE.Color(0x00F5FF)  // Teal
    ];
    
    for (let i = 0; i < barCount; i++) {
        const barHeight = Math.random() * maxBarHeight + 0.5;
        
        const barMaterial = new THREE.MeshStandardMaterial({
            color: colors[i % colors.length],
            emissive: colors[i % colors.length],
            emissiveIntensity: 0.3,
            roughness: 0.3,
            metalness: 0.8,
            transparent: true,
            opacity: 0.9
        });
        
        const bar = new THREE.Mesh(
            new THREE.BoxGeometry(barWidth, barHeight, barWidth),
            barMaterial
        );
        
        const xPos = i * (barWidth + barSpacing) - (barCount * (barWidth + barSpacing)) / 2 + barWidth / 2;
        bar.position.set(xPos, barHeight / 2 - 1.5, 0);
        
        group.add(bar);
    }
    
    return group;
}

/**
 * Create a reinforcement learning model visualization
 * @returns {THREE.Group} Reinforcement learning model
 */
function createReinforcementModel() {
    const group = new THREE.Group();
    
    // Create a grid environment with an agent
    const gridSize = 5;
    const cellSize = 0.5;
    const gridSpacing = 0.1;
    
    // Create grid cells
    for (let x = 0; x < gridSize; x++) {
        for (let z = 0; z < gridSize; z++) {
            const cellMaterial = new THREE.MeshStandardMaterial({
                color: 0x1A1F2B,
                roughness: 0.8,
                metalness: 0.2,
                transparent: true,
                opacity: 0.7
            });
            
            const cell = new THREE.Mesh(
                new THREE.BoxGeometry(cellSize, 0.1, cellSize),
                cellMaterial
            );
            
            const xPos = (x - gridSize / 2) * (cellSize + gridSpacing) + cellSize / 2;
            const zPos = (z - gridSize / 2) * (cellSize + gridSpacing) + cellSize / 2;
            cell.position.set(xPos, 0, zPos);
            
            group.add(cell);
        }
    }
    
    // Add the agent (sphere)
    const agentMaterial = new THREE.MeshStandardMaterial({
        color: 0x39FF14,
        emissive: 0x39FF14,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });
    
    const agent = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        agentMaterial
    );
    
    agent.position.set(0, 0.2, 0);
    group.add(agent);
    
    // Add goal
    const goalMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF00FF,
        emissive: 0xFF00FF,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
    });
    
    const goal = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        goalMaterial
    );
    
    goal.position.set(cellSize * 2, 0.2, cellSize * 2);
    group.add(goal);
    
    // Rotate entire group for better viewing angle
    group.rotation.x = -Math.PI / 4;
    
    return group;
}

/**
 * Create a chatbot visualization model
 * @returns {THREE.Group} Chatbot model
 */
function createChatbotModel() {
    const group = new THREE.Group();
    
    // Create chat bubbles
    const bubbleCount = 3;
    const bubbleWidth = 3;
    const bubbleHeight = 0.8;
    const bubbleSpacing = 1.2;
    
    // Colors for gradient
    const colors = [
        new THREE.Color(0x39FF14), // Neon green
        new THREE.Color(0x7B4DFF), // Purple
        new THREE.Color(0x00F5FF)  // Teal
    ];
    
    for (let i = 0; i < bubbleCount; i++) {
        // Create rounded rectangle for chat bubble
        const bubbleGeometry = new THREE.PlaneGeometry(bubbleWidth, bubbleHeight);
        const bubbleMaterial = new THREE.MeshStandardMaterial({
            color: colors[i % colors.length],
            roughness: 0.3,
            metalness: 0.7,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        
        // Position alternating left and right
        const xPos = (i % 2 === 0) ? -0.8 : 0.8;
        const yPos = i * -bubbleSpacing + bubbleSpacing;
        
        bubble.position.set(xPos, yPos, 0);
        
        group.add(bubble);
    }
    
    return group;
}

/**
 * Handle window resize
 */
function onWindowResize() {
    if (heroCamera && heroRenderer) {
        // Update hero scene
        heroCamera.aspect = window.innerWidth / window.innerHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Update project scenes
    for (const projectId in projectScenes) {
        const project = projectScenes[projectId];
        const container = document.querySelector(`.project-3d-container[data-project="${projectId}"]`);
        
        if (container && project.camera && project.renderer) {
            project.camera.aspect = container.clientWidth / container.clientHeight;
            project.camera.updateProjectionMatrix();
            project.renderer.setSize(container.clientWidth, container.clientHeight);
        }
    }
}

/**
 * Animation loop
 */
function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // Throttle rendering
    if (currentTime - lastRenderTime < RENDER_INTERVAL) return;
    lastRenderTime = currentTime;
    
    // Check if tab is visible
    if (document.hidden) return;
    
    // Animate hero scene
    if (isElementInViewport(document.getElementById('hero-canvas'))) {
        animateHeroScene();
    }
    
    // Animate project scenes
    animateProjectScenes();
}

/**
 * Animate hero scene
 */
function animateHeroScene() {
    if (!heroScene || !heroCamera || !heroRenderer) return;
    
    // Update particle positions
    if (particles.length > 0) {
        const positions = heroScene.children[0].geometry.attributes.position.array;
        
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            const i3 = i * 3;
            
            // Update position based on velocity
            particle.position.x += particle.velocity.x;
            particle.position.y += particle.velocity.y;
            particle.position.z += particle.velocity.z;
            
            // Apply gravitational force to return to original position
            const dx = particle.originalPosition.x - particle.position.x;
            const dy = particle.originalPosition.y - particle.position.y;
            const dz = particle.originalPosition.z - particle.position.z;
            
            particle.velocity.x += dx * 0.0008;
            particle.velocity.y += dy * 0.0008;
            particle.velocity.z += dz * 0.0008;
            
            // Apply damping
            particle.velocity.x *= 0.99;
            particle.velocity.y *= 0.99;
            particle.velocity.z *= 0.99;
            
            // Update position array
            positions[i3] = particle.position.x;
            positions[i3 + 1] = particle.position.y;
            positions[i3 + 2] = particle.position.z;
        }
        
        // Mark positions for update
        heroScene.children[0].geometry.attributes.position.needsUpdate = true;
    }
    
    // Rotate the scene slightly
    heroScene.rotation.y += 0.001;
    heroScene.rotation.x += 0.0005;
    
    // Render the scene
    heroRenderer.render(heroScene, heroCamera);
}

/**
 * Animate project scenes
 */
function animateProjectScenes() {
    for (const projectId in projectScenes) {
        const project = projectScenes[projectId];
        
        // Check if the project is visible to optimize rendering
        const container = document.querySelector(`.project-3d-container[data-project="${projectId}"]`);
        
        if (container && isElementInViewport(container)) {
            // Rotate the object
            if (project.object) {
                project.object.rotation.y += 0.01;
                
                // Different animations based on project type
                switch(projectId) {
                    case 'neural-network':
                        project.object.rotation.z += 0.003;
                        break;
                    case 'reinforcement':
                        // Animate agent moving
                        const agent = project.object.children.find(child => 
                            child.geometry && child.geometry.type === 'SphereGeometry');
                        
                        if (agent) {
                            const time = Date.now() * 0.001;
                            agent.position.x = Math.sin(time) * 1;
                            agent.position.z = Math.cos(time) * 1;
                        }
                        break;
                    case 'data-viz':
                        // Animate bar height changes
                        project.object.children.forEach((child, index) => {
                            if (child.geometry && child.geometry.type === 'BoxGeometry') {
                                const time = Date.now() * 0.001 + index;
                                const newHeight = Math.sin(time) * 0.5 + 2;
                                
                                child.scale.y = newHeight;
                                child.position.y = newHeight / 2 - 1.5;
                            }
                        });
                        break;
                }
            }
            
            // Render the scene
            project.renderer.render(project.scene, project.camera);
        }
    }
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} el - The element to check
 * @returns {Boolean} - True if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right > 0
    );
}

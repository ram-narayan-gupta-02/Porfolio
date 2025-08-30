/**
 * Interactive Skill Tree Component
 * Creates an animated skill tree visualization
 */

// Global variables
let skillTreeContainer;
let skillTreeCanvas;
let skillTreeCtx;
let skillTreeNodes = [];
let skillTreeConnections = [];
let hoveredNode = null;
let focusedNode = null;
let animationFrame;

// Skills data structure
const skillTreeData = {
    core: {
        name: 'AI/ML Core',
        description: 'Foundation of artificial intelligence and machine learning',
        icon: 'fas fa-brain',
        color: '#7B4DFF',
        x: 0.5,
        y: 0.35,
        size: 1.5,
        skills: ['Mathematics', 'Statistics', 'Algorithms', 'Data Structures']
    },
    children: [
        {
            name: 'Machine Learning',
            description: 'Algorithms and statistical models',
            icon: 'fas fa-cogs',
            color: '#39FF14',
            x: 0.25,
            y: 0.6,
            size: 1.2,
            skills: ['Supervised Learning', 'Unsupervised Learning', 'Ensemble Methods', 'Feature Engineering']
        },
        {
            name: 'Deep Learning',
            description: 'Neural network architectures and techniques',
            icon: 'fas fa-network-wired',
            color: '#FF00FF',
            x: 0.75,
            y: 0.6,
            size: 1.2,
            skills: ['Neural Networks', 'CNN', 'RNN', 'Transformers', 'GAN']
        },
        {
            name: 'Data Science',
            description: 'Extracting insights from data',
            icon: 'fas fa-chart-bar',
            color: '#00F5FF',
            x: 0.1,
            y: 0.8,
            size: 1,
            skills: ['Data Analysis', 'Visualization', 'Exploratory Data Analysis', 'Feature Selection']
        },
        {
            name: 'Computer Vision',
            description: 'Image and video analysis',
            icon: 'fas fa-eye',
            color: '#39FF14',
            x: 0.4,
            y: 0.8,
            size: 1,
            skills: ['Image Classification', 'Object Detection', 'Segmentation', 'Facial Recognition']
        },
        {
            name: 'NLP',
            description: 'Processing and understanding language',
            icon: 'fas fa-language',
            color: '#FF00FF',
            x: 0.6,
            y: 0.8,
            size: 1,
            skills: ['Text Classification', 'Named Entity Recognition', 'Sentiment Analysis', 'Machine Translation']
        },
        {
            name: 'Reinforcement Learning',
            description: 'Learning through interaction with environment',
            icon: 'fas fa-gamepad',
            color: '#00F5FF',
            x: 0.9,
            y: 0.8,
            size: 1,
            skills: ['Q-Learning', 'Policy Gradients', 'Deep RL', 'Multi-agent Systems']
        }
    ]
};

// Initialize skill tree when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSkillTree();
});

/**
 * Initialize skill tree
 */
function initSkillTree() {
    skillTreeContainer = document.getElementById('skill-tree-container');
    
    if (skillTreeContainer) {
        // Create canvas element
        createSkillTreeCanvas();
        
        // Create nodes from data
        createSkillTreeNodes();
        
        // Set up event listeners
        addSkillTreeEventListeners();
        
        // Start animation loop
        animateSkillTree();
    }
}

/**
 * Create skill tree canvas
 */
function createSkillTreeCanvas() {
    // Create canvas
    skillTreeCanvas = document.createElement('canvas');
    skillTreeCanvas.id = 'skill-tree-canvas';
    skillTreeCanvas.className = 'w-full h-full';
    
    // Set dimensions
    const containerRect = skillTreeContainer.getBoundingClientRect();
    skillTreeCanvas.width = containerRect.width;
    skillTreeCanvas.height = containerRect.height;
    
    // Add canvas to container
    skillTreeContainer.appendChild(skillTreeCanvas);
    
    // Get context
    skillTreeCtx = skillTreeCanvas.getContext('2d');
}

/**
 * Create skill tree nodes from data
 */
function createSkillTreeNodes() {
    // Clear existing nodes
    skillTreeNodes = [];
    skillTreeConnections = [];
    
    // Create core node
    const coreNode = {
        id: 'core',
        name: skillTreeData.core.name,
        description: skillTreeData.core.description,
        icon: skillTreeData.core.icon,
        color: skillTreeData.core.color,
        x: skillTreeData.core.x * skillTreeCanvas.width,
        y: skillTreeData.core.y * skillTreeCanvas.height,
        targetX: skillTreeData.core.x * skillTreeCanvas.width,
        targetY: skillTreeData.core.y * skillTreeCanvas.height,
        radius: 40 * skillTreeData.core.size,
        skills: skillTreeData.core.skills,
        isCoreNode: true
    };
    
    skillTreeNodes.push(coreNode);
    
    // Create child nodes
    skillTreeData.children.forEach((childData, index) => {
        const childNode = {
            id: `node-${index}`,
            name: childData.name,
            description: childData.description,
            icon: childData.icon,
            color: childData.color,
            x: childData.x * skillTreeCanvas.width,
            y: childData.y * skillTreeCanvas.height,
            targetX: childData.x * skillTreeCanvas.width,
            targetY: childData.y * skillTreeCanvas.height,
            radius: 30 * childData.size,
            skills: childData.skills,
            isCoreNode: false
        };
        
        skillTreeNodes.push(childNode);
        
        // Create connection to core
        skillTreeConnections.push({
            from: coreNode,
            to: childNode,
            color: childData.color,
            width: 3,
            energy: 0
        });
    });
}

/**
 * Add event listeners for skill tree
 */
function addSkillTreeEventListeners() {
    // Handle mouse movement
    skillTreeCanvas.addEventListener('mousemove', (e) => {
        const rect = skillTreeCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Check if hovering over a node
        let hovering = false;
        
        for (let i = 0; i < skillTreeNodes.length; i++) {
            const node = skillTreeNodes[i];
            const distance = Math.sqrt(
                Math.pow(mouseX - node.x, 2) + Math.pow(mouseY - node.y, 2)
            );
            
            if (distance < node.radius) {
                hoveredNode = node;
                hovering = true;
                
                // Change cursor
                skillTreeCanvas.style.cursor = 'pointer';
                break;
            }
        }
        
        if (!hovering) {
            hoveredNode = null;
            skillTreeCanvas.style.cursor = 'default';
        }
    });
    
    // Handle clicks
    skillTreeCanvas.addEventListener('click', () => {
        if (hoveredNode) {
            focusedNode = hoveredNode;
            updateSkillDetails(focusedNode);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Resize canvas
        const containerRect = skillTreeContainer.getBoundingClientRect();
        skillTreeCanvas.width = containerRect.width;
        skillTreeCanvas.height = containerRect.height;
        
        // Recalculate node positions
        createSkillTreeNodes();
    });
}

/**
 * Update skill details section
 * @param {Object} node - Skill node
 */
function updateSkillDetails(node) {
    const detailsContainer = document.getElementById('skill-details');
    
    if (detailsContainer) {
        // Create details content
        detailsContainer.innerHTML = `
            <div class="mb-4 flex items-center">
                <div class="w-12 h-12 flex items-center justify-center rounded-full mr-4" style="background-color: ${node.color}">
                    <i class="${node.icon} text-dark-bg text-xl"></i>
                </div>
                <div>
                    <h3 class="text-2xl font-bold text-white">${node.name}</h3>
                    <p class="text-gray-400">${node.description}</p>
                </div>
            </div>
            
            <div class="space-y-3">
                <h4 class="text-lg font-semibold text-white">Key Skills:</h4>
                <ul class="space-y-2">
                    ${node.skills.map(skill => `
                        <li class="flex items-center">
                            <span class="w-2 h-2 rounded-full mr-2" style="background-color: ${node.color}"></span>
                            ${skill}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        
        // Animate in
        detailsContainer.style.opacity = 0;
        detailsContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            detailsContainer.style.opacity = 1;
            detailsContainer.style.transform = 'translateY(0)';
        }, 50);
    }
}

/**
 * Animate skill tree
 */
function animateSkillTree() {
    // Clear canvas
    skillTreeCtx.clearRect(0, 0, skillTreeCanvas.width, skillTreeCanvas.height);
    
    // Draw connections
    drawConnections();
    
    // Draw nodes
    drawNodes();
    
    // Continue animation loop
    animationFrame = requestAnimationFrame(animateSkillTree);
}

/**
 * Draw connections between nodes
 */
function drawConnections() {
    // Draw normal connections
    skillTreeConnections.forEach(connection => {
        // Update energy pulse
        connection.energy = (connection.energy + 0.01) % 1;
        
        // Draw connection line
        skillTreeCtx.beginPath();
        skillTreeCtx.moveTo(connection.from.x, connection.from.y);
        skillTreeCtx.lineTo(connection.to.x, connection.to.y);
        skillTreeCtx.strokeStyle = connection.color;
        skillTreeCtx.lineWidth = connection.width;
        skillTreeCtx.stroke();
        
        // Draw energy pulses
        const pulse1Pos = connection.energy;
        const pulse2Pos = (connection.energy + 0.5) % 1;
        
        drawPulse(connection, pulse1Pos);
        drawPulse(connection, pulse2Pos);
    });
}

/**
 * Draw energy pulse on connection
 * @param {Object} connection - Connection object
 * @param {Number} position - Position along the connection (0-1)
 */
function drawPulse(connection, position) {
    // Calculate pulse position
    const x = connection.from.x + (connection.to.x - connection.from.x) * position;
    const y = connection.from.y + (connection.to.y - connection.from.y) * position;
    
    // Draw pulse
    skillTreeCtx.beginPath();
    skillTreeCtx.arc(x, y, 4, 0, Math.PI * 2);
    skillTreeCtx.fillStyle = connection.color;
    skillTreeCtx.fill();
    
    // Draw glow
    const gradient = skillTreeCtx.createRadialGradient(x, y, 0, x, y, 15);
    gradient.addColorStop(0, connection.color);
    gradient.addColorStop(1, 'transparent');
    
    skillTreeCtx.beginPath();
    skillTreeCtx.arc(x, y, 15, 0, Math.PI * 2);
    skillTreeCtx.fillStyle = gradient;
    skillTreeCtx.fill();
}

/**
 * Draw skill nodes
 */
function drawNodes() {
    skillTreeNodes.forEach(node => {
        // Apply subtle floating animation
        node.y = node.targetY + Math.sin(Date.now() * 0.001 + node.x) * 5;
        
        // Draw node
        skillTreeCtx.beginPath();
        skillTreeCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        
        // Gradient fill
        const gradient = skillTreeCtx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.radius
        );
        
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(1, hexToRgba(node.color, 0.6));
        
        skillTreeCtx.fillStyle = gradient;
        skillTreeCtx.fill();
        
        // Draw border
        skillTreeCtx.strokeStyle = node.color;
        skillTreeCtx.lineWidth = 2;
        skillTreeCtx.stroke();
        
        // Draw glow if hovered or focused
        if (node === hoveredNode || node === focusedNode) {
            skillTreeCtx.beginPath();
            skillTreeCtx.arc(node.x, node.y, node.radius + 10, 0, Math.PI * 2);
            
            const glowGradient = skillTreeCtx.createRadialGradient(
                node.x, node.y, node.radius,
                node.x, node.y, node.radius + 10
            );
            
            glowGradient.addColorStop(0, hexToRgba(node.color, 0.5));
            glowGradient.addColorStop(1, 'transparent');
            
            skillTreeCtx.fillStyle = glowGradient;
            skillTreeCtx.fill();
        }
        
        // Draw icon
        drawNodeIcon(node);
        
        // Draw name if big enough or hovered/focused
        if (node.radius > 25 || node === hoveredNode || node === focusedNode) {
            drawNodeName(node);
        }
    });
}

/**
 * Draw icon in node
 * @param {Object} node - Skill node
 */
function drawNodeIcon(node) {
    // Create temporary canvas for text rendering
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Calculate icon size based on node radius
    const iconSize = Math.max(12, node.radius * 0.6);
    
    // Load Font Awesome (hack using a temporary element)
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.top = '-9999px';
    tempElement.style.left = '-9999px';
    tempElement.className = node.icon;
    document.body.appendChild(tempElement);
    
    // Get computed icon content (this is a simplification and may not work with all icons)
    const iconCode = getIconUnicode(node.icon);
    const fontFamily = 'FontAwesome';
    
    // Clean up
    document.body.removeChild(tempElement);
    
    // Draw icon
    skillTreeCtx.font = `${iconSize}px ${fontFamily}`;
    skillTreeCtx.fillStyle = 'rgba(26, 31, 43, 0.9)';
    skillTreeCtx.textAlign = 'center';
    skillTreeCtx.textBaseline = 'middle';
    
    if (iconCode) {
        skillTreeCtx.fillText(iconCode, node.x, node.y);
    } else {
        // Fallback
        skillTreeCtx.fillText('?', node.x, node.y);
    }
}

/**
 * Draw node name below node
 * @param {Object} node - Skill node
 */
function drawNodeName(node) {
    skillTreeCtx.font = '14px Arial, sans-serif';
    skillTreeCtx.fillStyle = 'white';
    skillTreeCtx.textAlign = 'center';
    skillTreeCtx.textBaseline = 'top';
    
    skillTreeCtx.fillText(node.name, node.x, node.y + node.radius + 10);
}

/**
 * Get unicode for Font Awesome icon (simplified approach)
 * @param {String} iconClass - Icon class name
 * @returns {String} Unicode character or null
 */
function getIconUnicode(iconClass) {
    // This is a simplified approach - in a real implementation
    // you would need a more robust way to get the icon unicode
    
    // Map some common icon classes to their unicode equivalents
    const iconMap = {
        'fas fa-brain': '\uf5dc',
        'fas fa-cogs': '\uf085',
        'fas fa-network-wired': '\uf6ff',
        'fas fa-chart-bar': '\uf080',
        'fas fa-eye': '\uf06e',
        'fas fa-language': '\uf1ab',
        'fas fa-gamepad': '\uf11b'
    };
    
    return iconMap[iconClass] || null;
}

/**
 * Convert hex color to rgba
 * @param {String} hex - Hex color code
 * @param {Number} alpha - Alpha value (0-1)
 * @returns {String} RGBA color string
 */
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
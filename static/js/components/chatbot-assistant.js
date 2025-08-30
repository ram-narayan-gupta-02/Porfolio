/**
 * Chatbot Assistant Component
 * Creates an interactive chatbot that helps users navigate the portfolio
 */

// Global variables
let chatbotToggle;
let chatbotContainer;
let chatbotMessages;
let chatbotInput;
let chatbotVisible = false;

// Chatbot responses
const chatbotResponses = {
    greeting: [
        "Hello! I'm your AI assistant for Ram's portfolio. How can I help you today?",
        "Welcome to Ram's AI/ML portfolio! What would you like to know about?",
        "Hi there! I'm here to help you learn about Ram's work and skills. What interests you?"
    ],
    portfolio: [
        "This portfolio showcases Ram's expertise in AI/ML development, with a focus on building intelligent systems and applications. Feel free to explore the different sections or ask me specific questions about his skills, experience, or projects.",
        "Ram's portfolio demonstrates his capabilities in AI/ML engineering, featuring projects in natural language processing, machine learning, and data science. What would you like to know more about?"
    ],
    website_tech: [
        "This portfolio website is built using modern technologies including: HTML5 and CSS3 for structure and styling, JavaScript for interactivity, Tailwind CSS for responsive design, Flask backend for server functionality, Render for deployment and hosting. It also incorporates ChatGPT integration and ML techniques for the interactive chatbot assistant.",
        "The tech stack used in this website includes: Frontend: HTML, CSS (Tailwind), JavaScript | Backend: Flask | Deployment: Render hosting | AI Features: ChatGPT integration and ML techniques for enhanced interaction | Additional libraries for animations and 3D effects"
    ],
    education: [
        "Ram is pursuing B.Tech in Computer Science & Engineering at RBS Engineering Technical Campus, Agra. I can tell you more about specific courses or you can check the Education section for complete details.",
        "Currently enrolled in B.Tech (CSE) at GL Bajaj Group of Institutions. Visit the Education section for more information about coursework and achievements."
    ],
    skills: [
        "This portfolio showcases various AI/ML skills including machine learning, deep learning, and data science. You can find more details in the Skills section!",
        "The Skills section highlights expertise in various AI/ML domains like neural networks, computer vision. Check out the interactive skill tree!",
        "AI/ML skills featured in this portfolio include data science, machine learning algorithms, deep learning architectures, and more. The Skills section has an interactive visualization!"
    ],
    projects: [
        "You can find several AI/ML projects in the Projects section. Each project includes details on the technologies used and key features implemented.",
        "The portfolio showcases various projects related to AI/ML. You can explore them in the Projects section to see examples of practical applications.",
        "Check out the Projects section to see examples of work in neural networks and more!"
    ],
    contact: [
        "You can get in touch through the Contact section at the bottom of the page. Feel free to send a message!",
        "To contact the portfolio owner, scroll down to the Contact section where you'll find a form and contact details.",
        "Reach out through the Contact section below. You can send a direct message or use the provided contact information."
    ],
    experience: [
        "Professional experience in AI/ML is detailed in the Experience timeline. It shows career progression and key achievements.",
        "The Experience section provides a timeline of professional roles and accomplishments in the AI/ML field.",
        "Check out the Experience section for a detailed timeline of professional history, including roles and key projects."
    ],
    technologies: [
        "This portfolio itself uses HTML, CSS (Tailwind), JavaScript, and Three.js for 3D visualizations. The projects showcase various AI/ML technologies like TensorFlow, PyTorch, and more.",
        "The tech stack for this portfolio includes JavaScript with Three.js for 3D visuals. The featured projects use various AI/ML frameworks like TensorFlow and PyTorch.",
        "This site is built with HTML, Tailwind CSS, and JavaScript with Three.js for the 3D elements. The showcased projects use various AI/ML technologies."
    ],
    notFound: [
        "I'm not sure I understood that. Could you rephrase or ask about skills, projects, experience, or how to get in contact?",
        "I don't have information about that yet. Would you like to know about skills, projects, experience, or how to get in contact?",
        "Sorry, I'm not sure how to help with that. I can tell you about skills, projects, experience, or how to get in contact!"
    ]
};

// Initialize chatbot when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initChatbotAssistant();
});

/**
 * Initialize chatbot assistant
 */
function initChatbotAssistant() {
    // Create chatbot UI elements
    createChatbotElements();
    
    // Add event listeners
    addChatbotEventListeners();
}

/**
 * Create chatbot UI elements
 */
function createChatbotElements() {
    // Find or create container for chatbot toggle
    let toggleContainer = document.getElementById('chatbot-toggle-container');
    
    if (!toggleContainer) {
        toggleContainer = document.createElement('div');
        toggleContainer.id = 'chatbot-toggle-container';
        toggleContainer.className = 'fixed bottom-6 right-6 z-50';
        document.body.appendChild(toggleContainer);
    }
    
    // Create toggle button
    chatbotToggle = document.createElement('button');
    chatbotToggle.id = 'chatbot-toggle';
    chatbotToggle.className = 'bg-accent-purple hover:bg-accent-pink text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all duration-300';
    chatbotToggle.innerHTML = '<i class="fas fa-robot text-xl"></i>';
    chatbotToggle.setAttribute('aria-label', 'Toggle AI assistant');
    toggleContainer.appendChild(chatbotToggle);
    
    // Create chatbot container
    chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.className = 'fixed bottom-24 right-6 w-80 bg-dark-card border border-dark-border rounded-lg shadow-xl z-50 flex flex-col transition-all duration-300 origin-bottom-right';
    chatbotContainer.style.maxHeight = '400px';
    document.body.appendChild(chatbotContainer);
    
    // Create chatbot header
    const chatbotHeader = document.createElement('div');
    chatbotHeader.className = 'bg-dark-bg border-b border-dark-border p-3 flex items-center justify-between rounded-t-lg';
    chatbotHeader.innerHTML = `
        <div class="flex items-center">
            <div class="w-8 h-8 bg-accent-purple rounded-full flex items-center justify-center mr-2">
                <i class="fas fa-robot text-dark-bg"></i>
            </div>
            <h3 class="font-semibold">AI Assistant</h3>
        </div>
        <button id="close-chatbot" class="text-gray-400 hover:text-white">
            <i class="fas fa-times"></i>
        </button>
    `;
    chatbotContainer.appendChild(chatbotHeader);
    
    // Create chatbot messages container
    chatbotMessages = document.createElement('div');
    chatbotMessages.id = 'chatbot-messages';
    chatbotMessages.className = 'flex-1 p-3 overflow-y-auto space-y-3';
    chatbotContainer.appendChild(chatbotMessages);
    
    // Create chatbot input area
    const chatbotInputArea = document.createElement('div');
    chatbotInputArea.className = 'border-t border-dark-border p-3';
    
    chatbotInputArea.innerHTML = `
        <form id="chatbot-form" class="flex">
            <input 
                type="text" 
                id="chatbot-input" 
                class="flex-1 bg-dark-bg border border-dark-border rounded-l-lg px-3 py-2 focus:outline-none focus:border-accent-purple"
                placeholder="Type your question..." 
                autocomplete="off"
            >
            <button type="submit" class="bg-accent-purple hover:bg-accent-pink text-white rounded-r-lg px-4 py-2 transition-colors">
                <i class="fas fa-paper-plane"></i>
            </button>
        </form>
    `;
    
    chatbotContainer.appendChild(chatbotInputArea);
    
    // Get input element
    chatbotInput = document.getElementById('chatbot-input');
    
    // Add initial greeting
    setTimeout(() => {
        if (!chatbotVisible) {
            toggleChatbot(true);
        }
        addBotMessage(getRandomResponse('greeting'));
    }, 2000);
}

/**
 * Add event listeners for chatbot
 */
function addChatbotEventListeners() {
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', () => {
        toggleChatbot();
    });
    
    // Close chatbot
    document.getElementById('close-chatbot').addEventListener('click', () => {
        toggleChatbot(false);
    });
    
    // Handle form submission
    document.getElementById('chatbot-form').addEventListener('submit', (e) => {
        e.preventDefault();
        sendUserMessage();
    });
    
    // Handle input keypress
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendUserMessage();
        }
    });
}

/**
 * Toggle chatbot visibility
 * @param {Boolean} [show] - Force show/hide state
 */
function toggleChatbot(show) {
    chatbotVisible = show !== undefined ? show : !chatbotVisible;
    
    if (chatbotVisible) {
        chatbotContainer.style.transform = 'scale(1)';
        chatbotContainer.style.opacity = '1';
        chatbotToggle.innerHTML = '<i class="fas fa-times text-xl"></i>';
        chatbotInput.focus();
        
        // Scroll to bottom of messages
        setTimeout(() => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 100);
    } else {
        chatbotContainer.style.transform = 'scale(0)';
        chatbotContainer.style.opacity = '0';
        chatbotToggle.innerHTML = '<i class="fas fa-robot text-xl"></i>';
    }
    
    // Play sound effect if sound is enabled
    if (typeof playSoundEffect === 'function') {
        playSoundEffect('ui');
    }
}

/**
 * Send user message to chatbot
 */
function sendUserMessage() {
    const message = chatbotInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    chatbotInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and get response
    setTimeout(() => {
        processUserMessage(message);
    }, 1000);
}

/**
 * Add user message to chat
 * @param {String} message - User message text
 */
function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'flex justify-end';
    messageElement.innerHTML = `
        <div class="bg-accent-purple text-white py-2 px-4 rounded-lg rounded-tr-none max-w-[80%]">
            <p>${escapeHTML(message)}</p>
        </div>
    `;
    
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/**
 * Add bot message to chat
 * @param {String} message - Bot message text
 */
function addBotMessage(message) {
    // Remove typing indicator if present
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = 'flex';
    messageElement.innerHTML = `
        <div class="bg-dark-bg border border-dark-border py-2 px-4 rounded-lg rounded-tl-none max-w-[80%]">
            <p>${message}</p>
        </div>
    `;
    
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'flex typing-indicator';
    typingElement.innerHTML = `
        <div class="bg-dark-bg border border-dark-border py-2 px-4 rounded-lg rounded-tl-none">
            <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
            </div>
        </div>
    `;
    
    chatbotMessages.appendChild(typingElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/**
 * Process user message and generate response
 * @param {String} message - User message
 */
function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    let responseCategory = 'notFound';
    
    // Check for category matches
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('help')) {
        responseCategory = 'greeting';
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('knowledge') || lowerMessage.includes('expertise') || lowerMessage.includes('know')) {
        responseCategory = 'skills';
    } else if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio') || lowerMessage.includes('demo')) {
        responseCategory = 'projects';
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('message') || lowerMessage.includes('reach')) {
        responseCategory = 'contact';
    } else if (lowerMessage.includes('experience') || lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('work history')) {
        responseCategory = 'experience';
    } else if (lowerMessage.includes('tech') || lowerMessage.includes('stack') || lowerMessage.includes('framework') || lowerMessage.includes('language') || lowerMessage.includes('built') || lowerMessage.includes('website')) {
        responseCategory = 'website_tech';
    } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('about you') || lowerMessage.includes('tell me about') || lowerMessage.includes('who is')) {
        responseCategory = 'portfolio';
    } else if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('degree') || lowerMessage.includes('college')) {
        responseCategory = 'education';
    } else if (lowerMessage.includes('experience') || lowerMessage.includes('work history') || lowerMessage.includes('professional')) {
        responseCategory = 'experience';
    }
    
    // Get random response from category
    const response = getRandomResponse(responseCategory);
    
    // Add response to chat
    addBotMessage(response);
    
    // If not found response, suggest categories
    if (responseCategory === 'notFound') {
        setTimeout(() => {
            addBotMessage("You can ask me about: <br>• Skills and expertise<br>• Projects and portfolio<br>• Professional experience<br>• Contact information<br>• Technologies used");
        }, 1000);
    }
}

/**
 * Get a random response from a category
 * @param {String} category - Response category
 * @returns {String} Random response
 */
function getRandomResponse(category) {
    const responses = chatbotResponses[category] || chatbotResponses.notFound;
    return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Escape HTML special characters
 * @param {String} text - Text to escape
 * @returns {String} Escaped text
 */
function escapeHTML(text) {
    const element = document.createElement('div');
    element.textContent = text;
    return element.innerHTML;
}
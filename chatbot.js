class Chatbot {
    constructor() {
        this.context = {
            previousMessages: [],
            currentTopic: null,
            userPreferences: {},
            lastQuestion: null
        };
        
        this.responses = {
            greeting: [
                "👋 Hello! I'm WebCraft's AI assistant. How can I help you today?",
                "Welcome to WebCraft! I'm here to assist you with our services. What can I help you with?",
                "Hi there! Looking for help with web development? I'm your AI guide!"
            ],
            pricing: [
                "Our packages start from $69/month for the Starter plan. Would you like me to explain our different packages?",
                "We offer various packages tailored to different needs, ranging from $69 to $2499. What type of website are you looking to build?",
                "I can help you find the perfect package for your needs. What features are most important to you?"
            ],
            features: [
                "Our services include responsive design, SEO optimization, custom animations, and much more. What specific features are you interested in?",
                "We offer everything from basic websites to complex e-commerce solutions. Would you like to know more about any specific feature?",
                "Each package comes with different features. Let me know what you're looking for, and I'll recommend the best option!"
            ],
            founder: [
                "Our founder is Kushalsinh Sagar, who established WebCraft with a vision to make premium web development accessible to businesses of all sizes.",
                "Kushalsinh Sagar founded WebCraft and currently serves as the Lead Developer, bringing years of expertise in web development.",
                "WebCraft was founded by Kushalsinh Sagar, who leads our development team and oversees all major projects."
            ],
            company: [
                "WebCraft is a modern web development agency specializing in creating stunning, responsive websites with cutting-edge technologies.",
                "We're a team of passionate developers and designers dedicated to crafting exceptional web experiences.",
                "Founded in 2025, WebCraft has been at the forefront of web development innovation, serving clients worldwide."
            ],
            technology: [
                "We use cutting-edge technologies including React.js, Node.js, Python, and more. Our tech stack is constantly evolving to include the latest innovations.",
                "Our technology stack includes modern frameworks and tools for both frontend and backend development. Would you like to know more about specific technologies?",
                "We employ a comprehensive tech stack including React, Vue.js, Node.js, Python, and various cloud services. What specific technology interests you?"
            ],
            support: [
                "We provide dedicated support for all our packages. Premium packages include 24/7 priority support. How can I assist you?",
                "Need technical help? Our support team is available via chat, email, and phone. What's your preferred method of contact?",
                "I can connect you with our support team or answer basic questions right here. What do you need help with?"
            ],
            custom: [
                "We offer custom solutions tailored to your specific needs. Would you like to discuss your requirements?",
                "Our custom package allows for complete flexibility. What specific features are you looking for?",
                "Let's create something unique together! What's your vision for your website?"
            ],
            location: [
                "We serve clients globally while maintaining our main operations center. Would you like to discuss how we can work together regardless of location?",
                "We're a global company with the capability to serve clients worldwide. Where are you located?",
                "While we operate globally, we maintain strong local support in all major regions. How can we help you?"
            ],
            experience: [
                "We have successfully completed over 500 projects across various industries. Would you like to hear about similar projects to yours?",
                "Our team has extensive experience in web development, having served more than 500 clients worldwide.",
                "With years of experience and hundreds of successful projects, we're well-equipped to handle any web development challenge."
            ],
            timeline: [
                "Project timelines vary based on complexity, but we typically deliver basic websites within 2-4 weeks and complex projects within 2-3 months.",
                "We can provide a detailed timeline after understanding your specific requirements. Would you like to discuss your project?",
                "Each project is unique, but we pride ourselves on efficient delivery while maintaining high quality. What's your target launch date?"
            ]
        };
    }

    getResponse(userMessage) {
        const message = userMessage.toLowerCase();
        this.context.previousMessages.push({ user: true, message: userMessage });

        // Store the last question for context
        this.context.lastQuestion = userMessage;

        // Check for specific questions first
        const specificResponse = this.checkSpecificQuestions(message);
        if (specificResponse) {
            this.context.previousMessages.push({ user: false, message: specificResponse });
            return specificResponse;
        }

        // Determine the topic based on keywords and context
        let topic = this.determineMessageTopic(message);
        this.context.currentTopic = topic;

        let response = this.generateContextAwareResponse(message, topic);
        this.context.previousMessages.push({ user: false, message: response });

        return response;
    }

    checkSpecificQuestions(message) {
        // Common question patterns
        const questionPatterns = {
            founder: ['who founded', 'who is the founder', 'who started', 'who owns', 'who is your founder'],
            location: ['where are you located', 'where is your office', 'where are you based', 'location'],
            timeline: ['how long', 'how much time', 'when can', 'timeline', 'deadline'],
            experience: ['how many projects', 'experience', 'portfolio', 'past work', 'previous work'],
            technology: ['what technology', 'tech stack', 'programming', 'framework', 'platform', 'built with', 'developed with'],
            pricing: ['how much', 'price', 'cost', 'pricing', 'package', 'plan', 'subscription']
        };

        for (const [topic, patterns] of Object.entries(questionPatterns)) {
            if (patterns.some(pattern => message.includes(pattern))) {
                return this.getRandomResponse(topic);
            }
        }

        return null;
    }

    determineMessageTopic(message) {
        const topics = {
            pricing: ['price', 'cost', 'package', 'plan', 'payment', 'expensive', 'cheap', 'budget', 'money', 'afford'],
            features: ['feature', 'service', 'offer', 'include', 'design', 'develop', 'build', 'create', 'make'],
            support: ['help', 'support', 'assist', 'technical', 'issue', 'problem', 'bug', 'error', 'question'],
            custom: ['custom', 'specific', 'unique', 'tailored', 'special', 'bespoke', 'personalized'],
            company: ['company', 'business', 'agency', 'team', 'about', 'history', 'background'],
            technology: ['technology', 'tech', 'stack', 'framework', 'language', 'platform', 'tool']
        };

        for (let [topic, keywords] of Object.entries(topics)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return topic;
            }
        }

        // Check for question words
        const questionWords = ['what', 'how', 'when', 'where', 'why', 'who', 'which'];
        if (questionWords.some(word => message.startsWith(word))) {
            return this.inferTopicFromQuestion(message);
        }

        return 'greeting';
    }

    inferTopicFromQuestion(message) {
        // Add logic to infer the topic from question context
        if (message.includes('cost') || message.includes('price')) return 'pricing';
        if (message.includes('work') || message.includes('do')) return 'features';
        if (message.includes('help') || message.includes('support')) return 'support';
        if (message.includes('technology') || message.includes('built')) return 'technology';
        if (message.includes('company') || message.includes('team')) return 'company';
        return 'custom';
    }

    generateContextAwareResponse(message, topic) {
        // Check for specific questions or keywords
        if (message.includes('hello') || message.includes('hi ')) {
            return this.getRandomResponse('greeting');
        }

        // Generate response based on topic
        let response = this.getRandomResponse(topic);

        // Add follow-up questions based on context
        if (this.context.previousMessages.length > 2) {
            response += this.generateFollowUp(topic);
        }

        return response;
    }

    generateFollowUp(topic) {
        const followUps = {
            pricing: "\n\nWould you like to see a detailed breakdown of our packages?",
            features: "\n\nShall I explain any specific feature in more detail?",
            support: "\n\nWould you like me to connect you with our support team?",
            custom: "\n\nWould you like to schedule a consultation to discuss your custom requirements?",
            technology: "\n\nWould you like to know more about any specific technology we use?",
            company: "\n\nWould you like to learn more about our team or past projects?",
            experience: "\n\nWould you like to see some examples of our work in your industry?"
        };

        return followUps[topic] || "\n\nIs there anything specific you'd like to know more about?";
    }

    getRandomResponse(topic) {
        const responses = this.responses[topic] || this.responses.greeting;
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize chatbot
const chatbot = new Chatbot();

// DOM Elements
const chatToggle = document.querySelector('.chat-toggle');
const chatBox = document.querySelector('.chat-box');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('#chat-input');
const sendButton = document.querySelector('#send-message');

// Event Listeners
chatToggle.addEventListener('click', () => {
    chatBox.classList.toggle('active');
    if (chatBox.classList.contains('active') && chatMessages.children.length === 1) {
        // Add initial greeting
        const response = chatbot.getRandomResponse('greeting');
        appendMessage(response, false);
    }
});

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        appendMessage(message, true);
        chatInput.value = '';

        // Get chatbot response
        setTimeout(() => {
            const response = chatbot.getResponse(message);
            appendMessage(response, false);
        }, 500);
    }
}

function appendMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
} 
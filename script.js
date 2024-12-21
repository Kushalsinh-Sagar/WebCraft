document.addEventListener('DOMContentLoaded', function() {
    // Update URL on navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            window.history.pushState({}, '', `${window.location.pathname}#${section}`);
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });

    // Navbar background opacity on scroll
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.floating-nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Update button hover effects
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#4cd9b0';
        this.style.transform = 'translateY(-2px)';
    });
    ctaButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#64ffda';
        this.style.transform = 'translateY(0)';
    });

    // Add hover effect for secondary button
    const secondaryButton = document.querySelector('.secondary-button');
    secondaryButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
    });
    secondaryButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'transparent';
    });

    // Initialize AOS animation library
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Animate tech stats on scroll
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width;
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.stat-bar').forEach(bar => {
        observer.observe(bar);
    });

    // Cart functionality
    let cart = [];
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');

    // Open/Close cart
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const package = button.dataset.package;
            const price = parseInt(button.dataset.price);
            
            cart.push({ package, price });
            updateCart();
            
            // Show success message
            const toast = document.createElement('div');
            toast.classList.add('toast');
            toast.textContent = 'Package added to cart!';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        });
    });

    function updateCart() {
        cartCount.textContent = cart.length;
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.package} Package</span>
                <span>$${item.price}</span>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalAmount.textContent = `$${total}`;
    }

    // Checkout functionality
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert('Thank you for your purchase! We will contact you shortly.');
        cart = [];
        updateCart();
        cartSidebar.classList.remove('open');
    });

    // Initialize VANTA.NET background
    const vantaConfig = {
        el: "#vanta-background",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 0.75,
        color: 0x64ffda,
        backgroundColor: 0x0a0a0a,
        points: 8.00,
        maxDistance: 15.00,
        spacing: 20.00,
        showDots: true,
        mouseEase: true,
        mouseFactor: 0.3,
        speed: 0.4
    };

    let vantaEffect = VANTA.NET(vantaConfig);

    // Cleanup VANTA effect when leaving home section
    const vantaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && vantaEffect) {
                vantaEffect.destroy();
                vantaEffect = null;
            } else if (entry.isIntersecting && !vantaEffect) {
                vantaEffect = VANTA.NET(vantaConfig);
            }
        });
    }, { threshold: 0.1 });

    vantaObserver.observe(document.querySelector('#home'));

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        if (vantaEffect) {
            vantaEffect.destroy();
        }
    });

    // Custom cursor
    const cursor = document.querySelector('.cursor');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        const ease = 0.2;
        
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effect on interactive elements
    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5) translate(-50%, -50%)';
        });
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1) translate(-50%, -50%)';
        });
    });

    // Initialize Tilt.js for 3D card effect
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5
    });

    // Chat functionality
    const chatToggle = document.querySelector('.chat-toggle');
    const chatBox = document.querySelector('.chat-box');
    const closeChat = document.querySelector('.close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendMessage = document.getElementById('send-message');
    const chatMessages = document.querySelector('.chat-messages');

    const responses = {
        pricing: {
            keywords: ['price', 'cost', 'pricing', 'package', 'plan'],
            responses: [
                "We offer several packages to suit different needs:\n• Basic: $69/month\n• Business: $99/month\n• E-commerce: $169/month\n• Enterprise Plus: $499/month\n• Agency Pro: $799/month\n• Global Enterprise: $1499/month\n• Premium Ultra: $999/month\nWhich package would you like to know more about?",
                "Our pricing starts at $69/month for the Basic package and goes up to $1499/month for our Global Enterprise solution. Would you like me to explain what's included in each package?",
                "I can help you choose the perfect package for your needs. What kind of website are you looking to build?"
            ]
        },
        features: {
            keywords: ['feature', 'include', 'offer', 'service', 'provide'],
            responses: [
                "Our services include:\n• Custom Website Design\n• Responsive Development\n• SEO Optimization\n• E-commerce Solutions\n• 24/7 Support\nWhat specific feature interests you?",
                "We specialize in creating modern, responsive websites with features like custom designs, SEO optimization, and e-commerce integration. What features are you looking for?",
                "Each package comes with unique features. Would you like me to break down what's included in each plan?"
            ]
        },
        support: {
            keywords: ['help', 'support', 'assist', 'issue', 'problem'],
            responses: [
                "Our support team is available 24/7. How can we help you today?",
                "I can connect you with our support team immediately. What issue are you experiencing?",
                "We offer priority support with all our packages. Would you like me to explain our support services?"
            ]
        },
        contact: {
            keywords: ['contact', 'reach', 'email', 'phone', 'call'],
            responses: [
                "You can reach us through:\n• Email: hello@webcraft.com\n• Phone: (555) 123-4567\n• Contact form on our website\nHow would you prefer to connect?",
                "Our team is available Monday-Friday, 9am-6pm EST. Would you like me to have someone contact you?",
                "I can help schedule a consultation call with our team. Would that be helpful?"
            ]
        },
        greeting: {
            keywords: ['hi', 'hello', 'hey', 'howdy', 'greetings'],
            responses: [
                "👋 Hello! I'm WebCraft's AI assistant. How can I help you create your perfect website today?",
                "Hi there! I'd be happy to help you with our web development services. What brings you here today?",
                "Welcome to WebCraft! I'm here to help you bring your web project to life. What can I assist you with?"
            ]
        },
        default: {
            responses: [
                "I'd be happy to help you with your website needs. Could you tell me more about what you're looking for?",
                "I'm here to assist with all your web development questions. What would you like to know?",
                "I can help you choose the perfect solution for your website. What's your main goal?"
            ]
        }
    };

    let conversationContext = {
        lastTopic: null,
        packageDiscussed: null,
        userIntent: null
    };

    chatToggle.addEventListener('click', () => {
        chatBox.classList.toggle('active');
    });

    closeChat.addEventListener('click', () => {
        chatBox.classList.remove('active');
    });

    function getResponse(message) {
        const messageLower = message.toLowerCase();
        
        // Check for greetings first
        if (responses.greeting.keywords.some(word => messageLower.includes(word)) && !conversationContext.lastTopic) {
            conversationContext.lastTopic = 'greeting';
            return getRandomResponse(responses.greeting.responses);
        }
        
        // Check all response categories
        for (const category in responses) {
            if (category !== 'default' && responses[category].keywords) {
                if (responses[category].keywords.some(word => messageLower.includes(word))) {
                    conversationContext.lastTopic = category;
                    
                    // Special handling for package-specific questions
                    if (category === 'pricing') {
                        if (messageLower.includes('basic')) {
                            conversationContext.packageDiscussed = 'basic';
                            return "The Basic package at $69/month includes responsive design, 5 pages, basic SEO, and mobile-friendly design. Would you like to know more about this package?";
                        } else if (messageLower.includes('business')) {
                            conversationContext.packageDiscussed = 'business';
                            return "The Business package at $99/month includes everything in Basic, plus 10 pages, advanced SEO, blog integration, and social media integration. Would you like more details?";
                        } else if (messageLower.includes('premium')) {
                            conversationContext.packageDiscussed = 'premium';
                            return "Our Premium Ultra package at $999/month is our most comprehensive solution with unlimited pages, 3D animations, AI chatbot, and much more. Would you like to see the full feature list?";
                        } else if (messageLower.includes('agency')) {
                            conversationContext.packageDiscussed = 'agency';
                            return "The Agency Pro package at $799/month includes everything in Enterprise Plus, plus white label solutions, client management portal, automated reporting, agency analytics suite, bulk website management, and a dedicated account manager. Would you like to know more?";
                        } else if (messageLower.includes('global')) {
                            conversationContext.packageDiscussed = 'global';
                            return "The Global Enterprise package at $1499/month is our most comprehensive solution for global businesses, including multi-region deployment, enterprise SLA, disaster recovery, compliance management, and 24/7 executive support. Would you like to see the full feature list?";
                        }
                    }
                    
                    return getRandomResponse(responses[category].responses);
                }
            }
        }
        
        // Context-aware follow-up responses
        if (conversationContext.lastTopic) {
            if (messageLower.includes('yes') || messageLower.includes('sure')) {
                switch (conversationContext.lastTopic) {
                    case 'pricing':
                        return "Great! Let me know which specific package interests you: Basic ($69), Business ($99), E-commerce ($169), or Premium Ultra ($999)?";
                    case 'features':
                        return "Excellent! Are you more interested in design features, e-commerce capabilities, or technical aspects?";
                    case 'support':
                        return "Would you prefer to chat with our support team now or schedule a call for later?";
                }
            }
        }
        
        return getRandomResponse(responses.default.responses);
    }

    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'bot');
        messageDiv.innerHTML = message.replace(/\n/g, '<br>');
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatInput.value = '';
            
            setTimeout(() => {
                addMessage(getResponse(message));
            }, 500);
        }
    }

    sendMessage.addEventListener('click', handleMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleMessage();
        }
    });

    // Track mouse position for tech stack glow effect
    document.querySelectorAll('.tech-item').forEach(item => {
        // Create glow effect element
        const glow = document.createElement('div');
        glow.className = 'glow-effect';
        item.appendChild(glow);

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Move the glow effect
            glow.style.left = x + 'px';
            glow.style.top = y + 'px';
        });

        // Reset glow position when mouse leaves
        item.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });

        item.addEventListener('mouseenter', () => {
            glow.style.opacity = '1';
        });
    });

    // Initialize Project and Documentation buttons functionality
    const initializeBtn = document.querySelector('.cta-button');
    const documentationBtn = document.querySelector('.secondary-button');
    const initializeModal = document.getElementById('initializeModal');
    const documentationModal = document.getElementById('documentationModal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('.modal-close');
    const validationForm = document.getElementById('validationForm');

    // Show Initialize Project modal
    initializeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        initializeModal.style.display = 'flex';
        requestAnimationFrame(() => {
            initializeModal.querySelector('.modal').classList.add('active');
        });
    });

    // Show Documentation modal
    documentationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        documentationModal.style.display = 'flex';
        requestAnimationFrame(() => {
            documentationModal.querySelector('.modal').classList.add('active');
        });
    });

    // Close modals when clicking close button or outside
    function closeModal(modal) {
        modal.querySelector('.modal').classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // Handle validation form submission
    validationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const validationNumber = validationForm.querySelector('input').value;
        
        if (validationNumber.length === 6) {
            // Create success message with animation
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <div class="success-icon">✓</div>
                <div class="success-text">
                    <h3>Validation Successful!</h3>
                    <p>Your project is being initialized...</p>
                </div>
            `;
            
            initializeModal.querySelector('.modal').appendChild(successMessage);
            
            // Animate success message
            setTimeout(() => {
                successMessage.classList.add('show');
            }, 100);
            
            // Close modal after delay
            setTimeout(() => {
                closeModal(initializeModal);
                validationForm.reset();
                // Remove success message after modal is closed
                setTimeout(() => {
                    successMessage.remove();
                }, 300);
            }, 2000);
        } else {
            // Show error message
            const input = validationForm.querySelector('input');
            input.classList.add('error');
            input.setCustomValidity('Please enter a valid 6-digit number');
            input.reportValidity();
            
            // Remove error state after animation
            setTimeout(() => {
                input.classList.remove('error');
                input.setCustomValidity('');
            }, 1000);
        }
    });

    // Sign-In button functionality
    const signInBtn = document.createElement('button');
    signInBtn.textContent = 'Sign In';
    signInBtn.className = 'cta-button';
    document.querySelector('.hero-buttons').appendChild(signInBtn);

    const signInModal = document.getElementById('signInModal');
    const signInForm = document.getElementById('signInForm');

    // Show Sign-In modal
    signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        signInModal.style.display = 'flex';
        requestAnimationFrame(() => {
            signInModal.querySelector('.modal').classList.add('active');
        });
    });

    // Handle sign-in form submission
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signInForm.querySelector('input[type="email"]').value;
        const password = signInForm.querySelector('input[type="password"]').value;

        // Simulate authentication
        if (email === 'user@example.com' && password === 'password') {
            alert('Sign-In Successful!');
            closeModal(signInModal);
            signInForm.reset();
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });

    // Add close functionality for sign-in modal
    const signInCloseButton = signInModal.querySelector('.modal-close');
    signInCloseButton.addEventListener('click', () => {
        closeModal(signInModal);
    });

    signInModal.addEventListener('click', (e) => {
        if (e.target === signInModal) {
            closeModal(signInModal);
        }
    });
}); 
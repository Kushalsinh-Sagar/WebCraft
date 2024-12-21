// Smooth scroll and animation setup
const scrollOptions = {
    threshold: 0.2,
    rootMargin: '50px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('feature-card')) {
                entry.target.style.animationPlayState = 'running';
            }
        }
    });
}, scrollOptions);

// Initialize observers
document.addEventListener('DOMContentLoaded', () => {
    // Observe elements for animations
    document.querySelectorAll('.feature-card, .price-card').forEach(element => {
        animationObserver.observe(element);
    });

    // Initialize cart functionality
    initializeCart();
});

// Cart functionality
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
        this.setupEventListeners();
    }

    loadCart() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            return JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
        }
        return JSON.parse(localStorage.getItem('cart_guest')) || [];
    }

    saveCart() {
        const user = JSON.parse(localStorage.getItem('user'));
        const cartKey = user ? `cart_${user.email}` : 'cart_guest';
        localStorage.setItem(cartKey, JSON.stringify(this.items));
    }

    setupEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => this.handleAddToCart(e));
        });

        // Cart page specific listeners
        if (window.location.pathname.includes('cart.html')) {
            this.setupCartPageListeners();
        }
    }

    handleAddToCart(e) {
        const button = e.currentTarget;
        const plan = button.dataset.plan;
        const price = getPlanPrice(plan);
        
        this.addItem(plan, price);
        
        // Show success animation
        button.innerHTML = 'Added! ✓';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = 'Add to Cart';
            button.disabled = false;
        }, 2000);
    }

    setupCartPageListeners() {
        document.querySelector('.cart-items')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const item = e.target.closest('.cart-item');
                const plan = item.dataset.plan;
                const isIncrease = e.target.classList.contains('plus');
                const currentQuantity = parseInt(item.querySelector('.quantity').textContent);
                
                this.updateQuantity(plan, isIncrease ? currentQuantity + 1 : currentQuantity - 1);
                this.renderCart();
            }
            
            if (e.target.classList.contains('remove-item')) {
                const plan = e.target.dataset.plan;
                this.removeItem(plan);
                this.renderCart();
            }
        });
    }

    addItem(plan, price) {
        const existingItem = this.items.find(item => item.plan === plan);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                plan,
                price,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
    }

    removeItem(plan) {
        this.items = this.items.filter(item => item.plan !== plan);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(plan, quantity) {
        const item = this.items.find(item => item.plan === plan);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(plan);
            }
        }
        this.saveCart();
        this.updateCartCount();
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }

    renderCart() {
        const cartItems = document.querySelector('.cart-items');
        const subtotal = document.querySelector('.subtotal');
        const tax = document.querySelector('.tax');
        const total = document.querySelector('.total-amount');

        if (cartItems) {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item" data-plan="${item.plan}">
                    <img src="images/${item.plan}-plan.jpg" alt="${item.plan} plan">
                    <div class="item-details">
                        <h3>${item.plan.charAt(0).toUpperCase() + item.plan.slice(1)} Plan</h3>
                        <p>Monthly Subscription</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <span class="item-price">$${item.price * item.quantity}</span>
                    <button class="remove-item" data-plan="${item.plan}">×</button>
                </div>
            `).join('');

            const subtotalAmount = this.getTotal();
            const taxAmount = subtotalAmount * 0.1; // 10% tax
            const totalAmount = subtotalAmount + taxAmount;

            subtotal.textContent = `$${subtotalAmount.toFixed(2)}`;
            tax.textContent = `$${taxAmount.toFixed(2)}`;
            total.textContent = `$${totalAmount.toFixed(2)}`;
        }
    }
}

// Initialize cart
function initializeCart() {
    window.cart = new Cart();
}

// Helper functions
function getPlanPrice(plan) {
    const prices = {
        'starter': 29,
        'pro': 79,
        'enterprise': 199
    };
    return prices[plan];
}

// Floating navigation
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}); 
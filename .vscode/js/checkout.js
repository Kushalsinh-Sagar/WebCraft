class Checkout {
    constructor() {
        this.setupCheckout();
    }

    setupCheckout() {
        document.querySelector('.checkout-btn')?.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Please login to checkout');
                document.getElementById('authModal').classList.add('active');
                return;
            }
            this.processCheckout();
        });
    }

    async processCheckout() {
        try {
            const submitBtn = document.querySelector('.checkout-btn');
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear cart after successful checkout
            window.cart.items = [];
            window.cart.saveCart();
            window.cart.updateCartCount();
            window.cart.renderCart();

            alert('Order placed successfully! Thank you for your purchase.');
            
            submitBtn.textContent = 'Proceed to Checkout';
            submitBtn.disabled = false;

        } catch (error) {
            alert('Checkout failed. Please try again.');
            console.error('Checkout error:', error);
        }
    }
}

// Initialize checkout
if (window.location.pathname.includes('cart.html')) {
    new Checkout();
} 
class CustomPlanBuilder {
    constructor() {
        this.features = new Map();
        this.setupEventListeners();
        this.updateSummary();
    }

    setupEventListeners() {
        // Feature toggles
        document.querySelectorAll('.feature-toggle input').forEach(toggle => {
            toggle.addEventListener('change', () => this.updateSummary());
        });

        // Scale sliders
        document.querySelectorAll('.scale-slider input').forEach(slider => {
            slider.addEventListener('input', (e) => {
                e.target.previousElementSibling.querySelector('output').textContent = e.target.value;
                this.updateSummary();
            });
        });

        // Add to cart
        document.querySelector('.add-to-cart').addEventListener('click', () => this.addToCart());
    }

    calculateTotal() {
        let total = 0;

        // Calculate features
        document.querySelectorAll('.feature-toggle input:checked').forEach(feature => {
            total += parseFloat(feature.dataset.price);
            this.features.set(feature.dataset.feature, {
                name: feature.nextElementSibling.nextElementSibling.textContent,
                price: parseFloat(feature.dataset.price)
            });
        });

        // Calculate scale options
        document.querySelectorAll('.scale-slider input').forEach(slider => {
            const baseValue = parseInt(slider.min);
            const currentValue = parseInt(slider.value);
            const pricePerUnit = parseFloat(slider.dataset.price);
            const additionalUnits = currentValue - baseValue;
            const cost = additionalUnits * pricePerUnit;
            
            const label = slider.previousElementSibling.textContent.split('\n')[0];
            this.features.set(label, {
                name: `${label}: ${currentValue}`,
                price: cost
            });
            
            total += cost;
        });

        // Calculate bundle savings (10% off if more than 3 features)
        const savings = this.features.size >= 3 ? total * 0.1 : 0;

        return {
            subtotal: total,
            savings: savings,
            total: total - savings
        };
    }

    updateSummary() {
        const { subtotal, savings, total } = this.calculateTotal();
        const selectedFeatures = document.querySelector('.selected-features');
        const summaryHTML = [];

        this.features.forEach(feature => {
            summaryHTML.push(`
                <div class="feature-item">
                    <span>${feature.name}</span>
                    <span>$${feature.price.toFixed(2)}/mo</span>
                </div>
            `);
        });

        selectedFeatures.innerHTML = summaryHTML.join('');
        document.querySelector('.subtotal .amount').textContent = `$${subtotal.toFixed(2)}/mo`;
        document.querySelector('.savings .amount').textContent = `-$${savings.toFixed(2)}/mo`;
        document.querySelector('.total .amount').textContent = `$${total.toFixed(2)}/mo`;
    }

    addToCart() {
        const { total } = this.calculateTotal();
        const customPlan = {
            plan: 'custom',
            price: total,
            features: Array.from(this.features.entries())
        };

        // Add to cart using the global cart instance
        window.cart.addItem('custom', total);
        
        // Show success message
        const button = document.querySelector('.add-to-cart');
        button.textContent = 'Added to Cart!';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.disabled = false;
        }, 2000);
    }
}

// Initialize custom plan builder
document.addEventListener('DOMContentLoaded', () => {
    new CustomPlanBuilder();
}); 
document.addEventListener('DOMContentLoaded', function() {
    const features = {
        core: [
            { name: 'Responsive Design', price: 20 },
            { name: 'Basic SEO Setup', price: 15 },
            { name: 'Contact Form', price: 10 },
            { name: 'Mobile Optimization', price: 25 },
            { name: 'Social Media Integration', price: 20 },
            { name: 'AI Integration', price: 199 },
            { name: 'Advanced Analytics', price: 149 },
            { name: 'API Access', price: 299 }
        ],
        advanced: [
            { name: 'E-commerce Functionality', price: 399 },
            { name: 'Custom Animations', price: 35 },
            { name: 'Blog System', price: 129 },
            { name: 'User Authentication', price: 40 },
            { name: 'Database Integration', price: 45 }
        ],
        addon: [
            { name: 'Premium SEO Package', price: 30 },
            { name: 'Performance Optimization', price: 25 },
            { name: 'Security Package', price: 35 },
            { name: 'Analytics Dashboard', price: 20 },
            { name: 'Maintenance Package', price: 199 },
            { name: '24/7 Priority Support', price: 299 },
            { name: 'Team Training', price: 499 }
        ]
    };

    const featureOptions = document.querySelector('.feature-options');
    const selectedFeatures = document.querySelector('.selected-features');
    const totalPriceElement = document.querySelector('.price');
    let totalPrice = 0;

    // Server pricing constants
    const PRICE_PER_GB = 0.5;
    const PRICE_PER_SERVER = 99;

    // Get slider elements
    const serverCapacity = document.getElementById('serverCapacity');
    const serverCount = document.getElementById('serverCount');
    const capacityValue = document.getElementById('capacityValue');
    const serversValue = document.getElementById('serversValue');

    // Initialize select all checkboxes
    document.querySelectorAll('.select-all').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const category = this.dataset.category;
            const categoryCheckboxes = document.querySelectorAll(`.${category}-features input[type="checkbox"]`);
            categoryCheckboxes.forEach(cb => {
                cb.checked = this.checked;
            });
            // Update summary after selecting/deselecting all
            updatePackageSummary();
        });
    });

    // Function to update select all checkbox state
    function updateSelectAllState(category) {
        const selectAllCheckbox = document.querySelector(`.select-all[data-category="${category}"]`);
        const categoryCheckboxes = document.querySelectorAll(`.${category}-features input[type="checkbox"]`);
        const allChecked = Array.from(categoryCheckboxes).every(cb => cb.checked);
        const someChecked = Array.from(categoryCheckboxes).some(cb => cb.checked);
        
        selectAllCheckbox.checked = allChecked;
        selectAllCheckbox.indeterminate = someChecked && !allChecked;
    }

    // Populate features
    Object.entries(features).forEach(([category, items]) => {
        const container = document.querySelector(`.${category}-features`);
        
        items.forEach(feature => {
            const label = document.createElement('label');
            label.className = 'feature-option';
            label.innerHTML = `
                <input type="checkbox" name="features" value="${feature.name}" data-price="${feature.price}" data-category="${category}">
                <span class="feature-name">${feature.name}</span>
                <span class="feature-price">$${feature.price}/month</span>
            `;
            container.appendChild(label);
        });
    });

    // Handle feature selection with select all state update
    document.querySelectorAll('input[name="features"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updatePackageSummary();
            updateSelectAllState(this.dataset.category);
        });
    });

    // Update slider values
    serverCapacity.addEventListener('input', function() {
        capacityValue.textContent = this.value + 'GB';
        updatePackageSummary();
    });

    serverCount.addEventListener('input', function() {
        serversValue.textContent = this.value;
        updatePackageSummary();
    });

    function updatePackageSummary() {
        selectedFeatures.innerHTML = '';
        totalPrice = 0;

        // Calculate server costs
        const capacityCost = serverCapacity.value * PRICE_PER_GB;
        const serversCost = serverCount.value * PRICE_PER_SERVER;

        // Add server details to summary
        selectedFeatures.innerHTML += `
            <div class="selected-feature">
                <span>Server Capacity (${serverCapacity.value}GB)</span>
                <span>$${capacityCost.toFixed(2)}/month</span>
            </div>
            <div class="selected-feature">
                <span>Servers (${serverCount.value})</span>
                <span>$${serversCost.toFixed(2)}/month</span>
            </div>
        `;

        totalPrice += capacityCost + serversCost;

        // Group selected features by category
        const selectedByCategory = {
            core: [],
            advanced: [],
            addon: []
        };

        // Calculate total features per category
        const totalFeatures = {
            core: features.core.length,
            advanced: features.advanced.length,
            addon: features.addon.length
        };

        // Calculate total price per category
        const categoryTotals = {
            core: features.core.reduce((sum, item) => sum + item.price, 0),
            advanced: features.advanced.reduce((sum, item) => sum + item.price, 0),
            addon: features.addon.reduce((sum, item) => sum + item.price, 0)
        };

        document.querySelectorAll('input[name="features"]:checked').forEach(checkbox => {
            const feature = checkbox.closest('.feature-option');
            const name = feature.querySelector('.feature-name').textContent;
            const price = parseFloat(checkbox.dataset.price);
            const category = checkbox.dataset.category;

            selectedByCategory[category].push({ name, price });
            totalPrice += price;
        });

        // Add category headers and selected features to summary
        Object.entries(selectedByCategory).forEach(([category, items]) => {
            if (items.length > 0) {
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                
                // Check if all features in the category are selected
                if (items.length === totalFeatures[category]) {
                    selectedFeatures.innerHTML += `
                        <div class="category-header">${categoryName} Features</div>
                        <div class="selected-feature fully-included">
                            <span>${categoryName} Package (Fully Included)</span>
                            <span>$${categoryTotals[category].toFixed(2)}/month</span>
                        </div>
                    `;
                } else {
                    selectedFeatures.innerHTML += `
                        <div class="category-header">${categoryName} Features</div>
                    `;
                    items.forEach(item => {
                        selectedFeatures.innerHTML += `
                            <div class="selected-feature">
                                <span>${item.name}</span>
                                <span>$${item.price.toFixed(2)}/month</span>
                            </div>
                        `;
                    });
                }
            }
        });

        // Update total price with proper formatting
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}/month`;
    }

    // Handle package creation
    document.querySelector('.create-package-btn').addEventListener('click', function() {
        if (totalPrice === 0) {
            showCustomModal('Please select at least one feature for your custom package.');
            return;
        }

        showCustomModal('Thank you for creating a custom package! Our team will contact you shortly to discuss the details.');
    });

    // Custom Modal Function
    function showCustomModal(message) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.custom-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h4>WebCraft says</h4>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${message}
                </div>
                <div class="modal-footer">
                    <button class="modal-ok">OK</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Show modal with animation
        setTimeout(() => modal.classList.add('show'), 10);

        // Close modal handlers
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-ok').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}); 
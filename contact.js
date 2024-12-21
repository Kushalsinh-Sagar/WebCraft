// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

function sendEmail(event) {
    event.preventDefault();

    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        to_email: 'kushalsinhsagar@gmail.com'
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            showCustomModal('Thank you for your message! We will get back to you soon.');
            document.getElementById('contact-form').reset();
        }, function(error) {
            showCustomModal('Oops! Something went wrong. Please try again later.');
        })
        .finally(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        });

    return false;
}

function showCustomModal(message) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(5px);
    `;

    modal.innerHTML = `
        <div class="modal-content" style="
            background: rgba(26, 26, 26, 0.95);
            border-radius: 16px;
            width: 90%;
            max-width: 500px;
            border: 1px solid rgba(100, 255, 218, 0.2);
            transform: translateY(-20px);
            transition: transform 0.3s ease;
            overflow: hidden;
        ">
            <div class="modal-header" style="
                padding: 20px;
                background: rgba(100, 255, 218, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(100, 255, 218, 0.2);
            ">
                <h4 style="color: #64ffda; margin: 0; font-size: 1.2rem;">WebCraft says</h4>
                <button class="modal-close" style="
                    background: none;
                    border: none;
                    color: #64ffda;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                ">&times;</button>
            </div>
            <div class="modal-body" style="
                padding: 30px;
                color: #ffffff;
                font-size: 1.1rem;
                line-height: 1.5;
            ">
                ${message}
            </div>
            <div class="modal-footer" style="
                padding: 20px;
                display: flex;
                justify-content: flex-end;
                border-top: 1px solid rgba(100, 255, 218, 0.1);
            ">
                <button class="modal-ok" style="
                    background: #64ffda;
                    color: #0a0a0a;
                    border: none;
                    padding: 10px 30px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">OK</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);

    // Add hover effect for OK button
    const okButton = modal.querySelector('.modal-ok');
    okButton.addEventListener('mouseenter', () => {
        okButton.style.transform = 'translateY(-2px)';
        okButton.style.boxShadow = '0 5px 15px rgba(100, 255, 218, 0.2)';
    });
    okButton.addEventListener('mouseleave', () => {
        okButton.style.transform = 'translateY(0)';
        okButton.style.boxShadow = 'none';
    });

    // Close modal handlers
    const closeModal = () => {
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(-20px)';
        setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-ok').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
} 
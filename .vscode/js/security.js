class SecurityMiddleware {
    constructor() {
        this.setupCSRF();
        this.setupXSS();
        this.setupClickjacking();
    }

    setupCSRF() {
        // Generate CSRF token
        const csrfToken = this.generateToken();
        
        // Add to all forms
        document.querySelectorAll('form').forEach(form => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = '_csrf';
            input.value = csrfToken;
            form.appendChild(input);
        });
    }

    setupXSS() {
        // Sanitize input
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = this.sanitizeInput(e.target.value);
            });
        });
    }

    setupClickjacking() {
        if (window.self !== window.top) {
            window.top.location = window.self.location;
        }
    }

    sanitizeInput(input) {
        return input.replace(/[<>]/g, '');
    }

    generateToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
} 
class Auth {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('user')) || null;
        this.setupAuthUI();
        this.updateAuthState();
    }

    setupAuthUI() {
        // Add modal HTML to the page
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal-overlay" id="authModal">
                <div class="auth-modal">
                    <button class="modal-close">&times;</button>
                    <div class="auth-tabs">
                        <div class="auth-tab active" data-tab="login">Login</div>
                        <div class="auth-tab" data-tab="signup">Sign Up</div>
                    </div>
                    <form class="auth-form active" id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" required>
                        </div>
                        <button type="submit" class="btn-primary">Login</button>
                    </form>
                    <form class="auth-form" id="signupForm">
                        <div class="form-group">
                            <label for="signupName">Name</label>
                            <input type="text" id="signupName" required>
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">Email</label>
                            <input type="email" id="signupEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="signupPassword">Password</label>
                            <input type="password" id="signupPassword" required>
                        </div>
                        <button type="submit" class="btn-primary">Sign Up</button>
                    </form>
                </div>
            </div>
        `);

        this.bindEvents();
    }

    bindEvents() {
        // Auth modal controls
        document.querySelector('.btn-login').addEventListener('click', () => {
            document.getElementById('authModal').classList.add('active');
        });

        document.querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('authModal').classList.remove('active');
        });

        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.auth-tab, .auth-form').forEach(el => el.classList.remove('active'));
                tab.classList.add('active');
                document.querySelector(`.auth-form#${tab.dataset.tab}Form`).classList.add('active');
            });
        });

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, validate with backend
            this.user = { email, name: email.split('@')[0] };
            this.saveUserData();
            this.updateAuthState();
            
            document.getElementById('authModal').classList.remove('active');
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, create account in backend
            this.user = { email, name };
            this.saveUserData();
            this.updateAuthState();
            
            document.getElementById('authModal').classList.remove('active');
        } catch (error) {
            alert('Signup failed. Please try again.');
        }
    }

    saveUserData() {
        localStorage.setItem('user', JSON.stringify(this.user));
    }

    updateAuthState() {
        const loginBtn = document.querySelector('.btn-login');
        if (this.user) {
            loginBtn.textContent = this.user.name;
            // Add logout option
            if (!document.querySelector('.logout-btn')) {
                loginBtn.insertAdjacentHTML('afterend', `
                    <button class="btn-secondary logout-btn">Logout</button>
                `);
                document.querySelector('.logout-btn').addEventListener('click', () => this.logout());
            }
        } else {
            loginBtn.textContent = 'Login';
            document.querySelector('.logout-btn')?.remove();
        }
    }

    logout() {
        this.user = null;
        localStorage.removeItem('user');
        this.updateAuthState();
    }
}

// Initialize auth
const auth = new Auth(); 
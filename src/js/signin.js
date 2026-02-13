import '../scss/auth.scss';

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const emailStep = document.getElementById('email-step');
    const passwordStep = document.getElementById('password-step');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailContinueBtn = document.getElementById('email-continue-btn');
    const signinBtn = document.getElementById('signin-btn');
    const userDisplayEmail = document.getElementById('user-display-email');
    const changeEmailLink = document.getElementById('change-email-link');

    // Registration Form (if on register page)
    const registerForm = document.getElementById('registerForm');

    // Check if on Sign In Page
    if (emailStep) {
        // Auto-fill if returning from registration
        const savedEmail = localStorage.getItem('temp_signin_email');
        if (savedEmail) {
            emailInput.value = savedEmail;
        }

        // Continue Click
        emailContinueBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            if (!email) {
                alert('Enter your email or mobile phone number');
                return;
            }

            // Check if user exists in localStorage (mock DB)
            const users = JSON.parse(localStorage.getItem('amazon_users') || '{}');

            // If debugging/testing, we can auto-register a dummy user
            // users['test@example.com'] = { password: 'password', name: 'Test User' };
            // localStorage.setItem('amazon_users', JSON.stringify(users));

            if (!users[email]) {
                // User not found
                // "If user is not register... want to see please register"
                // Amazon behavior: Prompts to create account or shows error.
                // We will redirect to register page with email pre-filled roughly? or just confirm
                if (confirm('We cannot find an account with this email address. Would you like to create a new account?')) {
                    window.location.href = '/register.html';
                }
                return;
            }

            // Store for reference
            localStorage.setItem('temp_signin_email', email);

            // Switch to password step
            userDisplayEmail.textContent = email;
            emailStep.classList.add('d-none');
            passwordStep.classList.remove('d-none');
        });

        // Sign In Click
        signinBtn.addEventListener('click', () => {
            const password = passwordInput.value;
            if (!password) {
                alert('Enter your password');
                return;
            }

            // Validate credentials
            const email = localStorage.getItem('temp_signin_email');
            const users = JSON.parse(localStorage.getItem('amazon_users') || '{}');

            if (users[email] && users[email].password === password) {
                // Success
                localStorage.setItem('current_user', JSON.stringify(users[email]));

                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                alert('To better protect your account, please re-enter your password then the characters as shown in the image below. (Mock: Wrong password)');
            }
        });

        // Change Email Link
        changeEmailLink.addEventListener('click', (e) => {
            e.preventDefault();
            passwordStep.classList.add('d-none');
            emailStep.classList.remove('d-none');
        });
    }

    // Check if on Register Page
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPass = document.getElementById('reg-password-confirm').value;

            if (password !== confirmPass) {
                alert('Passwords do not match');
                return;
            }

            // Save user
            const users = JSON.parse(localStorage.getItem('amazon_users') || '{}');
            if (users[email]) {
                alert('Email already registered. Please sign in.');
                window.location.href = '/signin.html';
                return;
            }

            users[email] = { name, email, password };
            localStorage.setItem('amazon_users', JSON.stringify(users));

            // Pre-fill signin
            localStorage.setItem('temp_signin_email', email);

            alert('Account created successfully!');
            window.location.href = '/signin.html';
        });
    }
});

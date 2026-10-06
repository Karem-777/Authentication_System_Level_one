document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageEl = document.getElementById('message');
    const loginBtn = document.getElementById('loginBtn');
    const signupLink = document.getElementById('signupLink');


    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function () {
            const isPassword = passwordInput.type === 'password';

            passwordInput.type = isPassword ? 'text' : 'password';
            this.textContent = isPassword ? 'Hide' : 'Show';
            this.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    }


    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        messageEl.textContent = '';
        messageEl.className = '';

        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';

        try {
            const res = await fetch('/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            window.location.href = '/welcome';

        } catch (err) {
            messageEl.textContent = 'Login failed. Please check your credentials.';
            messageEl.classList.add('error');
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    });

    if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/signup'; 
    });
}
});
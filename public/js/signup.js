document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const messageEl = document.getElementById('message');
    const signupBtn = document.getElementById('signupBtn');

    // Toggle password visibility
    const setupToggle = (btnId, inputId) => {
        const btn = document.getElementById(btnId);
        const input = document.getElementById(inputId);

        if (btn && input) {
            btn.addEventListener('click', function () {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                this.textContent = isPassword ? 'Hide' : 'Show';
                this.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            });
        }
    };

    setupToggle('togglePassword', 'password');
    setupToggle('togglePasswordConfirm', 'passwordConfirm');

    // ========== لينك الرجوع لصفحة الـ Login ==========
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/';   // غيّر المسار لو صفحة الـ Login على مسار تاني
        });
    }

    if (!signupForm) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        messageEl.textContent = '';
        messageEl.className = '';

        // Client-side validation
        if (password !== passwordConfirm) {
            messageEl.textContent = 'Passwords do not match.';
            messageEl.classList.add('error');
            return;
        }

        if (password.length < 8) {
            messageEl.textContent = 'Password must be at least 8 characters.';
            messageEl.classList.add('error');
            return;
        }

        signupBtn.disabled = true;
        signupBtn.textContent = 'Creating account...';

        try {
            const res = await fetch('/api/v1/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, passwordConfirm })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Signup failed. Please try again.');
            }

            window.location.href = '/welcome';

        } catch (err) {
            messageEl.textContent = 'Signup failed. Please try again.';
            messageEl.classList.add('error');
        } finally {
            signupBtn.disabled = false;
            signupBtn.textContent = 'Sign Up';
        }
    });
});
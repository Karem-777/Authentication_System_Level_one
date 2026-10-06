document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        const res = await fetch('/api/v1/users/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (res.ok) {
            window.location.href = '/login';
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (err) {
        console.error(err);
        alert('Something went wrong during logout.');
    }
});

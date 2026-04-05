const API = 'http://localhost:5000/api';

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) { alert('Please fill all fields'); return; }

    const role = new URLSearchParams(window.location.search).get('role') || 'student';

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            // Only register if user doesn't exist
            if (data.message === 'Invalid credentials') {
                alert('Wrong password. Try again.');
                return;
            }
            // Register new user
            const reg = await fetch(`${API}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: email.split('@')[0], email, password, role })
            });
            const regData = await reg.json();
            if (!reg.ok) { alert(regData.message); return; }

            // Login after register
            const res2 = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data2 = await res2.json();
            localStorage.setItem('token', data2.token);
            localStorage.setItem('role', data2.role);
        } else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
        }
        window.location.href = 'dashboard.html';
    } catch (err) {
        alert('Server not running. Make sure backend is started.');
    }
}
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }), // Send username and password
        });

        const data = await response.json();

        if (data.success) {
            // Store the JWT token in localStorage for future authenticated requests
            localStorage.setItem('jwtToken', data.token);

            // Redirect based on role
        if (data.role === 'ADMIN') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        } else {
            // Display error message
            document.getElementById('errorMessage').innerText = data.message;
        }
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('errorMessage').innerText = 'An error occurred. Please try again.';
    }
});

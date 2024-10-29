// Function to fetch access keys from the server
async function fetchAccessKeys() {
    const apiUrl = 'http://localhost:8080/api/accesskeys'; // Your backend endpoint for fetching access keys
    const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token from localStorage

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Use the token in the Authorization header
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        populateAccessKeyList(data); // Populate the table with fetched access keys
    } catch (error) {
        console.error('Error fetching access keys:', error);
        document.getElementById('message-container').innerText = 'Failed to load access keys.';
    }
}

// Function to request a new access key from the server
async function requestAccessKey() {
    const apiUrl = 'http://localhost:8080/api/accesskeys/request'; // Backend endpoint for requesting a new access key
    const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token from localStorage

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Use the token in the Authorization header
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Access key requested successfully:', data);

        // Re-fetch the updated list of access keys
        fetchAccessKeys();
    } catch (error) {
        console.error('Error requesting access key:', error);
        document.getElementById('message-container').innerText = 'Failed to request a new access key.';
    }
}

// Function to populate the access key list in the table
function populateAccessKeyList(accessKeys) {
    const tbody = document.getElementById('accesskey-tbody');
    tbody.innerHTML = ''; // Clear existing entries

    accessKeys.forEach(accessKey => {
        const row = `
            <tr>
                <td class="py-2 px-4">${accessKey.accessKeyValue}</td>
                <td class="py-2 px-4">${accessKey.dateOfProcurement}</td>
                <td class="py-2 px-4">${accessKey.expiryDate}</td>
                <td class="py-2 px-4">${accessKey.status}</td>
            </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// Event listener for page load
document.addEventListener('DOMContentLoaded', () => {
    fetchAccessKeys(); // Fetch access keys when the page loads

    document.getElementById('send-button').addEventListener('click', () => {
        requestAccessKey(); // Request a new access key when the button is clicked
    });
});

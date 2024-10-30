// Function to fetch access keys from the server
async function fetchAccessKeys() {
    const apiUrl = 'http://localhost:8080/admin'; // Your backend endpoint for fetching access keys
    const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token from localStorage

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Use the retrieved token
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Populate the access key list
        populateAccessKeyList(data);
        
        // Show message if no access keys are found
        const noAccessKeysMessage = document.getElementById('no-accesskeys-message');
        if (data.length === 0) {
            noAccessKeysMessage.classList.remove('hidden');
        } else {
            noAccessKeysMessage.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error fetching access keys:', error);
    }
}

// Function to revoke an access key by ID
async function revokeAccessKey(accessKeyId) {
    console.log('Revoking access key with ID:', accessKeyId);
    const apiUrl = `http://localhost:8080/admin/accesskeys/revoke/${accessKeyId}`; // Your backend endpoint for revoking access keys
    const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token from localStorage

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT', // Use PUT to update status
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Use the retrieved token
            },
            body: JSON.stringify({ status: 'Revoked' }) // Send new status in request body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Re-fetch the access keys after updating status
        fetchAccessKeys();
    } catch (error) {
        console.error('Error revoking access key:', error);
    }
}

// Function to populate the access key list in the table
function populateAccessKeyList(accessKeys) {
    const tbody = document.getElementById('accesskey-tbody');
    tbody.innerHTML = ''; // Clear existing entries

    accessKeys.forEach(accessKey => {
        console.log('Access Key:', accessKey); // Debugging line to check access key object
        const row = `
            <tr class="hover:bg-gray-100 transition duration-200">
                <td class="px-4 py-2">${accessKey.accessKeyValue}</td>
                <td class="px-4 py-2">${accessKey.status}</td>
                <td class="px-4 py-2">${accessKey.dateOfProcurement}</td>
                <td class="px-4 py-2">${accessKey.expiryDate}</td>
                <td class="px-4 py-2">
                    <button 
                        class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition duration-300" 
                        onclick="revokeAccessKey('${accessKey.accessKeyId}')"> <!-- Use ID for revocation -->
                        Revoke
                    </button>
                </td> 
            </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// Event listener for page load
document.addEventListener('DOMContentLoaded', () => {
    fetchAccessKeys(); // Fetch access keys on page load
});

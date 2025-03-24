// Initialize Plaid Link
const handler = Plaid.create({
    clientName: 'FinTrack',
    env: 'sandbox',
    product: ['transactions'],
    language: 'en',
    countryCodes: ['US']
});

// Function to create link token
async function createLinkToken() {
    try {
        const response = await fetch('/api/plaid/create-link-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create link token');
        }
        
        const data = await response.json();
        return data.link_token;
    } catch (error) {
        console.error('Error creating link token:', error);
        showError('Failed to initialize bank connection. Please try again.');
        throw error;
    }
}

// Function to exchange public token
async function exchangePublicToken(publicToken) {
    try {
        const response = await fetch('/api/plaid/exchange-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ public_token: publicToken })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to exchange token');
        }
        
        const data = await response.json();
        showSuccess('Bank account connected successfully!');
        
        // Update UI to show connected status
        updateConnectionStatus(true);
        
        // Redirect to dashboard after successful connection
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 2000);
    } catch (error) {
        console.error('Error exchanging token:', error);
        showError('Failed to connect bank account. Please try again.');
        throw error;
    }
}

// Function to show success message
function showSuccess(message) {
    const statusDiv = document.getElementById('connection-status');
    statusDiv.innerHTML = `
        <div class="alert alert-success">
            <i class="fas fa-check-circle"></i> ${message}
        </div>
    `;
}

// Function to show error message
function showError(message) {
    const statusDiv = document.getElementById('connection-status');
    statusDiv.innerHTML = `
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle"></i> ${message}
        </div>
    `;
}

// Function to update connection status
function updateConnectionStatus(connected) {
    const statusBadge = document.getElementById('connection-status-badge');
    if (connected) {
        statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Connected';
        statusBadge.classList.remove('badge-warning');
        statusBadge.classList.add('badge-success');
    } else {
        statusBadge.innerHTML = '<i class="fas fa-times-circle"></i> Not Connected';
        statusBadge.classList.remove('badge-success');
        statusBadge.classList.add('badge-warning');
    }
}

// Event listener for bank cards
document.querySelectorAll('.bank-card').forEach(card => {
    card.addEventListener('click', async () => {
        try {
            // Create link token
            const linkToken = await createLinkToken();
            
            // Open Plaid Link
            handler.open({
                token: linkToken,
                onSuccess: async (publicToken, metadata) => {
                    try {
                        await exchangePublicToken(publicToken);
                    } catch (error) {
                        console.error('Error in onSuccess:', error);
                    }
                },
                onExit: (err, metadata) => {
                    if (err) {
                        console.error('Plaid Link exit error:', err);
                        showError('Bank connection cancelled. Please try again.');
                    }
                },
                onEvent: (eventName, metadata) => {
                    console.log('Plaid event:', eventName, metadata);
                },
                onLoad: () => {
                    console.log('Plaid Link loaded');
                }
            });
        } catch (error) {
            console.error('Error opening Plaid Link:', error);
            showError('Failed to open bank connection. Please try again.');
        }
    });
});

// Test connection button
document.getElementById('test-connection').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/plaid/test-connection', {
            method: 'POST'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to test connection');
        }
        
        const data = await response.json();
        showSuccess('Test connection successful!');
        
        // Update UI with test credentials
        const testCredentials = data.test_credentials;
        document.getElementById('test-credentials').innerHTML = `
            <div class="alert alert-info">
                <h5>Test Credentials:</h5>
                <p>Username: ${testCredentials.username}</p>
                <p>Password: ${testCredentials.password}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error testing connection:', error);
        showError('Failed to test connection. Please try again.');
    }
}); 
// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    // Expense Distribution Chart
    const expenseCtx = document.getElementById('expenseChart').getContext('2d');
    new Chart(expenseCtx, {
        type: 'doughnut',
        data: {
            labels: ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Savings', 'Insurance'],
            datasets: [{
                data: [30, 15, 10, 10, 5, 10, 5, 5, 5, 5],
                backgroundColor: [
                    '#2ecc71',
                    '#3498db',
                    '#9b59b6',
                    '#f1c40f',
                    '#e67e22',
                    '#e74c3c',
                    '#1abc9c',
                    '#34495e',
                    '#7f8c8d',
                    '#95a5a6'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });

    // Monthly Trend Chart
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Income',
                data: [30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000, 30000],
                borderColor: '#27ae60',
                tension: 0.1
            }, {
                label: 'Expenses',
                data: [20000, 22000, 18000, 25000, 23000, 20000, 22000, 24000, 21000, 23000, 28000, 20000],
                borderColor: '#e74c3c',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

// Handle navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-links li').forEach(li => {
            li.classList.remove('active');
        });
        this.parentElement.classList.add('active');
    });
});

// Handle search
document.querySelector('.search-bar input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('.recent-transactions tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Plaid integration
const plaidHandler = {
    async initializePlaidLink() {
        try {
            const response = await fetch('/api/plaid/create-link-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const data = await response.json();
            if (data.link_token) {
                const handler = Plaid.create({
                    token: data.link_token,
                    onSuccess: this.handlePlaidSuccess,
                    onExit: this.handlePlaidExit,
                    onLoad: this.handlePlaidLoad,
                    onEvent: this.handlePlaidEvent,
                    language: 'en',
                    countryCodes: ['US']
                });
                
                return handler;
            }
            throw new Error('Failed to create link token');
        } catch (error) {
            console.error('Error initializing Plaid:', error);
            throw error;
        }
    },
    
    async handlePlaidSuccess(public_token, metadata) {
        try {
            const response = await fetch('/api/plaid/exchange-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ public_token })
            });
            
            const data = await response.json();
            if (response.ok) {
                showNotification('Bank account connected successfully!', 'success');
                loadConnectedAccounts();
            } else {
                throw new Error(data.error || 'Failed to connect bank account');
            }
        } catch (error) {
            console.error('Error exchanging token:', error);
            showNotification(error.message, 'error');
        }
    },
    
    handlePlaidExit(err, metadata) {
        if (err) {
            console.error('Plaid Link error:', err);
            showNotification('Failed to connect bank account', 'error');
        }
    },
    
    handlePlaidLoad() {
        console.log('Plaid Link loaded');
    },
    
    handlePlaidEvent(eventName, metadata) {
        console.log('Plaid Link event:', eventName, metadata);
    },
    
    async loadConnectedAccounts() {
        try {
            const response = await fetch('/api/plaid/accounts', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const data = await response.json();
            if (response.ok) {
                displayConnectedAccounts(data.accounts);
            } else {
                throw new Error(data.error || 'Failed to load accounts');
            }
        } catch (error) {
            console.error('Error loading accounts:', error);
            showNotification(error.message, 'error');
        }
    },
    
    async loadTransactions(accountId, startDate, endDate) {
        try {
            const response = await fetch(`/api/plaid/transactions?start_date=${startDate}&end_date=${endDate}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const data = await response.json();
            if (response.ok) {
                displayTransactions(data.transactions);
            } else {
                throw new Error(data.error || 'Failed to load transactions');
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
            showNotification(error.message, 'error');
        }
    }
};

// UI Helper functions
function displayConnectedAccounts(accounts) {
    const container = document.getElementById('connected-accounts');
    if (!container) return;
    
    container.innerHTML = accounts.map(account => `
        <div class="account-card">
            <h3>${account.name}</h3>
            <p>Type: ${account.type}</p>
            <p>Balance: $${account.balance.current}</p>
            <button onclick="viewTransactions('${account.account_id}')">View Transactions</button>
        </div>
    `).join('');
}

function displayTransactions(transactions) {
    const container = document.getElementById('transactions-list');
    if (!container) return;
    
    container.innerHTML = transactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</div>
            <div class="transaction-description">${transaction.name}</div>
            <div class="transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}">
                $${Math.abs(transaction.amount).toFixed(2)}
            </div>
        </div>
    `).join('');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Plaid Link button
    const connectBankButton = document.getElementById('connect-bank');
    if (connectBankButton) {
        connectBankButton.addEventListener('click', async () => {
            try {
                const handler = await plaidHandler.initializePlaidLink();
                handler.open();
            } catch (error) {
                showNotification('Failed to initialize bank connection', 'error');
            }
        });
    }
    
    // Load connected accounts if on bank integration page
    if (document.getElementById('connected-accounts')) {
        plaidHandler.loadConnectedAccounts();
    }
}); 
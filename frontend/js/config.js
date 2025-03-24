// API Configuration
const config = {
    // API Base URL - Change this according to your environment
    apiBaseUrl: 'http://localhost:5000/api',

    // Authentication endpoints
    auth: {
        login: '/auth/login',
        signup: '/auth/signup',
        logout: '/auth/logout',
        refresh: '/auth/refresh'
    },

    // User endpoints
    user: {
        profile: '/users/profile',
        settings: '/users/settings'
    },

    // Plaid integration endpoints
    plaid: {
        createLinkToken: '/plaid/create-link-token',
        exchangeToken: '/plaid/exchange-token',
        accounts: '/plaid/accounts',
        transactions: '/plaid/transactions',
        test: '/plaid/test-connection'
    },

    // Transaction endpoints
    transactions: {
        base: '/transactions',
        categories: '/transactions/categories',
        summary: '/transactions/summary'
    },

    // Budget endpoints
    budget: {
        base: '/budgets',
        recommendations: '/budgets/recommendations',
        alerts: '/budgets/alerts'
    },

    // Goals endpoints
    goals: {
        base: '/goals',
        progress: '/goals/progress',
        recommendations: '/goals/recommendations'
    },

    // Request headers
    headers: {
        'Content-Type': 'application/json'
    },

    // Add authorization header to requests
    addAuthHeader: (headers = {}) => {
        const token = localStorage.getItem('token');
        if (token) {
            return {
                ...headers,
                'Authorization': `Bearer ${token}`
            };
        }
        return headers;
    },

    // Helper function to build full API URL
    buildUrl: (endpoint) => {
        return `${config.apiBaseUrl}${endpoint}`;
    },

    // Helper function to handle API errors
    handleApiError: (error) => {
        if (error.response) {
            // Server responded with error
            if (error.response.status === 401) {
                // Unauthorized - redirect to login
                window.location.href = '/pages/login.html';
            }
            return error.response.data.message || 'An error occurred';
        } else if (error.request) {
            // Request made but no response
            return 'No response from server';
        } else {
            // Other errors
            return error.message || 'An error occurred';
        }
    }
};

// Export configuration
export default config; 
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
require('dotenv').config();

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')));

// Bank API configuration
const BANK_API_URL = process.env.BANK_API_URL || 'https://api.yourbank.com';
const BANK_API_KEY = process.env.BANK_API_KEY;

// Middleware to verify bank API key
const verifyBankApiKey = (req, res, next) => {
    if (!BANK_API_KEY) {
        return res.status(500).json({ error: 'Bank API key not configured' });
    }
    next();
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'dashboard.html'));
});

// API Routes
app.get('/api/user/bank-data', verifyBankApiKey, async (req, res) => {
    try {
        // Replace this with your actual bank API endpoint
        const response = await axios.get(`${BANK_API_URL}/v1/accounts/transactions`, {
            headers: {
                'Authorization': `Bearer ${BANK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Process the bank API response
        const transactions = response.data.transactions;
        
        // Calculate monthly income and expenses
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        const monthlyData = {
            monthlyIncome: 0,
            expenses: {
                housing: 0,
                transportation: 0,
                food: 0,
                utilities: 0,
                entertainment: 0,
                shopping: 0,
                healthcare: 0,
                savings: 0,
                other: 0
            },
            goals: [
                { id: 1, name: 'Emergency Fund', current: 3000, target: 15000 },
                { id: 2, name: 'Vacation', current: 1200, target: 3000 },
                { id: 3, name: 'New Car', current: 5000, target: 20000 }
            ]
        };

        // Process transactions
        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            if (transactionDate >= firstDayOfMonth) {
                if (transaction.type === 'income') {
                    monthlyData.monthlyIncome += transaction.amount;
                } else {
                    // Categorize expenses based on transaction description or category
                    const category = categorizeTransaction(transaction.description);
                    if (monthlyData.expenses[category]) {
                        monthlyData.expenses[category] += transaction.amount;
                    } else {
                        monthlyData.expenses.other += transaction.amount;
                    }
                }
            }
        });

        res.json(monthlyData);
    } catch (error) {
        console.error('Error fetching bank data:', error);
        res.status(500).json({ error: 'Failed to fetch bank data' });
    }
});

// Helper function to categorize transactions
function categorizeTransaction(description) {
    const description_lower = description.toLowerCase();
    
    // Housing related keywords
    if (description_lower.includes('rent') || description_lower.includes('mortgage') || 
        description_lower.includes('property') || description_lower.includes('housing')) {
        return 'housing';
    }
    
    // Transportation related keywords
    if (description_lower.includes('gas') || description_lower.includes('fuel') || 
        description_lower.includes('transit') || description_lower.includes('uber') || 
        description_lower.includes('lyft') || description_lower.includes('taxi')) {
        return 'transportation';
    }
    
    // Food related keywords
    if (description_lower.includes('food') || description_lower.includes('restaurant') || 
        description_lower.includes('grocery') || description_lower.includes('supermarket')) {
        return 'food';
    }
    
    // Utilities related keywords
    if (description_lower.includes('electric') || description_lower.includes('water') || 
        description_lower.includes('gas') || description_lower.includes('utility')) {
        return 'utilities';
    }
    
    // Entertainment related keywords
    if (description_lower.includes('entertainment') || description_lower.includes('movie') || 
        description_lower.includes('netflix') || description_lower.includes('spotify')) {
        return 'entertainment';
    }
    
    // Shopping related keywords
    if (description_lower.includes('shopping') || description_lower.includes('store') || 
        description_lower.includes('amazon') || description_lower.includes('walmart')) {
        return 'shopping';
    }
    
    // Healthcare related keywords
    if (description_lower.includes('medical') || description_lower.includes('health') || 
        description_lower.includes('pharmacy') || description_lower.includes('doctor')) {
        return 'healthcare';
    }
    
    // Savings related keywords
    if (description_lower.includes('savings') || description_lower.includes('investment') || 
        description_lower.includes('deposit')) {
        return 'savings';
    }
    
    return 'other';
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 
// Mock fetch function
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock Chart.js
global.Chart = jest.fn();

describe('Authentication Functions', () => {
    beforeEach(() => {
        localStorage.clear();
        fetch.mockClear();
    });

    test('checkAuth should redirect to login if no token', () => {
        localStorage.getItem.mockReturnValue(null);
        const mockWindow = { location: { href: '' } };
        global.window = mockWindow;
        
        checkAuth();
        expect(mockWindow.location.href).toBe('/login.html');
    });

    test('checkAuth should not redirect if token exists', () => {
        localStorage.getItem.mockReturnValue('test-token');
        const mockWindow = { location: { href: '' } };
        global.window = mockWindow;
        
        checkAuth();
        expect(mockWindow.location.href).toBe('');
    });

    test('logout should clear localStorage and redirect', () => {
        const mockWindow = { location: { href: '' } };
        global.window = mockWindow;
        
        logout();
        expect(localStorage.clear).toHaveBeenCalled();
        expect(mockWindow.location.href).toBe('/login.html');
    });
});

describe('Dashboard Functions', () => {
    beforeEach(() => {
        fetch.mockClear();
        Chart.mockClear();
    });

    test('loadDashboardData should fetch and display data', async () => {
        const mockData = {
            monthly_income: 5000,
            monthly_expenses: 3000,
            monthly_savings: 2000,
            savings_rate: 40,
            recent_transactions: [
                {
                    id: 1,
                    amount: 100,
                    description: 'Test Transaction',
                    date: '2024-01-01'
                }
            ],
            goals: [
                {
                    id: 1,
                    name: 'Test Goal',
                    progress: 50
                }
            ]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        await loadDashboardData();

        expect(fetch).toHaveBeenCalledWith('/api/dashboard/overview', {
            headers: expect.any(Object)
        });
        expect(Chart).toHaveBeenCalled();
    });

    test('displayTransactions should update DOM', () => {
        const mockTransactions = [
            {
                id: 1,
                amount: 100,
                description: 'Test Transaction',
                date: '2024-01-01',
                category: 'Food'
            }
        ];

        document.body.innerHTML = '<div id="transactions-list"></div>';
        displayTransactions(mockTransactions);

        const transactionsList = document.getElementById('transactions-list');
        expect(transactionsList.innerHTML).toContain('Test Transaction');
        expect(transactionsList.innerHTML).toContain('$100.00');
    });

    test('displayGoals should update DOM', () => {
        const mockGoals = [
            {
                id: 1,
                name: 'Test Goal',
                target_amount: 1000,
                current_amount: 500,
                progress: 50,
                deadline: '2024-12-31'
            }
        ];

        document.body.innerHTML = '<div id="goals-list"></div>';
        displayGoals(mockGoals);

        const goalsList = document.getElementById('goals-list');
        expect(goalsList.innerHTML).toContain('Test Goal');
        expect(goalsList.innerHTML).toContain('50%');
    });
});

describe('Budget Functions', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('loadBudgets should fetch and display budgets', async () => {
        const mockBudgets = [
            {
                id: 1,
                category: 'Food',
                amount: 500,
                spent: 200,
                remaining: 300
            }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockBudgets)
        });

        document.body.innerHTML = '<div id="budgets-list"></div>';
        await loadBudgets();

        const budgetsList = document.getElementById('budgets-list');
        expect(budgetsList.innerHTML).toContain('Food');
        expect(budgetsList.innerHTML).toContain('$500.00');
        expect(budgetsList.innerHTML).toContain('$200.00');
        expect(budgetsList.innerHTML).toContain('$300.00');
    });

    test('createBudget should send POST request', async () => {
        const mockBudget = {
            category: 'Food',
            amount: 500,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockBudget)
        });

        await createBudget(mockBudget);

        expect(fetch).toHaveBeenCalledWith('/api/budget', {
            method: 'POST',
            headers: expect.any(Object),
            body: JSON.stringify(mockBudget)
        });
    });
});

describe('Goals Functions', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('loadGoals should fetch and display goals', async () => {
        const mockGoals = [
            {
                id: 1,
                name: 'Test Goal',
                target_amount: 1000,
                current_amount: 500,
                progress: 50,
                deadline: '2024-12-31'
            }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockGoals)
        });

        document.body.innerHTML = '<div id="goals-list"></div>';
        await loadGoals();

        const goalsList = document.getElementById('goals-list');
        expect(goalsList.innerHTML).toContain('Test Goal');
        expect(goalsList.innerHTML).toContain('$1,000.00');
        expect(goalsList.innerHTML).toContain('50%');
    });

    test('createGoal should send POST request', async () => {
        const mockGoal = {
            name: 'Test Goal',
            target_amount: 1000,
            current_amount: 0,
            deadline: '2024-12-31',
            category: 'Savings'
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockGoal)
        });

        await createGoal(mockGoal);

        expect(fetch).toHaveBeenCalledWith('/api/goals', {
            method: 'POST',
            headers: expect.any(Object),
            body: JSON.stringify(mockGoal)
        });
    });
});

describe('Utility Functions', () => {
    test('formatCurrency should format numbers correctly', () => {
        expect(formatCurrency(1234.56)).toBe('$1,234.56');
        expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
        expect(formatCurrency(0)).toBe('$0.00');
    });

    test('calculateProgress should calculate percentage correctly', () => {
        expect(calculateProgress(500, 1000)).toBe(50);
        expect(calculateProgress(0, 1000)).toBe(0);
        expect(calculateProgress(1000, 1000)).toBe(100);
    });

    test('formatDate should format dates correctly', () => {
        const date = new Date('2024-01-01');
        expect(formatDate(date)).toBe('Jan 1, 2024');
    });
}); 
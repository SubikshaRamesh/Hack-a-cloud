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

describe('UI Components', () => {
    beforeEach(() => {
        fetch.mockClear();
        localStorage.clear();
        Chart.mockClear();
        document.body.innerHTML = '';
    });

    describe('Navigation', () => {
        test('should highlight active nav item', () => {
            document.body.innerHTML = `
                <nav>
                    <a href="/dashboard.html" class="nav-item">Dashboard</a>
                    <a href="/transactions.html" class="nav-item">Transactions</a>
                    <a href="/goals.html" class="nav-item">Goals</a>
                    <a href="/budget.html" class="nav-item">Budget</a>
                    <a href="/profile.html" class="nav-item">Profile</a>
                </nav>
            `;

            highlightActiveNavItem();
            const activeItem = document.querySelector('.nav-item.active');
            expect(activeItem).toBeTruthy();
        });

        test('should handle mobile menu toggle', () => {
            document.body.innerHTML = `
                <button id="mobile-menu-toggle"></button>
                <nav id="mobile-menu"></nav>
            `;

            const toggleButton = document.getElementById('mobile-menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');

            toggleButton.click();
            expect(mobileMenu.classList.contains('active')).toBe(true);

            toggleButton.click();
            expect(mobileMenu.classList.contains('active')).toBe(false);
        });
    });

    describe('Dashboard Cards', () => {
        test('should update overview cards', () => {
            document.body.innerHTML = `
                <div class="overview-card" id="balance-card">
                    <div class="card-value"></div>
                </div>
                <div class="overview-card" id="income-card">
                    <div class="card-value"></div>
                </div>
                <div class="overview-card" id="expenses-card">
                    <div class="card-value"></div>
                </div>
                <div class="overview-card" id="savings-card">
                    <div class="card-value"></div>
                </div>
            `;

            const data = {
                total_balance: 5000,
                monthly_income: 3000,
                monthly_expenses: 2000,
                savings_rate: 33.33
            };

            updateOverviewCards(data);

            expect(document.querySelector('#balance-card .card-value').textContent).toBe('$5,000.00');
            expect(document.querySelector('#income-card .card-value').textContent).toBe('$3,000.00');
            expect(document.querySelector('#expenses-card .card-value').textContent).toBe('$2,000.00');
            expect(document.querySelector('#savings-card .card-value').textContent).toBe('33.33%');
        });

        test('should handle card hover effects', () => {
            document.body.innerHTML = `
                <div class="overview-card">
                    <div class="card-content"></div>
                </div>
            `;

            const card = document.querySelector('.overview-card');
            const content = card.querySelector('.card-content');

            card.dispatchEvent(new MouseEvent('mouseenter'));
            expect(content.classList.contains('hover')).toBe(true);

            card.dispatchEvent(new MouseEvent('mouseleave'));
            expect(content.classList.contains('hover')).toBe(false);
        });
    });

    describe('Charts', () => {
        test('should create expense chart', () => {
            document.body.innerHTML = '<canvas id="expense-chart"></canvas>';
            const data = {
                labels: ['Food', 'Transportation', 'Entertainment'],
                values: [500, 300, 200]
            };

            createExpenseChart(data);
            expect(Chart).toHaveBeenCalledWith(
                expect.any(HTMLCanvasElement),
                expect.objectContaining({
                    type: 'doughnut',
                    data: expect.objectContaining({
                        labels: data.labels,
                        datasets: expect.any(Array)
                    })
                })
            );
        });

        test('should create income vs expenses chart', () => {
            document.body.innerHTML = '<canvas id="income-expense-chart"></canvas>';
            const data = {
                labels: ['Jan', 'Feb', 'Mar'],
                income: [3000, 3500, 3200],
                expenses: [2000, 2500, 2200]
            };

            createIncomeExpenseChart(data);
            expect(Chart).toHaveBeenCalledWith(
                expect.any(HTMLCanvasElement),
                expect.objectContaining({
                    type: 'bar',
                    data: expect.objectContaining({
                        labels: data.labels,
                        datasets: expect.arrayContaining([
                            expect.objectContaining({
                                label: 'Income',
                                data: data.income
                            }),
                            expect.objectContaining({
                                label: 'Expenses',
                                data: data.expenses
                            })
                        ])
                    })
                })
            );
        });
    });

    describe('Transaction List', () => {
        test('should display transactions', () => {
            document.body.innerHTML = '<div id="transactions-list"></div>';
            const transactions = [
                {
                    id: 1,
                    amount: 100,
                    description: 'Test Transaction',
                    date: '2024-01-01',
                    category: 'Food'
                }
            ];

            displayTransactions(transactions);
            const list = document.getElementById('transactions-list');
            expect(list.innerHTML).toContain('Test Transaction');
            expect(list.innerHTML).toContain('$100.00');
            expect(list.innerHTML).toContain('Food');
        });

        test('should handle transaction filtering', () => {
            document.body.innerHTML = `
                <input type="text" id="search-input" placeholder="Search transactions...">
                <select id="category-filter">
                    <option value="">All Categories</option>
                    <option value="Food">Food</option>
                    <option value="Transportation">Transportation</option>
                </select>
                <div id="transactions-list"></div>
            `;

            const transactions = [
                {
                    id: 1,
                    amount: 100,
                    description: 'Grocery Shopping',
                    date: '2024-01-01',
                    category: 'Food'
                },
                {
                    id: 2,
                    amount: 50,
                    description: 'Bus Ticket',
                    date: '2024-01-02',
                    category: 'Transportation'
                }
            ];

            const searchInput = document.getElementById('search-input');
            const categoryFilter = document.getElementById('category-filter');

            // Test search filtering
            searchInput.value = 'Grocery';
            filterTransactions(transactions);
            expect(document.getElementById('transactions-list').children.length).toBe(1);

            // Test category filtering
            categoryFilter.value = 'Transportation';
            filterTransactions(transactions);
            expect(document.getElementById('transactions-list').children.length).toBe(1);
        });
    });

    describe('Goal Cards', () => {
        test('should display goals', () => {
            document.body.innerHTML = '<div id="goals-list"></div>';
            const goals = [
                {
                    id: 1,
                    name: 'Vacation Fund',
                    target_amount: 5000,
                    current_amount: 2000,
                    progress: 40,
                    deadline: '2024-12-31'
                }
            ];

            displayGoals(goals);
            const list = document.getElementById('goals-list');
            expect(list.innerHTML).toContain('Vacation Fund');
            expect(list.innerHTML).toContain('$5,000.00');
            expect(list.innerHTML).toContain('40%');
        });

        test('should handle goal progress updates', () => {
            document.body.innerHTML = `
                <div id="goals-list"></div>
                <div id="goal-progress-modal" class="modal">
                    <div class="modal-content">
                        <input type="number" id="progress-input">
                        <button id="update-progress">Update Progress</button>
                    </div>
                </div>
            `;

            const goal = {
                id: 1,
                name: 'Test Goal',
                target_amount: 1000,
                current_amount: 500,
                progress: 50
            };

            showProgressModal(goal);
            const modal = document.getElementById('goal-progress-modal');
            expect(modal.style.display).toBe('block');

            const progressInput = document.getElementById('progress-input');
            progressInput.value = '750';
            document.getElementById('update-progress').click();

            expect(goal.current_amount).toBe(750);
            expect(goal.progress).toBe(75);
        });
    });

    describe('Budget Cards', () => {
        test('should display budgets', () => {
            document.body.innerHTML = '<div id="budgets-list"></div>';
            const budgets = [
                {
                    id: 1,
                    category: 'Food',
                    amount: 500,
                    spent: 200,
                    remaining: 300
                }
            ];

            displayBudgets(budgets);
            const list = document.getElementById('budgets-list');
            expect(list.innerHTML).toContain('Food');
            expect(list.innerHTML).toContain('$500.00');
            expect(list.innerHTML).toContain('$200.00');
            expect(list.innerHTML).toContain('$300.00');
        });

        test('should handle budget creation', () => {
            document.body.innerHTML = `
                <div id="budget-modal" class="modal">
                    <div class="modal-content">
                        <form id="budget-form">
                            <input type="text" name="category" required>
                            <input type="number" name="amount" required>
                            <button type="submit">Create Budget</button>
                        </form>
                    </div>
                </div>
            `;

            const form = document.getElementById('budget-form');
            const categoryInput = form.querySelector('[name="category"]');
            const amountInput = form.querySelector('[name="amount"]');

            categoryInput.value = 'Entertainment';
            amountInput.value = '300';
            form.dispatchEvent(new Event('submit'));

            expect(fetch).toHaveBeenCalledWith('/api/budget', {
                method: 'POST',
                headers: expect.any(Object),
                body: expect.stringContaining('"category":"Entertainment"')
            });
        });
    });

    describe('Modals', () => {
        test('should handle modal open/close', () => {
            document.body.innerHTML = `
                <button id="open-modal">Open Modal</button>
                <div id="test-modal" class="modal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h2>Test Modal</h2>
                    </div>
                </div>
            `;

            const modal = document.getElementById('test-modal');
            const openButton = document.getElementById('open-modal');
            const closeButton = modal.querySelector('.close');

            openButton.click();
            expect(modal.style.display).toBe('block');

            closeButton.click();
            expect(modal.style.display).toBe('none');

            window.click();
            expect(modal.style.display).toBe('none');
        });
    });
}); 
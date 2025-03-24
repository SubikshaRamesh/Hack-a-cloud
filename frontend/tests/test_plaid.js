// Mock fetch function
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock Plaid Link
global.Plaid = {
    create: jest.fn(),
    open: jest.fn(),
    exit: jest.fn(),
    destroy: jest.fn()
};

describe('Plaid Integration', () => {
    beforeEach(() => {
        fetch.mockClear();
        localStorage.clear();
        Plaid.create.mockClear();
        Plaid.open.mockClear();
        Plaid.exit.mockClear();
        Plaid.destroy.mockClear();
    });

    test('initializePlaid should create Plaid Link', async () => {
        const mockConfig = {
            token: 'test-link-token',
            language: 'en',
            countryCodes: ['US'],
            onSuccess: jest.fn(),
            onExit: jest.fn(),
            onLoad: jest.fn(),
            onEvent: jest.fn()
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ link_token: 'test-link-token' })
        });

        await initializePlaid();

        expect(fetch).toHaveBeenCalledWith('/api/plaid/create-link-token', {
            headers: expect.any(Object)
        });
        expect(Plaid.create).toHaveBeenCalledWith(expect.objectContaining({
            token: 'test-link-token',
            language: 'en',
            countryCodes: ['US']
        }));
    });

    test('handlePlaidSuccess should exchange public token', async () => {
        const mockPublicToken = 'test-public-token';
        const mockResponse = {
            access_token: 'test-access-token',
            item_id: 'test-item-id'
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        await handlePlaidSuccess(mockPublicToken);

        expect(fetch).toHaveBeenCalledWith('/api/plaid/exchange-token', {
            method: 'POST',
            headers: expect.any(Object),
            body: JSON.stringify({ public_token: mockPublicToken })
        });
    });

    test('handlePlaidExit should handle exit gracefully', () => {
        const mockError = {
            display_message: 'User exited',
            error_code: 'USER_EXIT',
            error_type: 'INVALID_REQUEST'
        };

        handlePlaidExit(mockError);
        expect(Plaid.destroy).toHaveBeenCalled();
    });

    test('handlePlaidLoad should handle load event', () => {
        const mockEvent = {
            view_name: 'CONNECTED',
            metadata: {
                institution: {
                    name: 'Test Bank'
                }
            }
        };

        handlePlaidLoad(mockEvent);
        // Add assertions based on your load handling logic
    });

    test('handlePlaidEvent should handle various events', () => {
        const mockEvents = [
            {
                view_name: 'CONNECTED',
                event_name: 'TRANSITION_VIEW',
                metadata: {
                    institution: {
                        name: 'Test Bank'
                    }
                }
            },
            {
                view_name: 'CONNECTED',
                event_name: 'SUBMIT_CREDENTIALS',
                metadata: {
                    institution: {
                        name: 'Test Bank'
                    }
                }
            },
            {
                view_name: 'CONNECTED',
                event_name: 'ERROR',
                error: {
                    display_message: 'Invalid credentials',
                    error_code: 'INVALID_CREDENTIALS',
                    error_type: 'INVALID_REQUEST'
                }
            }
        ];

        mockEvents.forEach(event => {
            handlePlaidEvent(event);
            // Add assertions based on your event handling logic
        });
    });

    test('loadBankAccounts should fetch and display accounts', async () => {
        const mockAccounts = [
            {
                account_id: 'test-account-id',
                name: 'Checking',
                type: 'depository',
                subtype: 'checking',
                mask: '1234',
                balances: {
                    available: 1000,
                    current: 1000,
                    limit: null
                }
            }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockAccounts)
        });

        document.body.innerHTML = '<div id="accounts-list"></div>';
        await loadBankAccounts();

        const accountsList = document.getElementById('accounts-list');
        expect(accountsList.innerHTML).toContain('Checking');
        expect(accountsList.innerHTML).toContain('$1,000.00');
    });

    test('loadTransactions should fetch and display transactions', async () => {
        const mockTransactions = [
            {
                transaction_id: 'test-transaction-id',
                account_id: 'test-account-id',
                amount: 100,
                date: '2024-01-01',
                name: 'Test Transaction',
                payment_channel: 'online',
                pending: false
            }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockTransactions)
        });

        document.body.innerHTML = '<div id="transactions-list"></div>';
        await loadTransactions();

        const transactionsList = document.getElementById('transactions-list');
        expect(transactionsList.innerHTML).toContain('Test Transaction');
        expect(transactionsList.innerHTML).toContain('$100.00');
    });

    test('handlePlaidError should display error message', () => {
        const mockError = {
            display_message: 'Invalid credentials',
            error_code: 'INVALID_CREDENTIALS',
            error_type: 'INVALID_REQUEST'
        };

        document.body.innerHTML = '<div id="error-message"></div>';
        handlePlaidError(mockError);

        const errorMessage = document.getElementById('error-message');
        expect(errorMessage.innerHTML).toContain('Invalid credentials');
    });

    test('disconnectBankAccount should remove account', async () => {
        const mockAccountId = 'test-account-id';

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ message: 'Account disconnected' })
        });

        await disconnectBankAccount(mockAccountId);

        expect(fetch).toHaveBeenCalledWith(`/api/plaid/accounts/${mockAccountId}`, {
            method: 'DELETE',
            headers: expect.any(Object)
        });
    });
}); 
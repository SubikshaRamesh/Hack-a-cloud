// Mock fetch
global.fetch = jest.fn();

describe('Error Handling', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    describe('API Error Handling', () => {
        test('should handle network errors', async () => {
            // Mock network error
            fetch.mockRejectedValueOnce(new Error('Network error'));

            document.body.innerHTML = `
                <div id="error-container"></div>
            `;

            try {
                await fetch('/api/data');
            } catch (error) {
                handleError(error);
            }

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Network error');
            expect(errorContainer.classList).toContain('error-message');
        });

        test('should handle API errors', async () => {
            // Mock API error response
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: () => Promise.resolve({ message: 'Invalid request' })
            });

            document.body.innerHTML = `
                <div id="error-container"></div>
            `;

            try {
                const response = await fetch('/api/data');
                if (!response.ok) {
                    throw new Error('API Error');
                }
            } catch (error) {
                handleError(error);
            }

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Invalid request');
            expect(errorContainer.classList).toContain('error-message');
        });

        test('should handle authentication errors', async () => {
            // Mock authentication error
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: () => Promise.resolve({ message: 'Unauthorized' })
            });

            document.body.innerHTML = `
                <div id="error-container"></div>
            `;

            try {
                const response = await fetch('/api/data');
                if (!response.ok) {
                    throw new Error('Authentication Error');
                }
            } catch (error) {
                handleError(error);
            }

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Unauthorized');
            expect(errorContainer.classList).toContain('error-message');
            expect(window.location.href).toContain('/login');
        });
    });

    describe('Form Validation', () => {
        test('should handle required field errors', () => {
            document.body.innerHTML = `
                <form id="test-form">
                    <input type="text" name="username" required>
                    <button type="submit">Submit</button>
                </form>
                <div id="error-container"></div>
            `;

            const form = document.getElementById('test-form');
            const submitButton = form.querySelector('button[type="submit"]');

            submitButton.click();

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Username is required');
            expect(errorContainer.classList).toContain('error-message');
        });

        test('should handle invalid input errors', () => {
            document.body.innerHTML = `
                <form id="test-form">
                    <input type="email" name="email" required>
                    <button type="submit">Submit</button>
                </form>
                <div id="error-container"></div>
            `;

            const form = document.getElementById('test-form');
            const emailInput = form.querySelector('input[type="email"]');
            const submitButton = form.querySelector('button[type="submit"]');

            emailInput.value = 'invalid-email';
            submitButton.click();

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Invalid email format');
            expect(errorContainer.classList).toContain('error-message');
        });

        test('should handle password validation errors', () => {
            document.body.innerHTML = `
                <form id="test-form">
                    <input type="password" name="password" required>
                    <button type="submit">Submit</button>
                </form>
                <div id="error-container"></div>
            `;

            const form = document.getElementById('test-form');
            const passwordInput = form.querySelector('input[type="password"]');
            const submitButton = form.querySelector('button[type="submit"]');

            passwordInput.value = 'weak';
            submitButton.click();

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Password must be at least 8 characters');
            expect(errorContainer.classList).toContain('error-message');
        });
    });

    describe('Data Validation', () => {
        test('should handle invalid date format', () => {
            document.body.innerHTML = `
                <div id="error-container"></div>
            `;

            try {
                validateDate('invalid-date');
            } catch (error) {
                handleError(error);
            }

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Invalid date format');
            expect(errorContainer.classList).toContain('error-message');
        });

        test('should handle invalid currency format', () => {
            document.body.innerHTML = `
                <div id="error-container"></div>
            `;

            try {
                validateCurrency('invalid-currency');
            } catch (error) {
                handleError(error);
            }

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Invalid currency format');
            expect(errorContainer.classList).toContain('error-message');
        });

        test('should handle invalid percentage format', () => {
            document.body.innerHTML = `
                <div id="error-container"></div>
            `;

            try {
                validatePercentage('invalid-percentage');
            } catch (error) {
                handleError(error);
            }

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Invalid percentage format');
            expect(errorContainer.classList).toContain('error-message');
        });
    });

    describe('UI Error Handling', () => {
        test('should handle chart rendering errors', () => {
            document.body.innerHTML = `
                <canvas id="chart"></canvas>
                <div id="error-container"></div>
            `;

            try {
                renderChart('invalid-data');
            } catch (error) {
                handleError(error);
            }

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Failed to render chart');
            expect(errorContainer.classList).toContain('error-message');
        });

        test('should handle modal errors', () => {
            document.body.innerHTML = `
                <div id="modal"></div>
                <div id="error-container"></div>
            `;

            try {
                showModal('invalid-content');
            } catch (error) {
                handleError(error);
            }

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Failed to show modal');
            expect(errorContainer.classList).toContain('error-message');
        });

        test('should handle file upload errors', () => {
            document.body.innerHTML = `
                <input type="file" id="file-input">
                <div id="error-container"></div>
            `;

            const fileInput = document.getElementById('file-input');
            const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });

            try {
                handleFileUpload(invalidFile);
            } catch (error) {
                handleError(error);
            }

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Invalid file type');
            expect(errorContainer.classList).toContain('error-message');
        });
    });

    describe('Error Recovery', () => {
        test('should allow retrying failed API calls', async () => {
            // Mock failed API call followed by success
            fetch
                .mockRejectedValueOnce(new Error('Network error'))
                .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: 'success' }) });

            document.body.innerHTML = `
                <div id="error-container"></div>
                <button id="retry-button">Retry</button>
            `;

            try {
                await fetch('/api/data');
            } catch (error) {
                handleError(error);
            }

            const retryButton = document.getElementById('retry-button');
            retryButton.click();

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toBe('');
            expect(errorContainer.classList).not.toContain('error-message');
        });

        test('should clear form errors on input', () => {
            document.body.innerHTML = `
                <form id="test-form">
                    <input type="text" name="username" required>
                    <button type="submit">Submit</button>
                </form>
                <div id="error-container"></div>
            `;

            const form = document.getElementById('test-form');
            const input = form.querySelector('input');
            const submitButton = form.querySelector('button[type="submit"]');

            submitButton.click();

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('Username is required');

            input.value = 'test';
            input.dispatchEvent(new Event('input'));

            expect(errorContainer.innerHTML).toBe('');
            expect(errorContainer.classList).not.toContain('error-message');
        });

        test('should handle offline mode gracefully', () => {
            // Mock offline status
            Object.defineProperty(navigator, 'onLine', {
                get: () => false
            });

            document.body.innerHTML = `
                <div id="error-container"></div>
            `;

            handleOfflineStatus();

            const errorContainer = document.getElementById('error-container');
            expect(errorContainer.innerHTML).toContain('You are offline');
            expect(errorContainer.classList).toContain('error-message');
        });
    });
}); 
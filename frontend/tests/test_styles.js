// Mock window.matchMedia
global.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
}));

describe('Styling', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    describe('Responsive Design', () => {
        test('should apply mobile styles', () => {
            // Mock mobile viewport
            global.innerWidth = 375;
            global.innerHeight = 667;
            global.dispatchEvent(new Event('resize'));

            document.body.innerHTML = `
                <nav class="navbar">
                    <div class="nav-brand">FinTrack</div>
                    <div class="nav-menu"></div>
                </nav>
                <div class="container">
                    <div class="card"></div>
                </div>
            `;

            // Check mobile-specific styles
            const navbar = document.querySelector('.navbar');
            const container = document.querySelector('.container');
            const card = document.querySelector('.card');

            expect(window.getComputedStyle(navbar).padding).toBe('1rem');
            expect(window.getComputedStyle(container).padding).toBe('1rem');
            expect(window.getComputedStyle(card).marginBottom).toBe('1rem');
        });

        test('should apply tablet styles', () => {
            // Mock tablet viewport
            global.innerWidth = 768;
            global.innerHeight = 1024;
            global.dispatchEvent(new Event('resize'));

            document.body.innerHTML = `
                <nav class="navbar">
                    <div class="nav-brand">FinTrack</div>
                    <div class="nav-menu"></div>
                </nav>
                <div class="container">
                    <div class="card"></div>
                </div>
            `;

            // Check tablet-specific styles
            const navbar = document.querySelector('.navbar');
            const container = document.querySelector('.container');
            const card = document.querySelector('.card');

            expect(window.getComputedStyle(navbar).padding).toBe('1.5rem');
            expect(window.getComputedStyle(container).padding).toBe('2rem');
            expect(window.getComputedStyle(card).marginBottom).toBe('1.5rem');
        });

        test('should apply desktop styles', () => {
            // Mock desktop viewport
            global.innerWidth = 1024;
            global.innerHeight = 768;
            global.dispatchEvent(new Event('resize'));

            document.body.innerHTML = `
                <nav class="navbar">
                    <div class="nav-brand">FinTrack</div>
                    <div class="nav-menu"></div>
                </nav>
                <div class="container">
                    <div class="card"></div>
                </div>
            `;

            // Check desktop-specific styles
            const navbar = document.querySelector('.navbar');
            const container = document.querySelector('.container');
            const card = document.querySelector('.card');

            expect(window.getComputedStyle(navbar).padding).toBe('2rem');
            expect(window.getComputedStyle(container).padding).toBe('3rem');
            expect(window.getComputedStyle(card).marginBottom).toBe('2rem');
        });
    });

    describe('Theme Support', () => {
        test('should apply light theme', () => {
            document.body.innerHTML = `
                <div class="app light-theme">
                    <div class="card"></div>
                    <div class="text"></div>
                </div>
            `;

            const card = document.querySelector('.card');
            const text = document.querySelector('.text');

            expect(window.getComputedStyle(card).backgroundColor).toBe('rgb(255, 255, 255)');
            expect(window.getComputedStyle(card).boxShadow).toBe('0 2px 4px rgba(0, 0, 0, 0.1)');
            expect(window.getComputedStyle(text).color).toBe('rgb(33, 37, 41)');
        });

        test('should apply dark theme', () => {
            document.body.innerHTML = `
                <div class="app dark-theme">
                    <div class="card"></div>
                    <div class="text"></div>
                </div>
            `;

            const card = document.querySelector('.card');
            const text = document.querySelector('.text');

            expect(window.getComputedStyle(card).backgroundColor).toBe('rgb(33, 37, 41)');
            expect(window.getComputedStyle(card).boxShadow).toBe('0 2px 4px rgba(0, 0, 0, 0.3)');
            expect(window.getComputedStyle(text).color).toBe('rgb(248, 249, 250)');
        });
    });

    describe('Component Styles', () => {
        test('should style cards correctly', () => {
            document.body.innerHTML = `
                <div class="card">
                    <div class="card-header"></div>
                    <div class="card-body"></div>
                    <div class="card-footer"></div>
                </div>
            `;

            const card = document.querySelector('.card');
            const header = card.querySelector('.card-header');
            const body = card.querySelector('.card-body');
            const footer = card.querySelector('.card-footer');

            expect(window.getComputedStyle(card).borderRadius).toBe('8px');
            expect(window.getComputedStyle(card).overflow).toBe('hidden');
            expect(window.getComputedStyle(header).padding).toBe('1rem');
            expect(window.getComputedStyle(body).padding).toBe('1rem');
            expect(window.getComputedStyle(footer).padding).toBe('1rem');
        });

        test('should style buttons correctly', () => {
            document.body.innerHTML = `
                <button class="btn btn-primary">Primary</button>
                <button class="btn btn-secondary">Secondary</button>
                <button class="btn btn-danger">Danger</button>
            `;

            const primaryBtn = document.querySelector('.btn-primary');
            const secondaryBtn = document.querySelector('.btn-secondary');
            const dangerBtn = document.querySelector('.btn-danger');

            expect(window.getComputedStyle(primaryBtn).backgroundColor).toBe('rgb(0, 123, 255)');
            expect(window.getComputedStyle(secondaryBtn).backgroundColor).toBe('rgb(108, 117, 125)');
            expect(window.getComputedStyle(dangerBtn).backgroundColor).toBe('rgb(220, 53, 69)');
        });

        test('should style forms correctly', () => {
            document.body.innerHTML = `
                <form class="form">
                    <div class="form-group">
                        <label>Label</label>
                        <input type="text" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Select</label>
                        <select class="form-control">
                            <option>Option 1</option>
                            <option>Option 2</option>
                        </select>
                    </div>
                </form>
            `;

            const form = document.querySelector('.form');
            const formGroups = form.querySelectorAll('.form-group');
            const inputs = form.querySelectorAll('.form-control');

            expect(window.getComputedStyle(form).maxWidth).toBe('500px');
            expect(window.getComputedStyle(formGroups[0]).marginBottom).toBe('1rem');
            expect(window.getComputedStyle(inputs[0]).width).toBe('100%');
            expect(window.getComputedStyle(inputs[0]).padding).toBe('0.5rem');
        });
    });

    describe('Animations', () => {
        test('should apply hover animations', () => {
            document.body.innerHTML = `
                <div class="card hover-animation">
                    <div class="card-content"></div>
                </div>
            `;

            const card = document.querySelector('.card');
            const content = card.querySelector('.card-content');

            // Simulate hover
            card.dispatchEvent(new MouseEvent('mouseenter'));
            expect(window.getComputedStyle(content).transform).toBe('translateY(-5px)');
            expect(window.getComputedStyle(content).boxShadow).toBe('0 4px 8px rgba(0, 0, 0, 0.1)');

            // Simulate mouse leave
            card.dispatchEvent(new MouseEvent('mouseleave'));
            expect(window.getComputedStyle(content).transform).toBe('none');
            expect(window.getComputedStyle(content).boxShadow).toBe('none');
        });

        test('should apply transition animations', () => {
            document.body.innerHTML = `
                <div class="modal">
                    <div class="modal-content"></div>
                </div>
            `;

            const modal = document.querySelector('.modal');
            const content = modal.querySelector('.modal-content');

            // Show modal
            modal.style.display = 'block';
            expect(window.getComputedStyle(content).opacity).toBe('1');
            expect(window.getComputedStyle(content).transform).toBe('translateY(0)');

            // Hide modal
            modal.style.display = 'none';
            expect(window.getComputedStyle(content).opacity).toBe('0');
            expect(window.getComputedStyle(content).transform).toBe('translateY(-20px)');
        });
    });

    describe('Accessibility', () => {
        test('should maintain sufficient color contrast', () => {
            document.body.innerHTML = `
                <div class="text-content">
                    <p class="text-primary">Primary Text</p>
                    <p class="text-secondary">Secondary Text</p>
                    <p class="text-muted">Muted Text</p>
                </div>
            `;

            const primaryText = document.querySelector('.text-primary');
            const secondaryText = document.querySelector('.text-secondary');
            const mutedText = document.querySelector('.text-muted');

            // Check color contrast ratios
            const primaryColor = window.getComputedStyle(primaryText).color;
            const secondaryColor = window.getComputedStyle(secondaryText).color;
            const mutedColor = window.getComputedStyle(mutedText).color;

            // These are simplified checks - in a real test, you'd use a color contrast library
            expect(primaryColor).not.toBe(secondaryColor);
            expect(secondaryColor).not.toBe(mutedColor);
        });

        test('should maintain focus styles', () => {
            document.body.innerHTML = `
                <button class="btn">Focus Me</button>
                <input type="text" class="form-control">
            `;

            const button = document.querySelector('.btn');
            const input = document.querySelector('.form-control');

            // Focus button
            button.focus();
            expect(window.getComputedStyle(button).outline).not.toBe('none');

            // Focus input
            input.focus();
            expect(window.getComputedStyle(input).outline).not.toBe('none');
        });
    });
}); 
// Mock performance API
const mockPerformance = {
    now: jest.fn(),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn()
};

global.performance = mockPerformance;

describe('Performance', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    describe('Page Load Performance', () => {
        test('should measure initial page load time', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(1000);

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            measurePageLoad();

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'pageLoad',
                'navigationStart',
                expect.any(Number)
            );
        });

        test('should measure resource loading time', () => {
            mockPerformance.getEntriesByType.mockReturnValue([
                {
                    name: 'script.js',
                    duration: 500,
                    startTime: 100
                },
                {
                    name: 'style.css',
                    duration: 300,
                    startTime: 150
                }
            ]);

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            measureResourceLoading();

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'resourceLoading',
                expect.any(Number),
                expect.any(Number)
            );
        });

        test('should measure DOM content loaded time', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(800);

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            measureDOMContentLoaded();

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'domContentLoaded',
                'navigationStart',
                expect.any(Number)
            );
        });
    });

    describe('Component Rendering Performance', () => {
        test('should measure component render time', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(200);

            document.body.innerHTML = `
                <div id="component"></div>
            `;

            measureComponentRender('test-component');

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'componentRender',
                expect.any(Number),
                expect.any(Number)
            );
        });

        test('should measure list rendering performance', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(500);

            document.body.innerHTML = `
                <div id="list"></div>
            `;

            const items = Array(1000).fill({ id: 1, name: 'Item' });
            measureListRender(items);

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'listRender',
                expect.any(Number),
                expect.any(Number)
            );
        });

        test('should measure chart rendering performance', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(300);

            document.body.innerHTML = `
                <canvas id="chart"></canvas>
            `;

            const data = generateTestData(1000);
            measureChartRender(data);

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'chartRender',
                expect.any(Number),
                expect.any(Number)
            );
        });
    });

    describe('User Interaction Performance', () => {
        test('should measure click response time', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(100);

            document.body.innerHTML = `
                <button id="test-button">Click Me</button>
            `;

            const button = document.getElementById('test-button');
            measureClickResponse(button);

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'clickResponse',
                expect.any(Number),
                expect.any(Number)
            );
        });

        test('should measure form submission time', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(400);

            document.body.innerHTML = `
                <form id="test-form">
                    <input type="text" name="test">
                    <button type="submit">Submit</button>
                </form>
            `;

            const form = document.getElementById('test-form');
            measureFormSubmission(form);

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'formSubmission',
                expect.any(Number),
                expect.any(Number)
            );
        });

        test('should measure search response time', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(200);

            document.body.innerHTML = `
                <input type="search" id="search-input">
            `;

            const input = document.getElementById('search-input');
            measureSearchResponse(input);

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'searchResponse',
                expect.any(Number),
                expect.any(Number)
            );
        });
    });

    describe('Data Processing Performance', () => {
        test('should measure data filtering time', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(150);

            const data = generateTestData(10000);
            measureDataFiltering(data);

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'dataFiltering',
                expect.any(Number),
                expect.any(Number)
            );
        });

        test('should measure data sorting time', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(250);

            const data = generateTestData(10000);
            measureDataSorting(data);

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'dataSorting',
                expect.any(Number),
                expect.any(Number)
            );
        });

        test('should measure data transformation time', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(180);

            const data = generateTestData(10000);
            measureDataTransformation(data);

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'dataTransformation',
                expect.any(Number),
                expect.any(Number)
            );
        });
    });

    describe('Memory Management', () => {
        test('should measure memory usage', () => {
            mockPerformance.memory = {
                usedJSHeapSize: 1000000,
                totalJSHeapSize: 2000000,
                jsHeapSizeLimit: 4000000
            };

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            measureMemoryUsage();

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'memoryUsage',
                expect.any(Number),
                expect.any(Number)
            );
        });

        test('should detect memory leaks', () => {
            mockPerformance.memory = {
                usedJSHeapSize: 1000000,
                totalJSHeapSize: 2000000,
                jsHeapSizeLimit: 4000000
            };

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            detectMemoryLeaks();

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'memoryLeak',
                expect.any(Number),
                expect.any(Number)
            );
        });

        test('should measure garbage collection impact', () => {
            mockPerformance.memory = {
                usedJSHeapSize: 1000000,
                totalJSHeapSize: 2000000,
                jsHeapSizeLimit: 4000000
            };

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            measureGarbageCollection();

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'garbageCollection',
                expect.any(Number),
                expect.any(Number)
            );
        });
    });

    describe('Network Performance', () => {
        test('should measure API response time', async () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(300);

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            await measureAPIResponse();

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'apiResponse',
                expect.any(Number),
                expect.any(Number)
            );
        });

        test('should measure image loading time', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(400);

            document.body.innerHTML = `
                <img id="test-image" src="test.jpg">
            `;

            measureImageLoading();

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'imageLoading',
                expect.any(Number),
                expect.any(Number)
            );
        });

        test('should measure resource caching effectiveness', () => {
            mockPerformance.now
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(100);

            document.body.innerHTML = `
                <div id="app"></div>
            `;

            measureCacheEffectiveness();

            expect(mockPerformance.measure).toHaveBeenCalledWith(
                'cacheEffectiveness',
                expect.any(Number),
                expect.any(Number)
            );
        });
    });
}); 
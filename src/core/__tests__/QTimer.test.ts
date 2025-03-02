import { QTimer, TimerType } from '../QTimer';

describe('QTimer', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('constructor creates inactive timer', () => {
        const timer = new QTimer();
        expect(timer.isActive()).toBeFalsy();
        expect(timer.getInterval()).toBe(0);
        expect(timer.isSingleShot()).toBeFalsy();
    });

    test('start emits immediate timeout', () => {
        const timer = new QTimer();
        const callback = jest.fn();
        
        timer.connect('timeout', callback);
        timer.start(100);
        
        expect(callback).toHaveBeenCalledTimes(1); // Immediate call
        expect(timer.isActive()).toBeTruthy();
    });

    test('stop prevents further timeouts', () => {
        const timer = new QTimer();
        const callback = jest.fn();
        
        timer.connect('timeout', callback);
        timer.start(100);
        expect(callback).toHaveBeenCalledTimes(1); // Immediate call
        
        timer.stop();
        expect(timer.isActive()).toBeFalsy();
        
        jest.advanceTimersByTime(200); // No additional calls
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('single shot timer stops after first timeout', () => {
        const timer = new QTimer();
        const callback = jest.fn();
        
        timer.setSingleShot(true);
        timer.connect('timeout', callback);
        timer.start(100);
        
        expect(callback).toHaveBeenCalledTimes(1); // Immediate call
        expect(timer.isActive()).toBeFalsy(); // Already stopped
    });

    test('setInterval resets the timer', () => {
        const timer = new QTimer();
        const callback = jest.fn();
        
        timer.connect('timeout', callback);
        timer.start(100);
        expect(callback).toHaveBeenCalledTimes(1); // Immediate call
        
        callback.mockClear(); // Reset counter
        
        timer.setInterval(50);
        expect(callback).toHaveBeenCalledTimes(1); // New immediate call
    });

    test('cleanup on destroy', () => {
        const timer = new QTimer();
        const callback = jest.fn();
        
        timer.connect('timeout', callback);
        timer.start(100);
        expect(callback).toHaveBeenCalledTimes(1); // Immediate call
        
        callback.mockClear(); // Reset counter
        timer.destroy();
        expect(timer.isActive()).toBeFalsy();
        
        jest.runAllTimers();
        expect(callback).not.toHaveBeenCalled(); // No calls after destroy
    });

    test('timer type affects interval precision', () => {
        const timer = new QTimer();
        
        timer.setTimerType(TimerType.PreciseTimer);
        const preciseInterval = timer['getAdjustedInterval']();
        expect(preciseInterval).toBe(0); // Default interval
        
        timer.setInterval(100);
        expect(timer['getAdjustedInterval']()).toBe(100);
        
        timer.setTimerType(TimerType.CoarseTimer);
        const coarseInterval = timer['getAdjustedInterval']();
        expect(coarseInterval).toBeGreaterThanOrEqual(95);
        expect(coarseInterval).toBeLessThanOrEqual(105);
        
        timer.setTimerType(TimerType.VeryCoarseTimer);
        expect(timer['getAdjustedInterval']()).toBeGreaterThanOrEqual(1000);
    });

    test('remaining time calculation', () => {
        jest.useRealTimers(); // Need real timers for this test
        const timer = new QTimer();
        
        expect(timer.getRemainingTime()).toBe(-1); // Inactive timer
        
        timer.start(1000);
        const remaining = timer.getRemainingTime();
        
        expect(remaining).toBeGreaterThan(0);
        expect(remaining).toBeLessThanOrEqual(1000);
        
        timer.stop();
        expect(timer.getRemainingTime()).toBe(-1);
        
        jest.useFakeTimers(); // Restore fake timers
    });

    test('synchronization sets timer to active state', () => {
        const timer1 = new QTimer();
        const timer2 = new QTimer();
        
        timer1.setSynchronized(true);
        timer2.setSynchronized(true);
        
        timer1.start(1000);
        timer2.start(1000);
        
        QTimer.synchronizeAll();
        
        expect(timer1.isActive()).toBeTruthy();
        expect(timer2.isActive()).toBeTruthy();
    });

    test('synchronizeAll triggers timeout signal', () => {
        // Create timer and set up test conditions
        const timer = new QTimer();
        const callback = jest.fn();
        
        timer.setSynchronized(true);
        timer.connect('timeout', callback);
        
        // Start timer and check initial call
        timer.start(1000);
        expect(callback).toHaveBeenCalledTimes(1); // Initial call
        
        // Manually reset the active state to test synchronizeAll behavior
        timer.stop();
        timer.__setActiveForTesting(true); // Use test helper
        QTimer.__addToActiveTimers(timer); // Use test helper
        
        callback.mockClear();
        QTimer.synchronizeAll();
        expect(callback).toHaveBeenCalledTimes(1); // Call from synchronization
    });
});

import { QState, QTransition } from './QState';

describe('QState', () => {
    let state: QState;
    
    beforeEach(() => {
        state = new QState();
    });
    
    test('should initialize as inactive', () => {
        expect(state.isActive()).toBe(false);
    });
    
    test('should set active state', () => {
        state.setActive(true);
        expect(state.isActive()).toBe(true);
        
        state.setActive(false);
        expect(state.isActive()).toBe(false);
    });
    
    test('should call onEnter callback when activated', () => {
        const enterCallback = jest.fn();
        state.onEnter(enterCallback);
        
        state.setActive(true);
        expect(enterCallback).toHaveBeenCalledTimes(1);
    });
    
    test('should call onExit callback when deactivated', () => {
        const exitCallback = jest.fn();
        state.onExit(exitCallback);
        
        state.setActive(true);
        state.setActive(false);
        expect(exitCallback).toHaveBeenCalledTimes(1);
    });
    
    test('should emit entered signal when activated', () => {
        const enteredHandler = jest.fn();
        state.connect('entered', enteredHandler);
        
        state.setActive(true);
        expect(enteredHandler).toHaveBeenCalledTimes(1);
    });
    
    test('should emit exited signal when deactivated', () => {
        const exitedHandler = jest.fn();
        state.connect('exited', exitedHandler);
        
        state.setActive(true);
        state.setActive(false);
        expect(exitedHandler).toHaveBeenCalledTimes(1);
    });
});

describe('QTransition', () => {
    let sourceState: QState;
    let targetState: QState;
    let transition: QTransition;
    
    beforeEach(() => {
        sourceState = new QState();
        targetState = new QState();
        
        // Set sourceState to active, so we can test transition properly
        sourceState.setActive(true);
    });
    
    test('should transition between states when signal is emitted', () => {
        transition = new QTransition(sourceState, 'testSignal', targetState);
        
        sourceState.emit('testSignal', null);
        
        expect(sourceState.isActive()).toBe(false);
        expect(targetState.isActive()).toBe(true);
    });
    
    test('should respect guard condition that allows transition', () => {
        transition = new QTransition(sourceState, 'testSignal', targetState);
        transition.setGuard(() => true);
        
        sourceState.emit('testSignal', null);
        
        expect(sourceState.isActive()).toBe(false);
        expect(targetState.isActive()).toBe(true);
    });
    
    test('should respect guard condition that prevents transition', () => {
        transition = new QTransition(sourceState, 'testSignal', targetState);
        transition.setGuard(() => false);
        
        sourceState.emit('testSignal', null);
        
        expect(sourceState.isActive()).toBe(true); // Should remain active
        expect(targetState.isActive()).toBe(false); // Should remain inactive
    });
});

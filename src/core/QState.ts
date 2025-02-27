import { QObject } from './QObject';

export class QState extends QObject {
    private _active: boolean = false;
    private _childStates: QState[] = [];
    private _transitions: QTransition[] = [];
    private _onEnterCallbacks: Function[] = [];
    private _onExitCallbacks: Function[] = [];
    
    constructor(parent?: QObject) {
        super(parent);
    }
    
    addChildState(state: QState): void {
        this._childStates.push(state);
    }
    
    addTransition(transition: QTransition): void {
        this._transitions.push(transition);
    }
    
    onEnter(callback: Function): void {
        this._onEnterCallbacks.push(callback);
    }
    
    onExit(callback: Function): void {
        this._onExitCallbacks.push(callback);
    }
    
    setActive(active: boolean): void {
        if (this._active !== active) {
            this._active = active;
            
            if (active) {
                this._onEnterCallbacks.forEach(cb => cb());
                this.emit('entered', null);
            } else {
                this._onExitCallbacks.forEach(cb => cb());
                this.emit('exited', null);
            }
        }
    }
    
    isActive(): boolean {
        return this._active;
    }
}

export class QTransition extends QObject {
    private _sourceState: QState;
    private _targetState: QState;
    private _signal: string;
    private _guard: (() => boolean) | null = null;
    
    constructor(sourceState: QState, signal: string, targetState: QState) {
        super();
        this._sourceState = sourceState;
        this._signal = signal;
        this._targetState = targetState;
        
        sourceState.connect(signal, () => {
            if (!this._guard || this._guard()) {
                this._sourceState.setActive(false);
                this._targetState.setActive(true);
            }
        });
    }
    
    setGuard(guard: () => boolean): void {
        this._guard = guard;
    }
}

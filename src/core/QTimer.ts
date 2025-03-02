import { QObject } from './QObject';
import { QEvent, EventType } from './QEvent';

export enum TimerType {
    PreciseTimer,     // Millisecond precision
    CoarseTimer,      // ~5% precision
    VeryCoarseTimer   // ~5% precision, minimum 1 second
}

export class QTimer extends QObject {
    private static nextTimerId: number = 1;
    private static activeTimers = new Set<QTimer>();
    private interval: number = 0;
    private currentTimerId: number | null = null;  // Renamed from timerId to currentTimerId
    private singleShot: boolean = false;
    private active: boolean = false;
    private timerType: TimerType = TimerType.CoarseTimer;
    private lastTimeout: number = 0;
    private remainingTime: number = 0;
    private synchronized: boolean = false;
    private syncOffset: number = 0;

    constructor(parent: QObject | null = null) {
        super(parent);
    }

    start(msec?: number): void {
        if (msec !== undefined) {
            this.interval = msec;
        }

        if (this.interval <= 0) return;
        
        this.stop();
        this.active = true;
        this.lastTimeout = Date.now();

        // Execute immediately for the first time
        this.emit('timeout');
        
        if (this.singleShot) {
            this.stop();
            return;
        }
        
        if (this.synchronized) {
            const now = Date.now();
            const phase = now % this.interval;
            this.syncOffset = phase === 0 ? 0 : this.interval - phase;
            
            if (this.syncOffset > 0) {
                setTimeout(() => this.startInterval(), this.syncOffset);
            } else {
                this.startInterval();
            }
        } else {
            this.startInterval();
        }
    }

    private startInterval(): void {
        if (!this.active) return;

        if (this.currentTimerId !== null) {
            window.clearInterval(this.currentTimerId);
            this.currentTimerId = null;
        }

        const adjustedInterval = this.getAdjustedInterval();
        this.currentTimerId = window.setInterval(() => {
            if (!this.active) return;
            this.lastTimeout = Date.now();
            this.emit('timeout');
            if (this.singleShot) {
                this.stop();
            }
        }, adjustedInterval);
        
        QTimer.activeTimers.add(this);
    }

    stop(): void {
        if (this.currentTimerId !== null) {
            window.clearInterval(this.currentTimerId);
            this.currentTimerId = null;
        }
        QTimer.activeTimers.delete(this);
        this.active = false;
        this.syncOffset = 0;
    }

    setInterval(msec: number): void {
        if (msec <= 0) return;
        
        const wasActive = this.active;
        this.stop();
        this.interval = msec;
        if (wasActive) {
            this.start(); // Use start instead of startInterval to handle synchronization
        }
    }

    getInterval(): number {
        return this.interval;
    }

    setSingleShot(singleShot: boolean): void {
        this.singleShot = singleShot;
    }

    isSingleShot(): boolean {
        return this.singleShot;
    }

    isActive(): boolean {
        return this.active;
    }

    setTimerType(type: TimerType): void {
        if (this.timerType !== type) {
            this.timerType = type;
            if (this.isActive()) {
                // Restart timer to apply new type
                this.start(this.interval);
            }
        }
    }

    getTimerType(): TimerType {
        return this.timerType;
    }

    getRemainingTime(): number {
        if (!this.isActive()) return -1;
        return Math.max(0, this.interval - (Date.now() - this.lastTimeout));
    }

    // Change to a getter method
    getTimerId(): number | null {
        return this.currentTimerId;
    }

    setSynchronized(enable: boolean): void {
        if (this.synchronized !== enable) {
            this.synchronized = enable;
            if (enable && this.isActive()) {
                const wasActive = this.active;
                this.stop();
                if (wasActive) {
                    this.start();
                }
            }
        }
    }

    isSynchronized(): boolean {
        return this.synchronized;
    }

    protected getAdjustedInterval(): number {
        const baseInterval = this.interval;
        switch (this.timerType) {
            case TimerType.PreciseTimer:
                return baseInterval;
            case TimerType.CoarseTimer:
                return Math.max(1, Math.round(baseInterval * (0.95 + Math.random() * 0.1)));
            case TimerType.VeryCoarseTimer:
                return Math.max(1000, Math.round(baseInterval * (0.95 + Math.random() * 0.1)));
        }
    }

    static synchronizeAll(): void {
        const timers = Array.from(QTimer.activeTimers).filter(timer => timer.isSynchronized());
        if (timers.length === 0) return;

        // Find the longest interval among synchronized timers
        const maxInterval = Math.max(...timers.map(t => t.interval));
        const now = Date.now();
        const globalPhase = now % maxInterval;
        const syncDelay = globalPhase === 0 ? 0 : maxInterval - globalPhase;

        timers.forEach(timer => {
            const wasActive = timer.active;
            timer.stop();
            if (wasActive) {
                timer.active = true;
                timer.emit('timeout');
                if (!timer.singleShot) {
                    timer.syncOffset = syncDelay;
                    if (syncDelay > 0) {
                        setTimeout(() => timer.startInterval(), syncDelay);
                    } else {
                        timer.startInterval();
                    }
                }
            }
        });
    }

    override destroy(): void {
        QTimer.activeTimers.delete(this);
        this.stop();
        super.destroy();
    }

    // Test helper methods
    static __resetActiveTimers(): void {
        QTimer.activeTimers.clear();
    }
    
    static __addToActiveTimers(timer: QTimer): void {
        QTimer.activeTimers.add(timer);
    }
    
    __setActiveForTesting(active: boolean): void {
        this.active = active;
    }
}

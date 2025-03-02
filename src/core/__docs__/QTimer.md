# QTimer

QTimer provides advanced timing capabilities including synchronization.

## Features

- Regular interval timers
- Single-shot timers
- Timer synchronization
- Multiple precision modes
- Automatic cleanup

## Examples

### Basic Usage

```typescript
import { QTimer } from 'dframe';

// Create a timer that fires every second
const timer = new QTimer();
timer.connect('timeout', () => {
    console.log('Timer fired!');
});
timer.start(1000);
```

### Single-Shot Timer

```typescript
const timer = new QTimer();
timer.setSingleShot(true);
timer.connect('timeout', () => {
    console.log('This will only fire once');
});
timer.start(2000);
```

### Dynamic Interval Changes

```typescript
const timer = new QTimer();
timer.start(1000);

// Later, change the interval
timer.setInterval(500); // Now fires twice as fast
```

### Synchronized Timers

```typescript
import { QTimer } from 'dframe';

// Create synchronized timers
const timer1 = new QTimer();
const timer2 = new QTimer();

timer1.setSynchronized(true);
timer2.setSynchronized(true);

// Start timers - they will automatically synchronize
timer1.start(1000);
timer2.start(1000);

// Synchronize all active timers
QTimer.synchronizeAll();
```

### Timer Precision Modes

```typescript
const timer = new QTimer();
timer.setTimerType(TimerType.PreciseTimer);    // Millisecond precision
timer.setTimerType(TimerType.CoarseTimer);     // ~5% precision
timer.setTimerType(TimerType.VeryCoarseTimer); // Minimum 1 second
```

## API Reference

### Constructor
- `constructor(parent: QObject | null = null)`

### Methods
- `start(msec?: number): void`
- `stop(): void`
- `setInterval(msec: number): void`
- `getInterval(): number`
- `setSingleShot(singleShot: boolean): void`
- `isSingleShot(): boolean`
- `isActive(): boolean`

### Timer Synchronization
- `setSynchronized(enable: boolean): void`
- `isSynchronized(): boolean`
- `static synchronizeAll(): void`

### Precision Control
- `setTimerType(type: TimerType): void`
- `getTimerType(): TimerType`
- `getRemainingTime(): number`

### Timer Types
```typescript
enum TimerType {
    PreciseTimer,     // Millisecond precision
    CoarseTimer,      // ~5% precision
    VeryCoarseTimer   // Minimum 1 second
}
```

### Signals
- `timeout`: Emitted when the timer expires

## Best Practices

1. Always store timer references to prevent memory leaks
2. Use single-shot timers for one-time delays
3. Clean up timers when no longer needed
4. Consider using QObject parent-child relationships for automatic cleanup
5. Be cautious with very short intervals (< 16ms)
6. Use synchronized timers for coordinated animations
7. Choose appropriate timer type for performance
8. Avoid too many precise timers
9. Use coarse timers for non-critical timing
10. Consider battery impact when choosing timer types

## Advanced Features

### Timer Synchronization
Timers can be synchronized to run in phase with each other:
- Useful for coordinated animations
- Reduces timer drift
- Improves performance by grouping timer events

### Precision Modes
Different precision modes balance accuracy vs performance:
- PreciseTimer: Exact timing, higher resource usage
- CoarseTimer: Balanced timing, better performance
- VeryCoarseTimer: Battery-friendly, minimal precision

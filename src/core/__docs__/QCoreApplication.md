# QCoreApplication

QCoreApplication provides the event loop for console applications and is the foundation for QApplication.

## Features

- Command line argument handling
- Event loop management
- Application-wide properties
- Event dispatching
- Graceful shutdown handling

## Examples

### Basic Usage

```typescript
import { QCoreApplication } from 'dframe';

// Create application instance
const app = QCoreApplication.getInstance(['--config=settings.json']);

// Set application information
app.setApplicationName('MyApp');
app.setOrganizationName('MyOrganization');
app.setApplicationVersion('1.0.0');

// Register quit handler
QCoreApplication.connectAboutToQuit(() => {
  console.log('Application is shutting down...');
  // Perform cleanup tasks
});

// Start event loop
const exitCode = app.exec();
```

### Event Handling

```typescript
import { QCoreApplication, QObject, QEvent, EventType } from 'dframe';

class MyObject extends QObject {
  event(event: QEvent): boolean {
    if (event.getType() === EventType.Timer) {
      console.log('Timer event received');
      return true;
    }
    return super.event(event);
  }
}

const app = QCoreApplication.getInstance();
const obj = new MyObject();

// Post an event
const timerEvent = new QEvent(EventType.Timer);
app.postEvent(obj, timerEvent);

// Process events
app.processEvents();
```

### Graceful Shutdown

```typescript
import { QCoreApplication } from 'dframe';

const app = QCoreApplication.getInstance();

// Setup resources
const cleanup = () => {
  console.log('Cleaning up resources...');
  // Close files, network connections, etc.
};

QCoreApplication.connectAboutToQuit(cleanup);

// Later, exit the application
app.exit(0); // Will call cleanup before exiting
```

## API Reference

### Static Methods

- `getInstance(args?: string[]): QCoreApplication`
- `connectAboutToQuit(handler: () => void): void`
- `disconnectAboutToQuit(handler: () => void): void`
- `instance(): QCoreApplication | null`

### Instance Methods

- `setApplicationName(name: string): void`
- `applicationName(): string`
- `setOrganizationName(name: string): void`
- `organizationName(): string`
- `setOrganizationDomain(domain: string): void`
- `organizationDomain(): string`
- `setApplicationVersion(version: string): void`
- `applicationVersion(): string`
- `arguments(): string[]`
- `exec(): number`
- `exit(returnCode?: number): void`
- `isRunning(): boolean`
- `postEvent(receiver: QObject, event: QEvent): void`
- `processEvents(): void`

### Signals

- `started`: Emitted when the event loop starts
- `aboutToQuit`: Emitted when the application is about to quit
- `applicationNameChanged(name: string)`: Emitted when application name changes
- `organizationNameChanged(name: string)`: Emitted when organization name changes
- `organizationDomainChanged(domain: string)`: Emitted when organization domain changes
- `applicationVersionChanged(version: string)`: Emitted when application version changes
- `eventPosted({ receiver, event })`: Emitted when an event is posted
- `eventProcessed(event)`: Emitted when an event is processed

## Best Practices

1. Use the singleton pattern with `getInstance()` to access the application instance
2. Always clean up resources with the `connectAboutToQuit` handlers
3. Set application metadata early to ensure consistent behavior
4. Process events regularly in long-running operations
5. Use the event system rather than direct function calls for loose coupling

# QApplication

QApplication manages the application-wide resources and provides the main event loop.

## Features

- Singleton pattern ensures one instance per application
- Window and focus management
- Application-wide style sheets
- Event loop management
- Application lifecycle control

## Examples

### Basic Application Setup

```typescript
import { QApplication, QWidget } from 'dframe';

// Initialize application
const app = QApplication.getInstance(['arg1', 'arg2']);
app.setApplicationName('MyApp');

// Create main window
const mainWindow = new QWidget();
mainWindow.setWindowTitle('Main Window');
mainWindow.show();

// Start event loop
app.exec();
```

### Style Sheet Management

```typescript
import { QApplication } from 'dframe';

const app = QApplication.getInstance();
app.setStyleSheet(`
    QWidget {
        background-color: white;
        color: black;
    }
    QPushButton {
        padding: 5px 10px;
        border-radius: 3px;
    }
`);
```

### Window Management

```typescript
import { QApplication, QWidget } from 'dframe';

const app = QApplication.getInstance();
const window = new QWidget();

// Monitor window activation
app.connect('activeWindowChanged', (activeWindow: QWidget) => {
    console.log('Active window changed:', activeWindow.getWindowTitle());
});

app.setActiveWindow(window);
```

## API Reference

### Static Methods
- `getInstance(args: string[] = []): QApplication`

### Instance Methods
- `setApplicationName(name: string): void`
- `setStyleSheet(styleSheet: string): void`
- `setActiveWindow(window: QWidget): void`
- `setFocusWidget(widget: QWidget | null): void`
- `exec(): void`
- `quit(): void`

### Signals
- `applicationNameChanged`: Emitted when application name changes
- `styleSheetChanged`: Emitted when style sheet changes
- `activeWindowChanged`: Emitted when active window changes
- `focusWidgetChanged`: Emitted when focus widget changes
- `applicationStarted`: Emitted when exec() is called
- `aboutToQuit`: Emitted when quit() is called

## Best Practices

1. Always initialize QApplication before creating any widgets
2. Use a single style sheet for consistent styling
3. Properly handle application lifecycle events
4. Clean up resources when quitting the application

## Notes

- QApplication is a singleton; only one instance can exist
- The event loop must be started with exec() for the application to work
- Always call quit() when shutting down the application

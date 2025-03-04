import { QApplication, QWidget } from '../core';
import { QPushButton, QLabel } from '../widgets';
import { QVBoxLayout } from '../layouts';
import { QStyle, QFont, QPalette, defaultStyle } from '../style';

export class WidgetShowcase {
  private app!: QApplication;
  private mainWindow!: QWidget;

  constructor() {
    // Create application
    this.app = new QApplication([]);
    this.app.setApplicationName('Simple DFrame Demo');

    // Configure styles
    const style = defaultStyle;
    const buttonFont = new QFont('system-ui', 16, 600);
    const labelFont = new QFont('system-ui', 14, 400);

    style.setStandardFont(buttonFont, 'button');
    style.setStandardFont(labelFont, 'label');
    style.setStandardPalette('#2196f3', QPalette.Button);
    style.setStandardPalette('#ffffff', QPalette.ButtonText);

    // Create main window
    this.mainWindow = new QWidget();
    this.mainWindow.resize(400, 300);
    
    // Center the window
    const x = Math.max(0, (window.innerWidth - 400) / 2);
    const y = Math.max(0, (window.innerHeight - 300) / 2);
    this.mainWindow.move(x, y);

    // Create layout
    const layout = new QVBoxLayout();
    this.mainWindow.setLayout(layout);

    // Create widgets
    const label = new QLabel("Click the button to change me!");
    label.setFont(labelFont);
    label.setAlignment('center');

    const button = new QPushButton("Change Label");
    button.setFont(buttonFont);
    
    // Style the button
    button.setStyleSheet(`
      background: ${style.standardPalette(QPalette.Button)};
      color: ${style.standardPalette(QPalette.ButtonText)};
      border-radius: 4px;
      padding: 12px 24px;
      margin: 8px;
    `);

    // Add widgets to layout
    layout.addWidget(label);
    layout.addSpacing(20);
    layout.addWidget(button);
    layout.addStretch(1);

    // Connect signal to slot
    button.clicked.connect(() => {
      const messages = [
        "Thanks for clicking!",
        "Keep clicking!",
        "You're doing great!",
        "Nice work!",
        "Excellent clicking!"
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      label.setText(randomMessage);
    });

    // Show window when ready
    setTimeout(() => this.mainWindow.show(), 0);
  }

  run(): void {
    this.app.exec();
  }
}
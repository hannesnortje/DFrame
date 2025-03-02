import { QApplication } from '../core/QApplication';
import { QWidget } from '../core/QWidget';
import { QPushButton } from '../widgets/QPushButton';
import { QLabel } from '../widgets/QLabel';
import { QRect } from '../core/QRect';
import { QBoxLayout } from '../layouts/QBoxLayout';
import { QString } from '../core/containers/QString';
import { QEvent, QEventType } from '../core/QEvent';

/**
 * Showcase application for DFrame widgets
 */
export class WidgetShowcase {
  private app: QApplication;
  private mainWindow: QWidget;
  private toolbarArea: QWidget;
  private contentArea: QWidget;
  
  /**
   * Create a new showcase
   */
  constructor() {
    // Initialize application
    this.app = new QApplication([]);
    this.app.setApplicationName("DFrame Showcase");
    
    // Create main window
    this.mainWindow = new QWidget();
    this.mainWindow.setObjectName("mainWindow");
    this.mainWindow.setGeometry(new QRect(100, 100, 800, 600));
    this.mainWindow.setStyleProperty('border', '1px solid #ccc');
    
    // Create toolbar
    this.toolbarArea = new QWidget(this.mainWindow);
    this.toolbarArea.setObjectName("toolbarArea");
    this.toolbarArea.setGeometry(new QRect(0, 0, 800, 50));
    this.toolbarArea.setStyleProperty('background-color', '#f0f0f0');
    this.toolbarArea.setStyleProperty('border-bottom', '1px solid #ccc');
    
    // Add title to toolbar
    const title = new QLabel("DFrame Widget Showcase", this.toolbarArea);
    title.setStyleProperty('font-size', '18px');
    title.setStyleProperty('font-weight', 'bold');
    title.setStyleProperty('padding', '12px');
    
    // Create content area
    this.contentArea = new QWidget(this.mainWindow);
    this.contentArea.setObjectName("contentArea");
    this.contentArea.setGeometry(new QRect(0, 50, 800, 550));
    
    // Create sidebar
    const sidebar = new QWidget(this.contentArea);
    sidebar.setObjectName("sidebar");
    sidebar.setGeometry(new QRect(0, 0, 200, 550));
    sidebar.setStyleProperty('background-color', '#f8f8f8');
    sidebar.setStyleProperty('border-right', '1px solid #ccc');
    
    // Add a label for "Examples" in sidebar
    const sidebarTitle = new QLabel("Examples", sidebar);
    sidebarTitle.setStyleProperty('font-size', '16px');
    sidebarTitle.setStyleProperty('font-weight', 'bold');
    sidebarTitle.setStyleProperty('padding', '10px');
    
    // Add buttons for different examples - use proper QString for text
    const btn1 = new QPushButton(new QString("Buttons"), sidebar);
    btn1.setGeometry(new QRect(10, 50, 180, 30));
    btn1.connect('clicked', () => this.showButtonsExample());
    
    const btn2 = new QPushButton(new QString("Labels"), sidebar);
    btn2.setGeometry(new QRect(10, 90, 180, 30));
    btn2.connect('clicked', () => this.showLabelsExample());
    
    const btn3 = new QPushButton(new QString("Layouts"), sidebar);
    btn3.setGeometry(new QRect(10, 130, 180, 30));
    btn3.connect('clicked', () => this.showLayoutsExample());
    
    // Create container for example content
    const exampleContainer = new QWidget(this.contentArea);
    exampleContainer.setObjectName("exampleContainer");
    exampleContainer.setGeometry(new QRect(200, 0, 600, 550));
    exampleContainer.setStyleProperty('padding', '20px');
    
    // Initial content
    const welcomeLabel = new QLabel("Welcome to DFrame Showcase", exampleContainer);
    welcomeLabel.setGeometry(new QRect(20, 20, 400, 30));
    welcomeLabel.setStyleProperty('font-size', '20px');
    
    const infoLabel = new QLabel("Select an example from the sidebar to start", exampleContainer);
    infoLabel.setGeometry(new QRect(20, 60, 400, 30));
    
    // Apply some styling to the main window
    this.app.setStyleSheet(`
      .qwidget { font-family: 'Arial', sans-serif; }
      #mainWindow { background-color: white; }
    `);
    
    // Show the window
    this.mainWindow.show();
  }
  
  /**
   * Run the application
   */
  run(): void {
    this.app.exec();
  }
  
  /**
   * Show the buttons example
   */
  private showButtonsExample(): void {
    this.clearExampleContainer();
    const container = this.findExampleContainer();
    
    if (!container) return;
    
    // Title for the example
    const title = new QLabel(new QString("Button Examples"), container);
    title.setGeometry(new QRect(20, 20, 400, 30));
    title.setStyleProperty('font-size', '18px');
    
    // Standard button
    const standardBtn = new QPushButton(new QString("Standard Button"), container);
    standardBtn.setGeometry(new QRect(20, 70, 150, 30));
    
    // Checkable button
    const checkableBtn = new QPushButton(new QString("Checkable Button"), container);
    checkableBtn.setGeometry(new QRect(20, 110, 150, 30));
    checkableBtn.setCheckable(true);
    
    // Connect button signals
    standardBtn.connect('clicked', () => {
      const infoLabel = this.findOrCreateInfoLabel(container);
      if (infoLabel) {
        infoLabel.setText("Standard button clicked!");
      }
    });
    
    // Fix the toggled signal handler to accept undefined argument
    checkableBtn.connect('toggled', (checked?: boolean) => {
      const infoLabel = this.findOrCreateInfoLabel(container);
      if (infoLabel) {
        // Add null check for checked parameter
        infoLabel.setText(`Checkable button ${checked ? "checked" : "unchecked"}`);
      }
    });
    
    // Flat button
    const flatBtn = new QPushButton(new QString("Flat Button"), container);
    flatBtn.setGeometry(new QRect(20, 150, 150, 30));
    flatBtn.setFlat(true);
    
    // Disabled button
    const disabledBtn = new QPushButton(new QString("Disabled Button"), container);
    disabledBtn.setGeometry(new QRect(20, 190, 150, 30));
    disabledBtn.setEnabled(false);
  }
  
  /**
   * Show the labels example
   */
  private showLabelsExample(): void {
    this.clearExampleContainer();
    const container = this.findExampleContainer();
    
    if (!container) return;
    
    // Title for the example
    const title = new QLabel(new QString("Label Examples"), container);
    title.setGeometry(new QRect(20, 20, 400, 30));
    title.setStyleProperty('font-size', '18px');
    
    // Basic labels
    const basicLabel = new QLabel(new QString("Basic Label"), container);
    basicLabel.setGeometry(new QRect(20, 70, 560, 30));
    
    // Styled label
    const styledLabel = new QLabel(new QString("Styled Label"), container);
    styledLabel.setGeometry(new QRect(20, 110, 560, 30));
    styledLabel.setStyleProperty('color', 'blue');
    styledLabel.setStyleProperty('font-size', '16px');
    styledLabel.setStyleProperty('font-weight', 'bold');
    
    // Long text with word wrap
    const longText = "This is a very long label that demonstrates the word wrapping capabilities of QLabel. When text is too long to fit in the allocated width, it can automatically wrap to multiple lines.";
    const wrappingLabel = new QLabel(new QString(longText), container);
    wrappingLabel.setGeometry(new QRect(20, 150, 560, 80));
    wrappingLabel.setWordWrap(true);
  }
  
  /**
   * Show the layouts example
   */
  private showLayoutsExample(): void {
    this.clearExampleContainer();
    const container = this.findExampleContainer();
    
    if (!container) return;
    
    // Title for the example
    const title = new QLabel(new QString("Layout Examples"), container);
    title.setGeometry(new QRect(20, 20, 400, 30));
    title.setStyleProperty('font-size', '18px');
    
    // Vertical box layout example
    const layoutContainer = new QWidget(container);
    layoutContainer.setGeometry(new QRect(20, 70, 560, 300));
    layoutContainer.setStyleProperty('border', '1px solid #ddd');
    layoutContainer.setStyleProperty('padding', '10px');
    
    // Fix the Direction enum access - assuming QBoxLayout.TopToBottom exists
    const layout = new QBoxLayout(QBoxLayout.TopToBottom);
    
    // Create widgets and add them to the layout
    const widgets: QWidget[] = [];
    for (let i = 1; i <= 5; i++) {
      const widget = new QWidget();
      widget.setStyleProperty('background-color', this.getRandomColor());
      widget.setStyleProperty('min-height', '40px');
      widget.setText(`Widget ${i}`);
      
      // Add to layout with stretch factor
      layout.addWidget(widget, 1);
      
      if (i < 5) {
        // Fix: Use addStretch instead of addSpacing
        layout.addStretch(1);
      }
      
      widgets.push(widget);
    }
    
    // Fix: Use setGeometry instead of setParentWidget
    layoutContainer.setLayout(layout);
  }
  
  /**
   * Find the example container widget
   */
  private findExampleContainer(): QWidget | null {
    if (!this.contentArea) return null;
    
    for (const child of this.contentArea.children()) {
      if (child instanceof QWidget && child.objectName() === "exampleContainer") {
        return child as QWidget;
      }
    }
    
    return null;
  }
  
  /**
   * Clear the example container
   */
  private clearExampleContainer(): void {
    const container = this.findExampleContainer();
    if (!container) return;
    
    // Loop through children and delete them
    const children = [...container.children()];
    for (const child of children) {
      if (child instanceof QWidget) {
        child.setParent(null);
      }
    }
  }
  
  /**
   * Find or create an info label for showing status messages
   */
  private findOrCreateInfoLabel(container: QWidget): QLabel | null {
    // Look for existing info label
    for (const child of container.children()) {
      if (child instanceof QLabel && child.objectName() === "infoLabel") {
        return child as QLabel;
      }
    }
    
    // Create a new info label
    const infoLabel = new QLabel("", container);
    infoLabel.setObjectName("infoLabel");
    infoLabel.setGeometry(new QRect(20, 230, 560, 30));
    infoLabel.setStyleProperty('color', '#666');
    infoLabel.setStyleProperty('font-style', 'italic');
    
    return infoLabel;
  }
  
  /**
   * Generate a random color
   */
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

// Start the application when loaded
const showcase = new WidgetShowcase();
showcase.run();
import {
  QWidget,
  QLabel,
  QPushButton,
  QVBoxLayout,
  QHBoxLayout
} from '../index';

/**
 * Creates a showcase demonstrating various DFrame components
 */
export function createShowcase() {
  // Main container
  const mainWindow = new QWidget();
  mainWindow.setObjectName('showcaseWindow');
  
  // Set some basic styling
  const mainElement = mainWindow.getElement();
  mainElement.style.padding = '20px';
  mainElement.style.fontFamily = 'Arial, sans-serif';
  mainElement.style.maxWidth = '800px';
  mainElement.style.margin = '0 auto';
  mainElement.style.backgroundColor = '#f8f9fa';
  mainElement.style.borderRadius = '8px';
  mainElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  
  // Main layout
  const mainLayout = new QVBoxLayout(mainWindow);
  mainLayout.setSpacing(15);
  
  // Header section
  const headerLabel = new QLabel('DFrame Component Showcase');
  headerLabel.getElement().style.fontSize = '24px';
  headerLabel.getElement().style.fontWeight = 'bold';
  headerLabel.getElement().style.marginBottom = '15px';
  headerLabel.getElement().style.borderBottom = '1px solid #ddd';
  headerLabel.getElement().style.paddingBottom = '10px';
  mainLayout.addWidget(headerLabel);
  
  // Description
  const descLabel = new QLabel('This showcase demonstrates the core components available in DFrame.');
  descLabel.getElement().style.marginBottom = '20px';
  mainLayout.addWidget(descLabel);
  
  // Widget section
  const widgetSection = createWidgetSection();
  mainLayout.addWidget(widgetSection);
  
  // Button section
  const buttonSection = createButtonSection();
  mainLayout.addWidget(buttonSection);
  
  // Layout section
  const layoutSection = createLayoutSection();
  mainLayout.addWidget(layoutSection);
  
  // Footer
  const footerLabel = new QLabel('DFrame v0.1.0 - A Qt-inspired UI framework for TypeScript');
  footerLabel.getElement().style.marginTop = '20px';
  footerLabel.getElement().style.color = '#6c757d';
  footerLabel.getElement().style.fontSize = '12px';
  footerLabel.getElement().style.textAlign = 'center';
  mainLayout.addWidget(footerLabel);

  return mainWindow;
}

/**
 * Creates a section showcasing basic widgets
 */
function createWidgetSection() {
  const section = new QWidget();
  section.getElement().style.backgroundColor = 'white';
  section.getElement().style.padding = '15px';
  section.getElement().style.borderRadius = '5px';
  section.getElement().style.border = '1px solid #ddd';
  
  const layout = new QVBoxLayout(section);
  
  const sectionTitle = new QLabel('Basic Widgets');
  sectionTitle.getElement().style.fontWeight = 'bold';
  sectionTitle.getElement().style.marginBottom = '10px';
  layout.addWidget(sectionTitle);
  
  // Simple label demos
  const labelRow = new QHBoxLayout();
  
  const regularLabel = new QLabel('Regular Label');
  regularLabel.getElement().style.padding = '8px';
  regularLabel.getElement().style.backgroundColor = '#f8f9fa';
  regularLabel.getElement().style.borderRadius = '4px';
  
  const boldLabel = new QLabel('Bold Label');
  boldLabel.getElement().style.padding = '8px';
  boldLabel.getElement().style.fontWeight = 'bold';
  boldLabel.getElement().style.backgroundColor = '#f8f9fa';
  boldLabel.getElement().style.borderRadius = '4px';
  
  const coloredLabel = new QLabel('Colored Label');
  coloredLabel.getElement().style.padding = '8px';
  coloredLabel.getElement().style.color = 'blue';
  coloredLabel.getElement().style.backgroundColor = '#f8f9fa';
  coloredLabel.getElement().style.borderRadius = '4px';
  
  labelRow.addWidget(regularLabel);
  labelRow.addWidget(boldLabel);
  labelRow.addWidget(coloredLabel);
  layout.addLayout(labelRow);
  
  return section;
}

/**
 * Creates a button section for the showcase
 */
function createButtonSection() {
  const section = new QWidget();
  section.getElement().style.backgroundColor = 'white';
  section.getElement().style.padding = '15px';
  section.getElement().style.borderRadius = '5px';
  section.getElement().style.marginTop = '15px';
  section.getElement().style.border = '1px solid #ddd';
  
  const layout = new QVBoxLayout(section);
  
  const sectionTitle = new QLabel('Button Components');
  sectionTitle.getElement().style.fontWeight = 'bold';
  sectionTitle.getElement().style.marginBottom = '10px';
  layout.addWidget(sectionTitle);
  
  const buttonRow = new QHBoxLayout();
  
  const primaryBtn = new QPushButton('Primary');
  primaryBtn.getElement().style.backgroundColor = '#007bff';
  primaryBtn.getElement().style.color = 'white';
  primaryBtn.getElement().style.border = 'none';
  primaryBtn.getElement().style.padding = '8px 16px';
  primaryBtn.getElement().style.borderRadius = '4px';
  primaryBtn.getElement().style.cursor = 'pointer';
  primaryBtn.connect('clicked', () => {
    alert('Primary button clicked!');
  });
  
  const secondaryBtn = new QPushButton('Secondary');
  secondaryBtn.getElement().style.backgroundColor = '#6c757d';
  secondaryBtn.getElement().style.color = 'white';
  secondaryBtn.getElement().style.border = 'none';
  secondaryBtn.getElement().style.padding = '8px 16px';
  secondaryBtn.getElement().style.borderRadius = '4px';
  secondaryBtn.getElement().style.cursor = 'pointer';
  secondaryBtn.connect('clicked', () => {
    alert('Secondary button clicked!');
  });
  
  const dangerBtn = new QPushButton('Danger');
  dangerBtn.getElement().style.backgroundColor = '#dc3545';
  dangerBtn.getElement().style.color = 'white';
  dangerBtn.getElement().style.border = 'none';
  dangerBtn.getElement().style.padding = '8px 16px';
  dangerBtn.getElement().style.borderRadius = '4px';
  dangerBtn.getElement().style.cursor = 'pointer';
  dangerBtn.connect('clicked', () => {
    alert('Danger button clicked!');
  });
  
  buttonRow.addWidget(primaryBtn);
  buttonRow.addWidget(secondaryBtn);
  buttonRow.addWidget(dangerBtn);
  layout.addLayout(buttonRow);
  
  return section;
}

/**
 * Creates a layout examples section
 */
function createLayoutSection() {
  const section = new QWidget();
  section.getElement().style.backgroundColor = 'white';
  section.getElement().style.padding = '15px';
  section.getElement().style.borderRadius = '5px';
  section.getElement().style.marginTop = '15px';
  section.getElement().style.border = '1px solid #ddd';
  
  const layout = new QVBoxLayout(section);
  
  const sectionTitle = new QLabel('Layout Examples');
  sectionTitle.getElement().style.fontWeight = 'bold';
  sectionTitle.getElement().style.marginBottom = '10px';
  layout.addWidget(sectionTitle);
  
  // Horizontal layout demo
  const hLayoutDemo = new QWidget();
  hLayoutDemo.getElement().style.border = '1px dashed #ccc';
  hLayoutDemo.getElement().style.padding = '10px';
  hLayoutDemo.getElement().style.marginBottom = '10px';
  
  const hLayout = new QHBoxLayout(hLayoutDemo);
  hLayout.setSpacing(10);
  
  for (let i = 1; i <= 3; i++) {
    const box = new QWidget();
    box.getElement().style.backgroundColor = '#e9ecef';
    box.getElement().style.padding = '15px';
    box.getElement().style.textAlign = 'center';
    box.getElement().style.border = '1px solid #dee2e6';
    box.getElement().textContent = `Box ${i}`;
    hLayout.addWidget(box);
  }
  
  // Vertical layout demo
  const vLayoutDemo = new QWidget();
  vLayoutDemo.getElement().style.border = '1px dashed #ccc';
  vLayoutDemo.getElement().style.padding = '10px';
  
  const vLayout = new QVBoxLayout(vLayoutDemo);
  vLayout.setSpacing(10);
  
  for (let i = 1; i <= 3; i++) {
    const box = new QWidget();
    box.getElement().style.backgroundColor = '#e9ecef';
    box.getElement().style.padding = '10px';
    box.getElement().style.textAlign = 'center';
    box.getElement().style.border = '1px solid #dee2e6';
    box.getElement().textContent = `Box ${i}`;
    vLayout.addWidget(box);
  }
  
  layout.addWidget(hLayoutDemo);
  layout.addWidget(vLayoutDemo);
  
  return section;
}

import { QButton } from '../QButton';

describe('QButton', () => {
  let button: QButton;

  beforeEach(() => {
    button = new QButton('Test Button');
    document.body.appendChild(button.element());
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should create button element', () => {
    expect(button.element()).toBeInstanceOf(HTMLButtonElement);
  });

  test('should set and get text', () => {
    button.setText('Click Me');
    expect(button.text().toString()).toBe('Click Me');
    expect(button.element().textContent).toBe('Click Me');
  });

  test('should handle click events', () => {
    const mockCallback = jest.fn();
    button.onClick(mockCallback);

    button.element().click();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('should apply styles', () => {
    button.setStyleProperty('backgroundColor', 'red');
    button.setStyleProperty('fontSize', '20px');

    const element = button.element();
    expect(element.style.backgroundColor).toBe('red');
    expect(element.style.fontSize).toBe('20px');
  });

  test('should update disabled state', () => {
    button.setEnabled(false);
    
    expect(button.isEnabled()).toBe(false);
    const buttonElement = button.element() as HTMLButtonElement;
    expect(buttonElement.disabled).toBe(true);
    expect(buttonElement.style.opacity).toBe('0.6');
    expect(buttonElement.style.cursor).toBe('not-allowed');
    
    button.setEnabled(true);
    
    expect(button.isEnabled()).toBe(true);
    expect(buttonElement.disabled).toBe(false);
    expect(buttonElement.style.opacity).toBe('1');
    expect(buttonElement.style.cursor).toBe('pointer');
  });
});

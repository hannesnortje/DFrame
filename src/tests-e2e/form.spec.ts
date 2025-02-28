import { test, expect } from '@playwright/test';

/**
 * Test form components and input handling
 */
test('Form components should capture and validate user input', async ({ page }) => {
  await page.goto('/test.html');
  await page.waitForSelector('#test-status');
  
  // Set up a simple form with text input
  await page.evaluate(() => {
    const { QWidget, QLabel, QPushButton, QVBoxLayout } = window.DFrame;
    
    // Create form container
    const formContainer = new QWidget();
    formContainer.setObjectName('formContainer');
    document.body.appendChild(formContainer.getElement());
    
    // Add form layout
    const layout = new QVBoxLayout(formContainer);
    
    // Create input field (using standard HTML for simplicity)
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'nameInput';
    inputField.placeholder = 'Enter your name';
    formContainer.getElement().appendChild(inputField);
    
    // Create submit button
    const submitButton = new QPushButton('Submit');
    submitButton.setObjectName('submitButton');
    
    // Create result display
    const resultDiv = document.createElement('div');
    resultDiv.id = 'formResult';
    resultDiv.textContent = 'No submission yet';
    document.body.appendChild(resultDiv);
    
    // Add submission handler
    submitButton.connect('clicked', () => {
      const inputElement = document.getElementById('nameInput') as HTMLInputElement;
      const inputValue = inputElement ? inputElement.value : '';
      
      if (inputValue.trim() === '') {
        const resultElement = document.getElementById('formResult');
        if (resultElement) {
          resultElement.textContent = 'Error: Name is required';
          resultElement.style.color = 'red';
        }
      } else {
        const resultElement = document.getElementById('formResult');
        if (resultElement) {
          resultElement.textContent = `Hello, ${inputValue}!`;
          resultElement.style.color = 'green';
        }
      }
    });
    
    // Add button to layout
    layout.addWidget(submitButton);
  });
  
  // Test empty submission first
  await page.locator('[data-dframe-object-name="submitButton"]').click();
  expect(await page.locator('#formResult').textContent()).toBe('Error: Name is required');
  expect(await page.locator('#formResult').evaluate(el => getComputedStyle(el).color)).toContain('255, 0, 0'); // Red color
  
  // Now test with valid input
  await page.fill('#nameInput', 'DFrame User');
  await page.locator('[data-dframe-object-name="submitButton"]').click();
  expect(await page.locator('#formResult').textContent()).toBe('Hello, DFrame User!');
  expect(await page.locator('#formResult').evaluate(el => getComputedStyle(el).color)).toContain('0, 128, 0'); // Green color
  
  // Take a screenshot of the form result
  await page.screenshot({ path: 'test-results/form-submission.png' });
});

import { test, expect } from '@playwright/test';
import { DFrameTestUtils } from '../helpers/test-utils';

test.describe('Complex Form Integration', () => {
  test.beforeEach(async ({ page }) => {
    await DFrameTestUtils.setupTestPage(page);
  });

  test('should handle a multi-field form with validation', async ({ page }) => {
    // Create a complex form with multiple fields and validation
    await page.evaluate(() => {
      const { QWidget, QLabel, QPushButton, QVBoxLayout } = window.DFrame;
      
      // Create form
      const form = new QWidget();
      form.setObjectName('registrationForm');
      form.getElement().style.width = '400px';
      form.getElement().style.padding = '20px';
      form.getElement().style.border = '1px solid #ccc';
      
      const layout = new QVBoxLayout(form);
      
      // Create form fields (using HTML elements for simplicity)
      // Name field
      const nameLabel = new QLabel('Name:');
      nameLabel.setObjectName('nameLabel');
      
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.id = 'nameInput';
      nameInput.placeholder = 'Enter your name';
      
      // Email field
      const emailLabel = new QLabel('Email:');
      emailLabel.setObjectName('emailLabel');
      
      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.id = 'emailInput';
      emailInput.placeholder = 'Enter your email';
      
      // Password field
      const passwordLabel = new QLabel('Password:');
      passwordLabel.setObjectName('passwordLabel');
      
      const passwordInput = document.createElement('input');
      passwordInput.type = 'password';
      passwordInput.id = 'passwordInput';
      passwordInput.placeholder = 'Create a password';
      
      // Submit button
      const submitButton = new QPushButton('Register');
      submitButton.setObjectName('registerButton');
      
      // Validation result
      const resultDiv = document.createElement('div');
      resultDiv.id = 'validationResult';
      
      // Add elements to form
      form.getElement().appendChild(nameLabel.getElement());
      form.getElement().appendChild(nameInput);
      form.getElement().appendChild(emailLabel.getElement());
      form.getElement().appendChild(emailInput);
      form.getElement().appendChild(passwordLabel.getElement());
      form.getElement().appendChild(passwordInput);
      form.getElement().appendChild(submitButton.getElement());
      form.getElement().appendChild(resultDiv);
      
      // Add validation
      submitButton.connect('clicked', () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        let errors = [];
        
        if (!name) errors.push('Name is required');
        if (!email) errors.push('Email is required');
        else if (!email.includes('@')) errors.push('Email must be valid');
        if (!password) errors.push('Password is required');
        else if (password.length < 6) errors.push('Password must be at least 6 characters');
        
        if (errors.length > 0) {
          resultDiv.textContent = errors.join(', ');
          resultDiv.style.color = 'red';
        } else {
          resultDiv.textContent = 'Registration successful!';
          resultDiv.style.color = 'green';
        }
      });
      
      document.body.appendChild(form.getElement());
    });
    
    // Get form elements
    const form = DFrameTestUtils.getComponent(page, 'registrationForm');
    const submitButton = DFrameTestUtils.getComponent(page, 'registerButton');
    
    // Test empty form submission
    await submitButton.click();
    expect(await page.locator('#validationResult').textContent()).toContain('Name is required');
    
    // Fill out name only
    await page.fill('#nameInput', 'John Doe');
    await submitButton.click();
    expect(await page.locator('#validationResult').textContent()).toContain('Email is required');
    
    // Fill out invalid email
    await page.fill('#emailInput', 'invalid-email');
    await submitButton.click();
    expect(await page.locator('#validationResult').textContent()).toContain('Email must be valid');
    
    // Fill out valid email but short password
    await page.fill('#emailInput', 'john@example.com');
    await page.fill('#passwordInput', '12345');
    await submitButton.click();
    expect(await page.locator('#validationResult').textContent()).toContain('Password must be at least 6 characters');
    
    // Fill out everything correctly
    await page.fill('#passwordInput', 'securepassword');
    await submitButton.click();
    expect(await page.locator('#validationResult').textContent()).toBe('Registration successful!');
    
    // Check success color
    const color = await page.locator('#validationResult').evaluate(el => getComputedStyle(el).color);
    expect(color).toContain('0, 128, 0'); // Green color
    
    // Take screenshot of successful form
    await page.screenshot({ path: 'test-results/registration-form.png' });
  });
});

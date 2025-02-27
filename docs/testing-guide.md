# DFrame Testing Guide

## Running Tests

### Standard Test Run

This will:
- Start Jest in watch mode
- Monitor file changes
- Only run tests related to files that have changed since your last Git commit
- Provide an interactive menu to filter and run specific tests

## 3. Set Up a Development Workflow

Here's a typical workflow you can follow:

1. Start the test watcher in one terminal:
   ```bash
   npm run test:watch
   ```

2. Start your development server in another terminal:
   ```bash
   npm run dev
   ```

3. Make changes to your code
4. Tests will automatically run when you save changes
5. When you complete a feature or fix, commit your changes:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

## 4. Finish Your Testing Documentation

Complete your testing guide to serve as a reference for yourself and any collaborators:

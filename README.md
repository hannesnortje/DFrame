# DFrame

A TypeScript clone of the Qt framework, focusing on core functionality and maintainability.

## Project Structure

```
src/
  ├── core/           # Core classes
  │   ├── __tests__/ # Unit tests
  │   └── __docs__/  # Documentation
  ├── layouts/       # Layout components
  │   ├── __tests__/
  │   └── __docs__/
  └── widgets/       # Widget components
      ├── __tests__/
      └── __docs__/
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test            # All tests
npm run test:core   # Core tests only
npm run test:watch  # Watch mode

# Run E2E tests
npm run test:e2e

# Development server
npm run dev

# Production build
npm run build
```

## Documentation

Documentation is available for each module in their respective `__docs__` directories.
Run the development server and visit `/showcase.html` to see interactive examples.

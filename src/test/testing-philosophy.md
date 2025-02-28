# DFrame Testing Philosophy

## Test Behavior, Not Implementation

Focus tests on observable behavior rather than implementation details:

- ✅ Test what a component does 
- ❌ Test how it does it

For example, when testing QVBoxLayout:
- Test that widgets are visually arranged vertically
- Don't test the internal DOM manipulation implementation

## Use Contract Tests

Define clear contracts for each component and test those contracts.

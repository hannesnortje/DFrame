#!/bin/bash

# This script sets up focused testing by adding a tag to targeted tests
# Usage: ./scripts/focus-test.sh widget
#        ./scripts/focus-test.sh layout
#        ./scripts/focus-test.sh button

TARGET=$1

if [ -z "$TARGET" ]; then
  echo "Please specify what to focus on: widget, button, label, layout, integration"
  exit 1
fi

# Run the tests with the focus tag and the appropriate grep pattern
case $TARGET in
  widget)
    TEST_FOCUS=1 npx playwright test src/tests-e2e/widgets/ --grep="@focus"
    ;;
  button)
    TEST_FOCUS=1 npx playwright test src/tests-e2e/widgets/QPushButton.spec.ts --grep="@focus"
    ;;
  label)
    TEST_FOCUS=1 npx playwright test src/tests-e2e/widgets/QLabel.spec.ts --grep="@focus"
    ;;
  layout)
    TEST_FOCUS=1 npx playwright test src/tests-e2e/layout.spec.ts src/tests-e2e/horizontal-layout.spec.ts --grep="@focus"
    ;;
  integration)
    TEST_FOCUS=1 npx playwright test src/tests-e2e/integration/ --grep="@focus"
    ;;
  *)
    echo "Unknown target: $TARGET"
    exit 1
    ;;
esac

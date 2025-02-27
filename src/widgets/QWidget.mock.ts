import { QWidget } from './QWidget';
import { QLayout } from '../layouts/QLayout';

// Add mock implementations for QWidget in tests
QWidget.prototype.setLayout = function(layout: QLayout) {
  (this as any).layout = layout;
  layout.setParent(this);
  return this;
};

QWidget.prototype.getLayout = function() {
  return (this as any).layout;
};

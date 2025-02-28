// Script that sets up the test environment

(function() {
  // Create a global mock DFrame with the minimum needed functionality for tests
  window.DFrame = {
    // Core components
    QObject: function() { this.connect = function() {}; return this; },
    QStyle: {
      applyStyle: function(element, styles) { 
        if (element && element.style) {
          Object.assign(element.style, styles);
        }
        return element;
      }
    },
    Qt: {
      AlignmentFlag: {
        AlignLeft: 1,
        AlignRight: 2,
        AlignHCenter: 4,
        AlignJustify: 8,
        AlignTop: 32,
        AlignBottom: 64,
        AlignVCenter: 128,
        AlignCenter: 4 | 128
      }
    },
    
    // Widgets
    QWidget: function() { 
      const element = document.createElement('div');
      element.style.width = '100px';
      element.style.height = '50px';
      element.style.position = 'relative';
      
      return {
        setObjectName: function(name) { 
          element.setAttribute('data-dframe-object-name', name);
          return this;
        },
        getElement: function() { return element; },
        getParentWidget: function() { return null; },
        constructor: { name: 'QWidget' }
      };
    },
    QLabel: function(text) {
      const widget = new window.DFrame.QWidget();
      const element = widget.getElement();
      element.textContent = text;
      element.style.backgroundColor = '#f0f0f0';
      return {
        ...widget,
        setText: function(text) { element.textContent = text; },
        getText: function() { return element.textContent; },
        constructor: { name: 'QLabel' }
      };
    },
    QPushButton: function(text) {
      const widget = new window.DFrame.QWidget();
      const element = widget.getElement();
      element.textContent = text;
      element.style.backgroundColor = '#ddd';
      
      const self = {
        ...widget,
        setText: function(text) { element.textContent = text; },
        getText: function() { return element.textContent; },
        connect: function(event, handler) {
          element.addEventListener('click', handler);
          return this;
        },
        constructor: { name: 'QPushButton' }
      };
      
      element.addEventListener('click', function() {
        // Create a click event for testing
        const event = new CustomEvent('clicked');
        element.dispatchEvent(event);
      });
      
      return self;
    },
    
    // Layouts
    QVBoxLayout: function(parent) {
      const widgets = [];
      return {
        addWidget: function(widget, options) {
          widgets.push({ widget, options });
          if (parent && parent.getElement) {
            parent.getElement().appendChild(widget.getElement());
          }
          return this;
        },
        getWidgets: function() { return widgets; },
        setContentsMargins: function() { return this; },
        setSpacing: function() { return this; },
        getSpacing: function() { return 10; },
        constructor: { name: 'QVBoxLayout' }
      };
    },
    QHBoxLayout: function(parent) {
      const vboxLayout = new window.DFrame.QVBoxLayout(parent);
      // Change orientation to horizontal
      if (parent && parent.getElement) {
        parent.getElement().style.display = 'flex';
        parent.getElement().style.flexDirection = 'row';
      }
      return {
        ...vboxLayout,
        constructor: { name: 'QHBoxLayout' }
      };
    }
  };
  
  console.log('Test mock DFrame created in global scope');
})();

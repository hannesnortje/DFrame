// Custom serializer for QWidget snapshots

module.exports = {
  test: (val) => val && val._isDFrameWidget,
  
  serialize: (val, config, indentation, depth, refs, printer) => {
    const element = val.getElement();
    
    // Create a simplified representation for snapshots
    const snapshot = {
      type: val.constructor.name,
      objectName: val.objectName(),
      children: Array.from(element.children).map(child => ({
        tagName: child.tagName,
        className: child.className
      }))
    };
    
    return printer(snapshot, config, indentation, depth, refs);
  }
};

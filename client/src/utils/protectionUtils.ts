/**
 * Protection utilities to prevent screenshots and printing
 */

// Prevent screenshots using keyboard shortcuts
function preventScreenshots() {
  document.addEventListener('keydown', (e) => {
    // Prevent Print Screen (screenshot)
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      alert('Screenshots are disabled for this assessment.');
      return false;
    }
    
    // Prevent Ctrl+P / Cmd+P (printing)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      alert('Printing is disabled for this assessment.');
      return false;
    }
    
    // Prevent Ctrl+Shift+S / Cmd+Shift+S (save as)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      alert('Saving is disabled for this assessment.');
      return false;
    }
  });
}

// Prevent right-click context menu
function preventContextMenu() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
}

// Prevent selection of text
function preventSelection() {
  // Apply CSS to prevent selection
  const style = document.createElement('style');
  style.textContent = `
    body {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    /* Allow selection in input fields and textareas */
    input, textarea, [contenteditable="true"] {
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }
  `;
  document.head.appendChild(style);
}

// Initialize all protection methods
function initializeProtection() {
  preventScreenshots();
  preventContextMenu();
  preventSelection();
  
  // Override window.print
  window.print = () => {
    alert('Printing is disabled for this assessment.');
    return false;
  };
}

// Apply protection when the module is imported
initializeProtection();

export {};

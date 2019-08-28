let trapFocusContainer;
let ignoreUtilFocusChanges = false;

// eslint-disable-next-line complexity
function isFocusable(element) {
  if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
    return true;
  }

  if (element.disabled) {
    return false;
  }

  switch (element.nodeName) {
    case 'A':
      return !!element.href && element.rel !== 'ignore';
    case 'INPUT':
      return element.type !== 'hidden' && element.type !== 'file';
    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA':
      return true;
    default:
      return false;
  }
}

function attemptFocus(element) {
  if (!isFocusable(element)) {
    return false;
  }
  ignoreUtilFocusChanges = true;

  try {
    element.focus();
  } catch (e) {
  }

  ignoreUtilFocusChanges = false;

  return (document.activeElement === element);
}

function focusFirstDescendant(element) {
  for (let i = 0; i < element.childNodes.length; i++) {
    let child = element.childNodes[i];
    if (attemptFocus(child) || focusFirstDescendant(child)) {
      return true;
    }
  }
  return false;
}

function focusLastDescendant(element) {
  for (let i = element.childNodes.length - 1; i >= 0; i--) {
    let child = element.childNodes[i];
    if (attemptFocus(child) || focusLastDescendant(child)) {
      return true;
    }
  }
  return false;
}

function trapEventFocus(event) {
  if (ignoreUtilFocusChanges) {
    return;
  }
  if (trapFocusContainer.contains(event.target)) {
    trapFocusContainer.lastFocus = event.target;
  } else {
    focusFirstDescendant(trapFocusContainer);
    if (trapFocusContainer.lastFocus === document.activeElement) {
      focusLastDescendant(trapFocusContainer);
    }
  }
}

export function trapFocus(containerToTrapFocusOf) {
  let preDiv = document.createElement('div');
  let preNode = containerToTrapFocusOf.parentNode.insertBefore(preDiv, containerToTrapFocusOf);
  preNode.tabIndex = 0;

  let postDiv = document.createElement('div');
  let postNode = containerToTrapFocusOf.parentNode.insertBefore(postDiv, containerToTrapFocusOf.nextSibling);
  postNode.tabIndex = 0;

  trapFocusContainer = containerToTrapFocusOf;
  document.addEventListener('focus', trapEventFocus, true);

}

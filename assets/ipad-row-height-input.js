// iPad Safari can restore the controlled value while the pattern is recalculated.
// Let the user finish editing, then send the final value through React normally.
(() => {
  const isIPad = /iPad/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!isIPad) return;

  let editing = null;
  let originalValue = '';

  const isRowHeight = (target) => target instanceof HTMLInputElement
    && target.type === 'number'
    && target.closest('label')?.textContent.includes('1排高度');

  window.addEventListener('focusin', (event) => {
    if (isRowHeight(event.target)) {
      editing = event.target;
      originalValue = editing.value;
    }
  }, true);

  window.addEventListener('input', (event) => {
    if (event.target === editing) event.stopImmediatePropagation();
  }, true);

  window.addEventListener('focusout', (event) => {
    if (event.target !== editing) return;
    const input = editing;
    editing = null;
    if (!Number.isFinite(input.valueAsNumber) || input.valueAsNumber < 0.1) {
      input.value = originalValue;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, true);
})();

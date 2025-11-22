// Fix for Chart.js detecting OffscreenCanvas in Vite environments
// Force Chart.js to always use the normal browser canvas.
Object.defineProperty(globalThis, 'OffscreenCanvas', {
  value: undefined,
  writable: false,
});
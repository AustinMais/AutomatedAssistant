import '@testing-library/jest-dom';

// Polyfill scrollIntoView for jsdom
Element.prototype.scrollIntoView = jest.fn();

// Polyfill TransformStream for AI SDK in jsdom
if (typeof globalThis.TransformStream === 'undefined') {
  // @ts-expect-error - minimal polyfill for tests
  globalThis.TransformStream = class TransformStream {
    readonly readable = { getReader: () => ({ read: () => Promise.resolve({ done: true }) }) };
    readonly writable = { getWriter: () => ({ write: () => {}, close: () => {} }) };
  };
}

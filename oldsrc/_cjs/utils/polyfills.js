Object.defineProperty(exports, '__esModule', { value: true })
const buffer_1 = require('node:buffer')
require('core-js/stable')
if (typeof window !== 'undefined') {
  window.global = window
  window.Buffer = buffer_1.Buffer
}
//# sourceMappingURL=polyfills.js.map

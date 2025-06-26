Object.defineProperty(exports, '__esModule', { value: true })
exports.sleep = sleep
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), ms)
  })
}
//# sourceMappingURL=sleep.js.map

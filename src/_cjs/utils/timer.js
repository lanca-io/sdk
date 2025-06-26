Object.defineProperty(exports, '__esModule', { value: true })
exports.timer = void 0
const timer = (func) => {
  let counterTime = 1
  const timerId = setInterval(() => {
    counterTime++
    func(counterTime)
  }, 1000)
  return () => {
    clearInterval(timerId)
  }
}
exports.timer = timer
//# sourceMappingURL=timer.js.map

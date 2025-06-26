Object.defineProperty(exports, '__esModule', { value: true })
exports.median = void 0
const median = (arr) => {
  if (!arr.length) {
    return
  }
  const s = [...arr].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
  const mid = Math.floor(s.length / 2)
  if (s.length % 2 === 0) {
    return (s[mid - 1] + s[mid]) / 2n
  }
  return s[mid]
}
exports.median = median
//# sourceMappingURL=median.js.map

Object.defineProperty(exports, '__esModule', { value: true })
exports.stringifyWithBigInt = stringifyWithBigInt
const constants_1 = require('../constants')
function stringifyWithBigInt(obj) {
  return JSON.stringify(
    obj,
    (_, value) => (typeof value === 'bigint' ? value.toString() : value),
    constants_1.DEFAULT_INDENTATION
  )
}
//# sourceMappingURL=stringifyWithBigInt.js.map

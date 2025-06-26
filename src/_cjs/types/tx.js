Object.defineProperty(exports, '__esModule', { value: true })
exports.StepType = exports.Status = void 0
let Status
;((Status) => {
  Status.SUCCESS = 'SUCCESS'
  Status.FAILED = 'FAILED'
  Status.PENDING = 'PENDING'
  Status.NOT_STARTED = 'NOT_STARTED'
  Status.REJECTED = 'REJECTED'
})(Status || (exports.Status = Status = {}))
let StepType
;((StepType) => {
  StepType.SRC_SWAP = 'SRC_SWAP'
  StepType.BRIDGE = 'BRIDGE'
  StepType.DST_SWAP = 'DST_SWAP'
  StepType.ALLOWANCE = 'ALLOWANCE'
  StepType.SWITCH_CHAIN = 'SWITCH_CHAIN'
})(StepType || (exports.StepType = StepType = {}))
//# sourceMappingURL=tx.js.map

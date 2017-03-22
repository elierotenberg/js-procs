const asyncNoop = () => Promise.resolve();

function Proc(...args) {}

Object.assign(Proc, {
  _currentProc: null,
  _activeProcs: new Set(),
  getCurrent() {
    return this._currentProc;
  },
});

Object.assign(Proc.prototype, {
  name: null,
  state: null,
  onEnter: asyncNoop,
  onLeave: asyncNoop,
  onExit: asyncNoop,
  setState(nextState) {
    this.state = Object.assign(this.state, nextState);
    return this;
  },
});

export default Proc;

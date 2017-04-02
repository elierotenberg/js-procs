import 'zone.js';
const { Zone } = global;

import guid from './util/guid';

import ProcZoneSpec from './ProcZoneSpec';

function bindToCurrentZone(fn) {
  const currentZone = Zone.current;
  return (...args) => currentZone.run(() => fn(...args));
}

function bindToZone(zone, fn) {
  return (...args) => zone.run(() => fn(...args));
}

function getCurrentZoneName() {
  return Zone.current.name;
}

const rootZone = Zone.current;
function log(...args) {
  rootZone.run(() => console.log(...[`(${rootZone.name})`, ...args]));
}

function getProc() {
  return Zone.current.get('proc');
}

function getProps() {
  return getProc().props;
}

function getState() {
  return getProc().state();
}

function setState(nextState) {
  Object.assign(getProc().state, nextState);
}

function resolve(value) {
  return getProc().resolve(value);
}

function reject(err) {
  return getProc().reject(err);
}

const lifecycleMethods = {
  onFrame(runFrame) {
    runFrame();
  },

  onError(err) {
    reject(err);
  },

  onIdle(hasTaskState) {
    resolve(getState());
  },

  start() {},
};

Object.keys(lifecycleMethods).forEach(
  methodName =>
    lifecycleMethods[methodName] = lifecycleMethods[methodName].bind(null),
);

function receive() {
  const inbox = getProc().inbox;
  if (inbox.length === 0) {
    return null;
  }
  return inbox.shift();
}

class Proc {
  constructor(props, name = `proc-${guid()}`) {
    this.props = props;
    this.name = name;
    this.inbox = [];
    this.settled = false;

    Object.keys(lifecycleMethods).forEach(methodName => {
      if (!this[methodName]) {
        this[methodName] = lifecycleMethods[methodName];
      } else {
        this[methodName] = this[methodName].bind(null);
      }
    });

    const settle = () => {
      this.settled = true;
      this.inbox.length = 0;
    };

    this.joinPromise = new Promise((resolve$, reject$) => {
      this.resolve = resolve$;
      this.reject = reject$;
    });
    this.joinPromise.then(settle, settle);

    const { onFrame, onError, onIdle } = this;

    this.zoneSpec = new ProcZoneSpec(name, this, {
      handleFrame(runFrame) {
        onFrame.apply(null, [runFrame]);
      },
      handleError(err) {
        onError.apply(null, [err]);
      },
      handleIdle() {
        onIdle.apply(null);
      },
    });

    this.zone = Zone.current.fork(this.zoneSpec);
  }

  send(message) {
    if (message === null) {
      throw new Error('Message cannot be `null`.');
    }
    if (!this.settled) {
      this.inbox.push(message);
    }
  }

  spawn() {
    this.zone.run(() => process.nextTick(this.start.bind(this)));
    return this;
  }

  join() {
    return this.joinPromise;
  }
}

export {
  log,
  bindToCurrentZone,
  getCurrentZoneName,
  getProc,
  getProps,
  getState,
  setState,
  resolve,
  reject,
  receive,
};

export default Proc;

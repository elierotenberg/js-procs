import {
  Proc,
  receive,
  resolve,
  getProps,
  getCurrentZoneName,
} from '../../lib';

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration));

class TickerProc extends Proc {
  start() {
    const { onTick, interval } = getProps();
    const tick = () => {
      if (receive() === 'stop') {
        return resolve();
      }
      onTick();
      setTimeout(tick, interval);
    };
    tick();
  }
}

export default TickerProc;

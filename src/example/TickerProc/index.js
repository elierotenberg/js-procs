import TickerProc from './TickerProc';
import { bindToCurrentZone, getCurrentZoneName } from '../../lib';

const proc = new TickerProc({
  interval: 1000,
  onTick: bindToCurrentZone(() => {
    console.log('tick', getCurrentZoneName());
  }),
});

proc
  .spawn()
  .join()
  .then(
    bindToCurrentZone(finalState => {
      console.warn('proc done', finalState, getCurrentZoneName());
    }),
  )
  .catch(
    bindToCurrentZone(err => {
      console.warn('err', err);
    }),
  );

setTimeout(() => proc.send('stop'), 5000);

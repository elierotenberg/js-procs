import 'zone.js';
const { Zone } = global;

import Proc, {
  bindToCurrentZone,
  getCurrentZoneName,
  getProc,
  getProps,
  getState,
  setState,
  resolve,
  reject,
  receive,
} from './Proc';

export {
  Proc,
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

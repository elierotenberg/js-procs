import 'zone.js';
const { Zone, describe, it } = global;

const getCurrentZoneName = () => Zone.current.name;

describe('zone.js', () => {
  it('handles async/await', done => {
    const zone = Zone.current.fork({
      name: 'test-zone',
    });
    zone.run(async () => {
      console.log(getCurrentZoneName());
      await Promise.resolve();
      console.log(getCurrentZoneName());
      done();
    });
  });
});

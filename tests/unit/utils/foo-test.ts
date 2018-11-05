import { module, test } from 'qunit';

module('Unit | Utility | foo', _hooks => {
  // Replace this with your real tests.
  test('it works', assert => {
    assert.snapshot(
      {
        hello: 'world'
      },
      'w'
    );
    assert.snapshot(
      {
        hello: 'world'
      },
      'world'
    );
    assert.snapshot(
      {
        hello: 'mafrs'
      },
      'mars'
    );
  });
});

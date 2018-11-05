import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | x-foo', hooks => {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{x-foo}}`);

    assert.equal(
      ('' + this.element.textContent).trim(),
      `This is a test
To see if snapshots work with components`
    );

    assert.snapshot(this.element, 'x-foo component with no parameters');
  });
});

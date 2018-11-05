import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | x-foo', hooks => {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{x-foo}}`);
    assert.snapshot(this.element, 'x-foo component with no parameters');
  });
});

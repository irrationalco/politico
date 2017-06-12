import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tooltip-single', 'Integration | Component | tooltip single', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{tooltip-single}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#tooltip-single}}
      template block text
    {{/tooltip-single}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

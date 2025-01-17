import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('projections-charts', 'Integration | Component | projections charts', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{projections-charts}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#projections-charts}}
      template block text
    {{/projections-charts}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

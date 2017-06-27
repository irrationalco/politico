import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('poll-progress-bar', 'Integration | Component | poll progress bar', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{poll-progress-bar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#poll-progress-bar}}
      template block text
    {{/poll-progress-bar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

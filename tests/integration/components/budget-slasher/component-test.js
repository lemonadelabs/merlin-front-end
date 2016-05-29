import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('budget-slasher', 'Integration | Component | budget slasher', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{budget-slasher}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#budget-slasher}}
      template block text
    {{/budget-slasher}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

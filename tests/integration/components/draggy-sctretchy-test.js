import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('draggy-sctretchy', 'Integration | Component | draggy sctretchy', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{draggy-sctretchy}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#draggy-sctretchy}}
      template block text
    {{/draggy-sctretchy}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

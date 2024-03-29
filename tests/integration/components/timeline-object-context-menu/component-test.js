import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('timeline-object-context-menu', 'Integration | Component | timeline object context menu', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{timeline-object-context-menu}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#timeline-object-context-menu}}
      template block text
    {{/timeline-object-context-menu}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

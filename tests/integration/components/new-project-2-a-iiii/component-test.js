import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('new-project-2-a-iiii', 'Integration | Component | new project 2 a iiii', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{new-project-2-a-iiii}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#new-project-2-a-iiii}}
      template block text
    {{/new-project-2-a-iiii}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

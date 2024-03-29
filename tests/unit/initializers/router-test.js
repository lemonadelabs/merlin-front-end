import Ember from 'ember';
import RouterInitializer from 'merlin/initializers/router';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | router', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  RouterInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});

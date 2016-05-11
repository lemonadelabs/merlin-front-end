import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return Ember.$.getJSON('api/simulation-run/1') // make this not hard coded
  }
});

import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return Ember.$.getJSON('api/simulations/1') // make this not hard coded
  }
});

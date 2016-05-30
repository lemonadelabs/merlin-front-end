import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      simulation: Ember.$.getJSON(`api/simulations/${params.simulation_id}/`),
      scenarios: Ember.$.getJSON('api/scenarios/')
    });
  },
  afterModel: function(model) {
    console.log(model);
  }
});

import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      simulation: Ember.$.getJSON(`api/simulations/${params.simulation_id}/`),
      'baseline': Ember.$.getJSON(`api/simulation-run/${params.simulation_id}/?steps=120&s0=baseline/`)
    });
  },
});

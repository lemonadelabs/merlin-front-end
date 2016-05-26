import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      simulation: Ember.$.getJSON(`api/simulations/${params.simulation_id}/`),
      'simulation-run': Ember.$.getJSON(`api/simulation-run/${params.simulation_id}/`)
    });
  },
});

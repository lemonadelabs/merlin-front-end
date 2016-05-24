import Ember from 'ember';
import mockData from './mock-data'

export default Ember.Route.extend({

  model: function (params) {
    return Ember.RSVP.hash({
      simulation: Ember.$.getJSON(`api/simulations/${params.simulation_id}`),
      plan: mockData()
    });
  },

  setupController: function (controller, models) {
    controller.setProperties(models);
  }

});

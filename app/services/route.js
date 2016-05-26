import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    return Ember.$.getJSON(`api/simulations/${params.service_id}/`)
  }
});

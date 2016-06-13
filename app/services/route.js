import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    return Ember.$.getJSON(`api/simulations/${params.service_id}/`)
  },

  // setupController: function (controller, model) {
  //   var entities = model.entities
  //   var outputs = model.outputs
  //   var services = _.remove(entities, function (entity) {
  //     return entity.attributes[0] === 'service'
  //   })
  //   var branches = _.remove(entities, function (entity) {
  //     return entity.attributes[0] === 'branch'
  //   })
  //   this.set('simulation', model)
  //   this.set('model', model)
  //   this.set('entities', entities)
  //   this.set('outputs', outputs)
  //   this.set('services', services)
  //   this.set('branches', branches)
  // },



});

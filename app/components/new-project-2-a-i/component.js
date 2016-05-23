import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal'

export default Ember.Component.extend({
  serviceModels: undefined,

  findServiceModels: function () {
    var simulation = this.get('simulation')
    var serviceModels = simTraverse.getServiceModelsFromSimulation({simulation : simulation})
    this.set('serviceModels', serviceModels)
  }.on('init'),

  actions: {
    next: function () {
      this.sendAction('nextChild')
    },
    removeThisLayer: function () {
      this.sendAction('toggleChildLayer')
    },
  }
});

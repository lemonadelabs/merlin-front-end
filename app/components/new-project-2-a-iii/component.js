import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal'

export default Ember.Component.extend({
  entitiesWithAttribute: undefined,

  init: function () {
    this._super()
    this.getEntitiesWithAttribute()
  },

  getEntitiesWithAttribute: function () {
    var selectedAttribute = this.get('selectedAttribute')
    var simulation = this.get('simulation')
    var entitiesWithAttribute = simTraverse.filterEntitiesByAttribute({
      attribute : selectedAttribute,
      entities : simulation.entities
    })
    this.set('entitiesWithAttribute', entitiesWithAttribute)
  }.on('selectedAttribute'),

  actions: {
    next: function () {
      this.sendAction('nextChild', this.get('layerType'))
    },
    previous: function () {
      this.sendAction('previousChild', this.get('layerType'))
    }

  },

});

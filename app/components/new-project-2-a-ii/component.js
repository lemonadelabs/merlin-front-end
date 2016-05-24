import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal'

export default Ember.Component.extend({
  attributes: undefined,

  init: function () {
    this._super()
    this.getAttributesForSelectedServiceModel()
  },

  getAttributesForSelectedServiceModel: function () {
    var selectedServiceModel = this.get('selectedServiceModel')
    var attributes = simTraverse.getChildAttributesFromServiceModel({
      simulation : this.get('simulation'),
      serviceModel: selectedServiceModel,
    })
    this.set('attributes', attributes)

  }.observes('selectedServiceModel'),

  actions: {
    next: function () {
      this.sendAction('nextChild', this.get('layerType'))
    },
    previous: function () {
      this.sendAction('previousChild', this.get('layerType'))
    }

  },

});

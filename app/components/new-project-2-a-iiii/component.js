import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal'

export default Ember.Component.extend({
  processPropertiesNew: undefined,

  init: function () {
    this._super()
    this.getProcessPropertiesForSelectedEntity()
  },

  getProcessPropertiesForSelectedEntity: function () {
    var selectedEntity = this.get('selectedEntity')
    var processProperties = simTraverse.getProcessPropertiesFromEntity({ entity : selectedEntity })
    this.set('processPropertiesNew', _.cloneDeep(processProperties) )
  }.observes('selectedEntity'),

  actions:{
    sendProcessProperties: function () {
      this.sendAction('childSequenceComplete', this.get('layerType'))
      this.sendAction('packageData', this.get('processPropertiesNew'), this.get('layerType'))

    },
    previous: function () {
      this.sendAction('previousChild', this.get('layerType'))
    }
  }

});

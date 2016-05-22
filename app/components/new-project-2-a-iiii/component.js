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
      this.sendAction('childSequenceComplete')
      this.sendAction('packageResourceData', this.get('processPropertiesNew'))


    },
    previous: function () {
      this.sendAction('previousChild')
    }
  }

});

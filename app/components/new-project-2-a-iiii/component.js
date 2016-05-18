import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal'

export default Ember.Component.extend({
  // processPropertiesForSelectedEntity: undefined,

  init: function () {
    this._super()
    this.getProcessPropertiesForSelectedEntity()
    var self = this
    setInterval(function () {
      console.log('selectedEntity' ,self.get('selectedEntity'))
      console.log('processProperties', self.get('processPropertyValues'))
    }, 1000)
  },

  getProcessPropertiesForSelectedEntity: function () {
    var selectedEntity = this.get('selectedEntity')
    var processProperties = simTraverse.getProcessPropertiesFromEntity({ entity : selectedEntity })
    this.set('processPropertyValues', processProperties)
  }.observes('selectedEntity'),

  actions:{
    complete: function () {
      this.sendAction('childSequenceComplete')
    },
    previous: function () {
      this.sendAction('previousChild')
    }
  }

});

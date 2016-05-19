import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal'

export default Ember.Component.extend({
  processPropertyValues: undefined,

  init: function () {
    this._super()
    this.getProcessPropertiesForSelectedEntity()
  },

  getProcessPropertiesForSelectedEntity: function () {
    var selectedEntity = this.get('selectedEntity')
    var processProperties = simTraverse.getProcessPropertiesFromEntity({ entity : selectedEntity })
    this.set('processPropertyValues', processProperties)
  }.observes('selectedEntity'),

  actions:{
    complete: function () {
      this.sendAction('childSequenceComplete', this.get('processPropertyValues'))
    },
    previous: function () {
      this.sendAction('previousChild')
    }
  }

});

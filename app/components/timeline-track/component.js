import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['timeline-track'],
  actions: {
    onNoDragClick(timelineObject) {
      var actionName = this.get('onNoDragClick')
      if(actionName){
        this.sendAction(actionName, timelineObject)
      }
    },

    onContextMenu(timelineObject) {
      var actionName = this.get('onContextMenu')
      if(actionName){
        this.sendAction(actionName, timelineObject)
      }
    }
  }
});

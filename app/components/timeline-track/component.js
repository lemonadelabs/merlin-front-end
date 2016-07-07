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
    onContextMenuAction(menuActionName, timelineObject) {
      var actionName = this.get('onContextMenuAction')
      if(actionName){
        this.sendAction(actionName, timelineObject, menuActionName)
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

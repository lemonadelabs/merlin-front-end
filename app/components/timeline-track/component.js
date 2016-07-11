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
    },
    hideSuggestion(timelineObject){
      let suggestions = this.get('project.suggestions');
      let suggestionIndex = _.findIndex(suggestions,['id', timelineObject.id * -1])
      suggestions.splice(suggestionIndex, 1);
      suggestions.arrayContentDidChange(suggestionIndex, 1, 0)
    }
  }
});

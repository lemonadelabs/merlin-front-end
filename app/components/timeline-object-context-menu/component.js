import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['timeline-object-context-menu'],
  
  actions:{
    passActionName:function(actionName){
      console.log(actionName);
      this.sendAction('handleContextMenuAction', actionName)
    }
  }
});

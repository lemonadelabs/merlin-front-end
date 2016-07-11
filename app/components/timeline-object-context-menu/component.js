import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['timeline-object-context-menu'],

  actions:{
    passActionName:function(actionName){
      this.sendAction('handleContextMenuAction', actionName)
    }
  }
});

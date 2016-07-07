import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    passActionName:function(actionName){
      console.log(actionName);
      this.sendAction('handleContextMenuAction', actionName)
    }
  }
});

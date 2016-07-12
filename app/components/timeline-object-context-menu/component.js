import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['timeline-object-context-menu'],
  showMenu:false,
  actions:{
    passActionName:function(actionName){
      this.sendAction('handleContextMenuAction', actionName)
    }
  },
  observeShowContextMenu:function(){
    console.log(this.get('showContextMenu'));
    if(this.get('showContextMenu')){
      this.set('showMenu',true);
    }
  }.observes('showContextMenu')
});

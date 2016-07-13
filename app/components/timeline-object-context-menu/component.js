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
    else{
      this.hideMenu();
    }
  }.observes('showContextMenu'),
  hideMenu(){
    let element = this.get('element');
    let menuElement = element.getElementsByClassName('timeline-object-context-menu-item-list')[0]
    menuElement.style.animationName = "fade-out";
    Ember.run.later(this, this.setShowMenuToFalse, 250);
  },
  setShowMenuToFalse(){
    this.set('showMenu', false)
  }
});

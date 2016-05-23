import Ember from 'ember';

export default Ember.Component.extend({
  showNewProjectWiz: false,
  actions:{
    newProject: function(){
      this.set('showNewProjectWiz', true);
    },
    hideNewProject: function(){
      this.set('showNewProjectWiz', false);
    }
  }
});

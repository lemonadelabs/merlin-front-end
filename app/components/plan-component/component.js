import Ember from 'ember';

export default Ember.Component.extend({
  showNewProjectWiz: false,

  reloadProjects: function () {
    var self = this

    Ember.$.getJSON('api/projects').then(function (returned) {
      var projects = self.get('projects')
      var amountProjects = projects.length
      var amountReturned = returned.length
      var diff = amountReturned - amountProjects
      var newProjects = returned.splice(amountProjects, diff)
      console.log('newProjects', newProjects)
      _.forEach(newProjects, function (newProject) {
        projects.push(newProject)
        self.projects.arrayContentDidChange(self.projects.length, 0, 1)
      })
      self.set('projects', projects)
    })
  },

  actions:{
    newProject: function(){
      this.set('showNewProjectWiz', true);
    },
    onFormSubmit: function(){
      this.set('showNewProjectWiz', false);
      this.reloadProjects()
    },
    hideNewProjectWizard: function () {
      if (this.get('showNewProjectWiz')) {
        this.set('showNewProjectWiz', false)
      }
    }
  }
});

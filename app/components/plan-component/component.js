import Ember from 'ember';
import * as convertTime from '../../common/convert-time'

export default Ember.Component.extend({
  showNewProjectWiz: false,
  reloadProjects: function () {
    var self = this

    Ember.$.getJSON('api/projects').then(function (returned) {
      var projects = returned
      // var projects = self.get('projects')
      // var amountProjects = projects.length
      // var amountReturned = returned.length
      // var diff = amountReturned - amountProjects
      // var newProjects = returned.splice(amountProjects, diff)

      self.convertTimeInProjects(projects)

      // console.log('newProjects', newProjects)
      // _.forEach(newProjects, function (newProject) {
      //   projects.push(newProject)
      //   self.projects.arrayContentDidChange(self.projects.length, 0, 1)
      // })
      self.set('projects', projects)
    })
  },

  convertTimeInProjects: function (projects) {
    _.forEach(projects, this.convertTimePhases.bind(this))
  },

  convertTimePhases: function (project) {
    _.forEach(project.phases, convertTime.convertTimesInObject)
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

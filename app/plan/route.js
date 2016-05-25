import Ember from 'ember';
import * as convertTime from '../common/convert-time-es6'
import mockData from './mock-data'

export default Ember.Route.extend({

  model: function (params) {
    return Ember.RSVP.hash({
      simulation: Ember.$.getJSON(`api/simulations/${params.simulation_id}`),
      plan: mockData(),
      projects: Ember.$.getJSON('api/projects')
    });
  },

  setupController: function (controller, models) {
    this.convertTimeInModels(models)
    controller.setProperties(models);
    var projects = this.get('projects')
  },

  convertTimeInModels: function (models) {
    var projects = models.projects
    _.forEach(projects, this.convertTimePhases.bind(this))
  },

  convertTimePhases: function (project) {
    _.forEach(project.phases, this.convertTimesInObject)
  },

  convertTimesInObject: function (object) {
    _.forEach(object, function (value, key) {
      object[key] = (key.indexOf('date') > -1) ? convertTime.toQuater(value) : value
    })
  },


});

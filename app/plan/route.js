import Ember from 'ember';
import * as convertTime from '../common/convert-time'

export default Ember.Route.extend({
  simulation: undefined,
  projects: undefined,
  simulationRun: undefined,

  model: function (params) {
    var simulationId = params.simulation_id

    return Ember.RSVP.hash({
      simulation: Ember.$.getJSON(`api/simulations/${simulationId}/`),
      projects: Ember.$.getJSON('api/projects/'),
      scenarios: Ember.$.getJSON('api/scenarios/'),
      simulationId: simulationId
    });
  },

  setupController: function (controller, models) {
    this.convertTimeInProjects(models.projects)
    controller.setProperties(models);
  },


  convertTimeInProjects: function (projects) {
    _.forEach(projects, this.convertTimePhases.bind(this))
  },

  convertTimePhases: function (project) {
    _.forEach(project.phases, convertTime.convertTimesInObject)
  },

});

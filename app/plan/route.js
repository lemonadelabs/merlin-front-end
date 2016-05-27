import Ember from 'ember';
import * as convertTime from '../common/convert-time-es6'
import * as projectsTraversal from '../common/projects-traversal'
import * as merlinUtils from '../common/merlin-utils'

export default Ember.Route.extend({
  simulation: undefined,
  projects: undefined,
  simulationRun: undefined,

  model: function (params) {
    var simulationId = params.simulation_id

    return Ember.RSVP.hash({
      simulation: Ember.$.getJSON(`api/simulations/${simulationId}/`),
      projects: Ember.$.getJSON('api/projects/'),
      simulationId: simulationId
    });
  },

  setupController: function (controller, models) {
    this.convertTimeInProjects(models.projects)
    this.runSimulation(models)
    controller.setProperties(models);
  },

  runSimulation: function(models) {
    var self = this
    var simulationId = models.simulationId
    var projects = models.projects
    var scenarioIds = projectsTraversal.getScenarioIds(projects)
    var url = merlinUtils.simulationRunUrl({
      scenarioIds : scenarioIds,
      simulationId : simulationId,
      timeframe : 48
    })
    var simRunReq = Ember.$.getJSON(url)
    simRunReq.then(function (simRun) {
      self.set('simulationRun', simRun)
    })
  },

  convertTimeInProjects: function (projects) {
    _.forEach(projects, this.convertTimePhases.bind(this))
  },

  convertTimePhases: function (project) {
    _.forEach(project.phases, convertTime.convertTimesInObject)
  },

});

import Ember from 'ember';
import * as convertTime from '../common/convert-time-es6'
import * as projectsTraversal from '../common/projects-traversal'
import * as merlinUtils from '../common/merlin-utils'

import mockData from './mock-data'

export default Ember.Route.extend({
  simulation: undefined,
  projects: undefined,
  simulationRun: undefined,

  plan: undefined, // delete later!!!


  model: function (params) {
    var simulationId = params.simulation_id
    this.getProjects(simulationId)
    return Ember.RSVP.hash({
      simulation: Ember.$.getJSON(`api/simulations/${simulationId}/`),
      plan: mockData(),
    });
  },

  setupController: function (controller, models) {
    this.convertTimeInModels(models)
    controller.setProperties(models);
  },

  getProjects: function (simulationId) {
    var self = this
    Ember.$.getJSON('api/projects/').then( function ( projects ) {
      self.set('projects', projects)
      self.runSimulation(simulationId)
    })
  },

  runSimulation: function(simulationId) {
    var self = this
    var projects = this.get('projects')
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

  convertTimeInModels: function (models) {
    var projects = models.projects
    _.forEach(projects, this.convertTimePhases.bind(this))
  },

  convertTimePhases: function (project) {
    _.forEach(project.phases, convertTime.convertTimesInObject)
  },

});

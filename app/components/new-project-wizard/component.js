import Ember from 'ember';
import postJSON from '../../common/post-json'
import * as convertTime from '../../common/convert-time'
import * as merlinUtils from '../../common/merlin-utils'

export default Ember.Component.extend({
  classNames: ['modal'],
  steps: ['new-project-1', 'new-project-2', 'new-project-3'],
  currentStep: undefined,
  newProjectData: undefined,
  validation: {
    newProject1: {
      validated: false,
      requiredFileds: false,
      canContinue: false,
      disableButton: true,
    }
  },
  modalTitle : undefined,

  init: function () {
    this._super()
    this.resetNewProjectData() // if we want the form to remember data when it has been closed and reopened again, move this function into the .then of the last post reqest, and set newProjectData to the object on line 12
    this.set('currentStep', this.get('steps')[0])
  },
  /**
  * resets the form data for new project wizard
  *
  * @method resetNewProjectData
  */
  resetNewProjectData: function () {
    var newProjectData = {
      is_ringfenced: false,
      achievability: 5,
      attractiveness: 5,
      phases: [],
      priority: 1,
      alignment: 5
    }
    this.set('newProjectData', newProjectData)
  },

  /**
  * saves scenarios to the backend
  *
  * @method persistScenarioForPhase
  * @param {Object} opts
  *   @param {Object} opts.phase
  * @return {Object} promise
  */
  persistScenarioForPhase: function (opts) {
    var phase = opts.phase
    var simulation = this.get('simulation')
    var newProjectData = this.get('newProjectData')

    var clicksBetween = convertTime.clicksBetween({
      a : simulation.start_date,
      b : phase.start_date
    })

    var scenarioPostData = {
      "name": `${newProjectData.name}, ${phase.name}`,
      "sim": "http://127.0.0.1:8000/api/simulations/" + simulation.id + '/',
      "start_offset": clicksBetween
    }
    return postJSON({
      data : scenarioPostData,
      url : "api/scenarios/"
    })
  },

  /**
  * creates actions for a modified resource
  *
  * @method makeActions
  * @param {Object} opts
  *   @param {Object} opts.resource
  * @return {Array} array of actions
  */
  makeActions: function (opts) {
    var self = this
    var resource = opts.resource
    var simulation = this.get('simulation')
    var actions = []

    // find the matching entity from the simulation
    // var entity = _.find( simulation.entities, function (e) { return e.id === resource.selectedEntity.id })
    // loop over each new process property
    _.forEach(resource.processProperties, function (newProcessProperty) {
      var action = self.makeAction({
        newProcessProperty : newProcessProperty,
        entityId : resource.selectedEntity.id,
      })
      if (action) {actions.push(action)}
    })
    return actions
  },

  /**
  * creates a sigular action for a process property
  *
  * @method makeActions
  * @param {Object} opts
  *   @param {Object} opts.newProcessProperty
  *   @param {Object} opts.entityId
  * @return {Object} action
  */
  makeAction: function (opts) {
    var newProcessProperty = opts.newProcessProperty
    var entityId = opts.entityId

    if (newProcessProperty.change) {
      var action = merlinUtils.createModifyProcessAction({
        newProcessProperty : newProcessProperty,
        entityId : entityId,
      })
      return action
    }
  },

  /**
  * creates mirrored/inverted actions for a set of actions, so to release the resource after the project phase
  *
  * @method invertActions
  * @param {Object} opts
  *   @param {Array} opts.actions
  * @return {Array} array of inverted actions
  */
  invertActions : function (opts) {
    var actions = opts.actions
    var invertedActions = []
    _.forEach(actions, function (action) {
      invertedActions.push( merlinUtils.createInvertedAction({action : action}) )
    })
    return invertedActions
  },

  /**
  * Creates start and end events for a projectphase
  *
  * @method createEvents
  * @param {Object} opts
  *   @param {Object} opts.scenario
  *   @param {Object} opts.phase
  * @return {Object} start and end event
  */
  createEvents: function (opts) {
    var self = this

    var scenario = opts.scenario
    var phase = opts.phase
    // create beginningEvent
    var startEvent = merlinUtils.newEventObject({
      scenarioId: scenario.id,
      time:1
    })

    // create endEvent
    var clicksBetween = convertTime.clicksBetween({
      a : phase.start_date,
      b : phase.end_date
    })

    var releaseTime = clicksBetween + 4 // to release at the end of the phase

    var endEvent = merlinUtils.newEventObject({
      scenarioId: scenario.id,
      time: releaseTime
    })

    _.forEach(phase.resources, function (resource) {
      var resourceActions = self.makeActions({
        resource : resource,
      })
      startEvent.actions = _.concat(startEvent.actions, resourceActions)
      var inverseActions = self.invertActions({
        actions : resourceActions
      })
      endEvent.actions = _.concat(endEvent.actions, inverseActions)
    })

    _.forEach(phase.impacts, function (impact) {
      var impactActions = self.makeActions({
        resource : impact,
      })
      endEvent.actions = _.concat(endEvent.actions, impactActions)
    })

    return {
      start: startEvent,
      end: endEvent
    }
  },

  sendFinishedAction: function () {
    if ( this.get('onFormSubmit') ) {
      this.sendAction('onFormSubmit')
    }
  },

  postProject: function (project) {
    return postJSON({
      data : project,
      url : `api/projects/`
    })
  },

  actions: {

    // catchProcessPropertyValues: function (values) {
    //   console.log('catchProcessPropertyValues', values)
    // },


    /**
    * handles the creation of a new `project` resource, and child resources `phase` and `event`
    * @method persistProject
    */
    persistProject: function () {

      var self = this
      var newProjectData = this.get('newProjectData')

      var newProjectJSON = {
        name: newProjectData.name,
        description: newProjectData.description || 'description',
        priority: newProjectData.priority,
        type: newProjectData.type, // may not be empty
        is_ringfenced: newProjectData.is_ringfenced,
        is_active: newProjectData.is_active,
        achievability: newProjectData.achievability,
        attractiveness: newProjectData.attractiveness,
        // dependencies: null, // may not be empty
        phases: []
      }


      var phases = newProjectData.phases
      // loop over phases as | phase |
      _.forEach(phases, function (phase) {
        // create scenario
        var scenarioPostRequest = self.persistScenarioForPhase({ phase : phase })
        scenarioPostRequest.then( function (scenario) {

          var newPhaseJSON = {
            "name": phase.name,
            "description": phase.description || 'description',
            "scenario": scenario.id,
            "investment_cost": Number(phase.investment_cost) || 0,
            "service_cost": Number(phase.service_cost) || 0,
            'capitalization' : Number(phase.capitalization) / 100 || 0,
            "start_date": convertTime.quarterToBackend({ time : phase.start_date }),
            "end_date": convertTime.quarterToBackend({
              time : phase.end_date,
              isEndDate : true
            }),
            "is_active": true
          }

          var events = self.createEvents({
            scenario : scenario,
            phase : phase
          })

          var startEventRequest = postJSON({
            data : events.start,
            url : `api/events/`
          })
          startEventRequest.then(function () {
            var endEventRequest = postJSON({
              data : events.end,
              url : `api/events/`
            })

            endEventRequest.then( function () {
              // add the phase to the new project data
              newProjectJSON.phases.push(newPhaseJSON)
              if (phases.length === newProjectJSON.phases.length ) {
                var projectsPost = self.postProject(newProjectJSON)
                projectsPost.then(function () {
                  self.sendFinishedAction()
                })
              }
            })
          })
        })
      })
    },

    next () {
      let steps = this.get('steps'),
      index = steps.indexOf(this.get('currentStep'));

      this.set('currentStep', steps[index + 1]);
    },

    back () {
      let steps = this.get('steps'),
      index = steps.indexOf(this.get('currentStep'));

      this.set('currentStep', steps.get(index - 1));
    },

    close () {
      if(this.get('hideNewProject')){
        this.sendAction('hideNewProject')
      }
    },
    setTitle (newTitle) {
      this.set('modalTitle', newTitle);
    },
  },

});

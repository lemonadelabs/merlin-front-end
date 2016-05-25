import Ember from 'ember';
import postJSON from '../../common/post-json'
import putJSON from '../../common/put-json'
import * as convertTime from '../../common/convert-time-es6'
import * as simTraverse from '../../common/simulation-traversal'
import * as merlinUtils from '../../common/merlin-utils'

export default Ember.Component.extend({
  classNames: ['modal'],
  steps: ['new-project-1', 'new-project-2', 'new-project-3'],
  currentStep: undefined,
  validation: {
    newProject1: {
      validated: false,
      requiredFileds: false,
      canContinue: false,
      disableButton: true,
    }
  },
  newProjectData: {
    is_ringfenced: false,
    achievability: 5,
    attractiveness: 5,
    phases: [],
    priority: 1,
    alignment: 5
  },
  modalTitle : undefined,

  init: function () {
    this._super()
    this.set('currentStep', this.get('steps')[0])
  },

  persistScenarioForPhase: function (opts) {
    var phase = opts.phase
    var simulation = this.get('simulation')
    var newProjectData = this.get('newProjectData')

    var scenarioPostData = {
      "name": `${newProjectData.name}, ${phase.name}`,
      "sim": "http://127.0.0.1:8000/api/simulations/" + simulation.id + '/',
      "start_offset": convertTime.clicksBetween({
        a : simulation.start_date,
        b : phase.start
      })
    }
    return postJSON({
      data : scenarioPostData,
      url : "api/scenarios/"
    })
  },

  makeActions: function (opts) {
    var self = this
    var resource = opts.resource
    var simulation = this.get('simulation')
    var actions = []

    // find the matching entity from the simulation
    var entity = _.find( simulation.entities, function (e) { return e.id === resource.selectedEntity.id })
    // loop over each new process property
    _.forEach(resource.processProperties, function (newProcessProperty) {
      var action = self.makeAction({
        newProcessProperty : newProcessProperty,
        entity : entity,
      })
      if (action) {actions.push(action)}
    })
    return actions
  },

  makeAction: function (opts) {
    var newProcessProperty = opts.newProcessProperty
    var entity = opts.entity

    if (newProcessProperty.change) {
      var action = merlinUtils.createModifyProcessAction({
        newProcessProperty : newProcessProperty,
        entityId : entity.id,
      })
      return action
    }
  },

  invertActions : function (opts) {
    var self = this
    var actions = opts.actions
    var invertedActions = []
    _.forEach(actions, function (action) {
      invertedActions.push( merlinUtils.createInvertedAction({action : action}) )
    })
    return invertedActions
  },

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
      a : phase.start,
      b : phase.end
    })

    var endEvent = merlinUtils.newEventObject({
      scenarioId: scenario.id,
      time: clicksBetween
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

    // console.log('startEvent', startEvent)
    // console.log('endEvent', endEvent)

    // return event
    return {
      start: startEvent,
      end: endEvent
    }
  },

  hideNewProjectButton: function () {
    if ( this.get('hideNewProject') ) {
      this.sendAction('hideNewProject')
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

    persistProject: function () {

      var self = this
      var simulation = this.get('simulation')
      var newProjectData = this.get('newProjectData')

      var newProjectJSON = {
        name: newProjectData.name,
        description: newProjectData.description,
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

          console.log(phase)
          var newPhaseJSON = {
            "name": phase.name,
            "description": phase.description,
            "scenario": scenario.id,
            "investment_cost": Number(phase.investment_cost),
            "service_cost": Number(phase.service_cost),
            "start_date": convertTime.quarterToBackend(phase.start),
            "end_date": convertTime.quarterToBackend(phase.end),
            "is_active": false
          }

          var events = self.createEvents({
            scenario : scenario,
            phase : phase
          })

          var endEventRequest = postJSON({
            data : events.end,
            url : `api/events/`
          })
          endEventRequest.then(function () {
            var startEventRequest = postJSON({
              data : events.start,
              url : `api/events/`
            })

            startEventRequest.then( function () {
              console.log('in startEvent then')
              // add the phase to the new project data
              newProjectJSON.phases.push(newPhaseJSON)
              if (phases.length === newProjectJSON.phases.length ) {
                self.postProject(newProjectJSON)
                self.hideNewProjectButton()
              }

            })

          })

        })
        // also need to crate a project in here!!!!!
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

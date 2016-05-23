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

    name: 'asdf',
    description: 'asdf',
    priority: 1,


  },

  modalTitle : undefined,

  init: function () {
    this._super()
    this.set('currentStep', this.get('steps')[1])
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
    // get processProperties for the entity from the sim
    var processProperties = simTraverse.getProcessPropertiesFromEntity({ entity : entity })
    // find the matching processProperty from the entity from the simulation
    var processProperty = _.find( processProperties, function (property) { return property.id === newProcessProperty.id })
    if (processProperty.property_value != newProcessProperty.property_value) {
      // create action that represents change
      var action = merlinUtils.modifyProcessAction({
        'entityId': entity.id,
        'processPropertyId': processProperty.id,
        'newValue': newProcessProperty.property_value,
        'oldValue': processProperty.property_value
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

  actions: {

    // catchProcessPropertyValues: function (values) {
    //   console.log('catchProcessPropertyValues', values)
    // },

    persistProject: function () {

      var self = this

      var simulation = this.get('simulation')
      var newProjectData = this.get('newProjectData')

      var phases = newProjectData.phases
      // loop over phases as | phase |
      _.forEach(phases, function (phase) {
        // create scenario

        var scenarioPostRequest = self.persistScenarioForPhase({ phase : phase })

        scenarioPostRequest.then( function (scenario) {
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

          // add events to scenario
          var endRequest = postJSON({
            data : endEvent,
            url : `api/events/`
          })
          endRequest.then(function () {
            var startRequest = postJSON({
              data : startEvent,
              url : `api/events/`
            })
            startRequest.then(function() {
              //if we the hideNewProject action is there hide it
              if(self.get('hideNewProject')){
                self.sendAction('hideNewProject')
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

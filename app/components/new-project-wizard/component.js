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

  actions: {

    // catchProcessPropertyValues: function (values) {
    //   console.log('catchProcessPropertyValues', values)
    // },

    persistProject: function () {

      var self = this

      var simulation = this.get('simulation')
      var newProjectData = this.get('newProjectData')

      console.log('persistProject', newProjectData)

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

          // loop over each `phase.resources` as | newValue |

          _.forEach(phase.resources, function (resource) {
            // find the matching entity from the simulation
            var entity = _.find( simulation.entities, function (e) { return e.id === resource.selectedEntity.id })
            // loop over each new process property
            _.forEach(resource.processProperties, function (newProcessProperty) {

              // get processProperties for the entity from the sim
              var processProperties = simTraverse.getProcessPropertiesFromEntity({ entity : entity })
              // find the matching processProperty from the entity from the simulation
              var processProperty = _.find( processProperties, function (property) { return property.id === newProcessProperty.id })
              if (processProperty.property_value != newProcessProperty.property_value) {
                // create action that represents change
                var startAction = merlinUtils.modifyProcessAction({
                  'entityId': entity.id,
                  'processPropertyId': processProperty.id,
                  'newValue': newProcessProperty.property_value,
                  'oldValue': processProperty.property_value
                })// add to beginningEvent
                startEvent.actions.push(startAction)

                var endAction = merlinUtils.modifyProcessAction({
                  'entityId': entity.id,
                  'processPropertyId': processProperty.id,
                  'newValue': newProcessProperty.property_value,
                  'oldValue': processProperty.property_value,
                  'revert':true
                })
                // add to endEvent
                endEvent.actions.push(endAction)
              }
            })
          })

          console.log('startEvent', startEvent)
          console.log('endEvent', endEvent)

          // add events to scenario
          postJSON({
            data : endEvent,
            url : `api/events/`
          }).then(function () {
            postJSON({
              data : startEvent,
              url : `api/events/`
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

    cancel () {
      // this.transitionToRoute('somewhere-else');
    },
    setTitle (newTitle) {
      this.set('modalTitle', newTitle);
    },
  },

});

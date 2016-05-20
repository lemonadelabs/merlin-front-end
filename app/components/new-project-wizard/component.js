import Ember from 'ember';
import * as convertTime from '../../common/convert-time-es6'

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
  },

  modalTitle : undefined,

  init: function () {
    this._super()
    this.set('currentStep', this.get('steps')[0])
  },

  testThings: function () {

  }.on('init'),

  actions: {

    catchProcessPropertyValues: function (values) {
      console.log('catchProcessPropertyValues', values)
    },

    persistProject: function () {

      var simulation = this.get('simulation')
      var newProjectData = this.get('newProjectData')

      console.log('persistProject', newProjectData)

      var phases = newProjectData.phases
      _.forEach(phases, function (phase) {

        var scenarioPostRequest = {
          "name": `${newProjectData.name}, ${phase.name}`,
          "sim": "http://127.0.0.1:8000/api/simulations/" + simulation.id + '/',
          "start_offset": convertTime.clicksBetween({
            a : simulation.start_date,
            b : phase.start
          }),
          'actions' : []
        }
        // make a new scenario with the process properties of each phase
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
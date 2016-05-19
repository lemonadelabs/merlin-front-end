import Ember from 'ember';

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
    this.set('currentStep', this.get('steps')[1])
  },

  actions: {

    persistProject: function (data) {
      // we need

      // new project data
      var newProjectData = this.get('newProjectData')
      var phases = newProjectData.phases
      console.log(phases)
      // phases
        // data for scenario
        // data for actions
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
    // setTitle (newTitle) {
    //   this.set('modalTitle', newTitle);
    // },
  },

});

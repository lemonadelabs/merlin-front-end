import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['modal'],
  steps: ['new-project-1', 'new-project-2', 'new-project-3'],
  currentStep: undefined,
  newProjectData: {
    is_ringfenced: false
  },
  modalTitle : undefined,
  init: function () {
    this._super()
    this.set('currentStep', this.get('steps')[0])
  },

  actions: {
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
    finish () {
      // this.transitionToRoute('wizard-finished');
    }
  },

});

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
    }
  },
  phases: [],
  newProjectData: {
    is_ringfenced: false,
    achievability: 5,
    attractiveness: 5,
    phases: [
      // {
      //   "name": "development2",
      //   "description": "Creating the foo",
      //   "project": 4,
      //   "cost": 5000000,
      //   start: {
      //     year : 2016,
      //     value : 2,
      //   },
      //   end : {
      //     year : 2016,
      //     value : 4
      //   },
      //   // "start": "2016-04-01",
      //   // "end": "2016-08-01"
      // },
    ],
  },
  modalTitle : undefined,
  init: function () {
    this._super()
    this.set('currentStep', this.get('steps')[1])

  },

  // addPhases: function () {
  //   var data = this.get('newProjectData')
  //   var phase = {
  //     "name": "development2",
  //     "description": "Creating the foo",
  //     "project": 4,
  //     "cost": 5000000,
  //     start: {
  //       year : 2016,
  //       value : 2,
  //     },
  //     end : {
  //       year : 2016,
  //       value : 4
  //     },
  //     // "start": "2016-04-01",
  //     // "end": "2016-08-01"
  //   }
  //   data.phases.push(phase)
  //   this.set('newProjectData', data)

  //   this.get('phases').push(phase)
  //   this.phases.arrayContentDidChange(data.phases.length, 0, 1)

  //   console.log(this.get('phases'))
  // },

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

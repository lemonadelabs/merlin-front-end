import Ember from 'ember';

export default Ember.Component.extend({

  showChildLayer: false,
  currentStep: undefined,
  steps: ['new-project-2-a-i', 'new-project-2-a-ii', 'new-project-2-a-iii', 'new-project-2-a-iiii'],

  selectedServiceModel: undefined, // updated in child component 2-a-i
  selectedAttribute: undefined, // updated in child component 2-a-ii
  selectedEntity: undefined, // updated in child component 2-a-iii
  processPropertyValues: undefined, // passed down in `childSequenceComplete` action

  init: function () {
    this._super()
    this.set('currentStep', this.get('steps')[0])
  },

  resetNewPhaseForm: function () {
    this.set('phaseName', undefined)
    this.set('description', undefined)
    this.set('capital', undefined)
    this.set('operational', undefined)
  },

  toggleBool: function (variablepath){
    let toggleBool = this.get(variablepath) ? false : true;
    this.set(variablepath, toggleBool);
  },

  processNewResource: function () {
    var selectedServiceModel = this.get('selectedServiceModel')
    var selectedAttribute = this.get('selectedAttribute')
    var selectedEntity = this.get('selectedEntity')
    var processPropertyValues = this.get('processPropertyValues')

    console.log('selectedServiceModel: ', selectedServiceModel)
    console.log('selectedAttribute: ', selectedAttribute)
    console.log('selectedEntity: ', selectedEntity)
    console.log('processPropertyValues: ', processPropertyValues)

  },
  actions: {

    removeThisLayer: function () {
      this.sendAction('toggleChildLayer')
    },
    addNewPhase: function () {
      console.log('addNewPhase')

      var phases = this.get('phases')
      var lastPhase = phases[ phases.length - 1 ]

      var newPhase = {
        "name": this.get('phaseName'),
        "description": this.get('description'),
        "cost": Number( this.get('capital') ) + Number( this.get('operational') ),
      }

      if (lastPhase) {
        newPhase.start = incrementTimeBy1({ time : lastPhase.end })
        newPhase.end = incrementTimeBy3({ time : newPhase.start })
      } else {
        newPhase.start = {
          year : 2016,
          value : 1
        },
        newPhase.end = {
          year : 2016,
          value : 4
        }
      }

      //add in a scenario




      phases.push(newPhase)
      this.set('phases', phases)
      this.phases.arrayContentDidChange(this.phases.length, 0, 1)

      this.resetNewPhaseForm()
      this.sendAction('toggleChildLayer')


    },
    updatePhase: function () {
      //this is needed for the timeline-track component, we might want to do something here anyway
    },

    toggleChildLayer: function () {
      this.toggleBool('showChildLayer');
    },

    nextChild: function () {
      let steps = this.get('steps'),
      index = steps.indexOf(this.get('currentStep'));

      this.set('currentStep', steps[index + 1]);
    },

    previousChild: function () {
      let steps = this.get('steps'),
      index = steps.indexOf(this.get('currentStep'));

      this.set('currentStep', steps.get(index - 1));
    },
    childSequenceComplete: function (processPropertyValues) {
      this.set('processPropertyValues', processPropertyValues)
      console.log('child sequence complete')
      this.toggleBool('showChildLayer');
      this.set('currentStep', this.get('steps')[0])
      this.processNewResource()
    },

  }
});

function incrementTimeBy1 (opts) {
  var maxValue = opts.maxValue || 4
  var time = _.cloneDeep(opts.time)
  if (time.value === maxValue) {
    time.year +=1
    time.value = 1
  } else {
    time.value += 1
  }
  return time
}

function incrementTimeBy3(opts) {
  var time = opts.time
  var one = incrementTimeBy1({ time : time })
  var two = incrementTimeBy1({ time : one })
  var three = incrementTimeBy1({ time : two })
  return three
}
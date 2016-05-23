import Ember from 'ember';

export default Ember.Component.extend({

  showChildLayer: false,
  currentStep: undefined,
  resourcesHoldingPen: [],
  steps: ['new-project-2-a-i', 'new-project-2-a-ii', 'new-project-2-a-iii', 'new-project-2-a-iiii'],

  selectedServiceModel: undefined,
  selectedAttribute: undefined,
  selectedEntity: undefined,

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

  // processNewResource: function () {
  // },
  actions: {

    removeThisLayer: function () {
      this.sendAction('toggleChildLayer')
    },
    addNewPhase: function () {

      var resourcePen = this.get('resourcesHoldingPen')
      var resources = _.cloneDeep( resourcePen )
      this.set('resourcesHoldingPen', [])



      var phases = this.get('phases')
      var lastPhase = phases[ phases.length - 1 ]

      var newPhase = {
        "name": this.get('phaseName'),
        "description": this.get('description'),
        "cost": Number( this.get('capital') ) + Number( this.get('operational') ),
        'resources' : resources,
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

      phases.push(newPhase)
      this.set('phases', phases)
      this.phases.arrayContentDidChange(this.phases.length, 0, 1)


      this.resetNewPhaseForm()
      this.sendAction('toggleChildLayer')
    },

    packageResourceData: function (processProperties) {
      var resourcePen =  this.get('resourcesHoldingPen')

      var selectedServiceModel = _.cloneDeep( this.get('selectedServiceModel') )
      var selectedAttribute = _.cloneDeep( this.get('selectedAttribute') )
      var selectedEntity = _.cloneDeep( this.get('selectedEntity') )

      var resourceInfo = {
        processProperties : processProperties,
        selectedServiceModel : selectedServiceModel,
        selectedAttribute : selectedAttribute,
        selectedEntity : selectedEntity
      }

      resourcePen.push(resourceInfo)
      this.set('resourcesHoldingPen', resourcePen)

      this.set('selectedServiceModel', undefined)
      this.set('selectedAttribute', undefined)
      this.set('selectedEntity', undefined)


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

    childSequenceComplete: function () {
      this.toggleBool('showChildLayer');
      this.set('currentStep', this.get('steps')[0])
    },
  }
});

function incrementTimeBy1 (opts) { // move this into convert time lib
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

function incrementTimeBy3(opts) {  // move this into convert time lib
  var time = opts.time
  var one = incrementTimeBy1({ time : time })
  var two = incrementTimeBy1({ time : one })
  var three = incrementTimeBy1({ time : two })
  return three
}
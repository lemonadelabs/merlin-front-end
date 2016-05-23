import Ember from 'ember';

export default Ember.Component.extend({

  // showChildLayer: false,
  showResourcesLayer: false,
  showImpactsLayer: false,

  // currentStep: undefined,
  currentStepResources: undefined,
  currentStepImpacts: undefined,

  resourcesHoldingPenResources: [],
  resourcesHoldingPenImpacts: [],

  steps: ['new-project-2-a-i', 'new-project-2-a-ii', 'new-project-2-a-iii', 'new-project-2-a-iiii'],

  selectedServiceModelResources: undefined,
  selectedAttributeResources: undefined,
  selectedEntityResources: undefined,

  selectedServiceModelImpacts: undefined,
  selectedAttributeImpacts: undefined,
  selectedEntityImpacts: undefined,

  // setLayertypeBool: function () {
  //   console.log('showResourcesLayer', this.get('showResourcesLayer'))
  //   console.log('showImpactsLayer', this.get('showImpactsLayer'))
  // }.observes('showResourcesLayer', 'showImpactsLayer'),

  init: function () {
    this._super()
    this.set('currentStepResources', this.get('steps')[0])
    this.set('currentStepImpacts', this.get('steps')[0])
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

      var resourcePen = this.get('resourcesHoldingPenResources')
      var impactPen = this.get('resourcesHoldingPenImpacts')

      var resources = _.cloneDeep( resourcePen )
      var impacts = _.cloneDeep( impactPen )

      this.set('resourcesHoldingPenResources', [])
      this.set('resourcesHoldingPenImpacts', [])



      var phases = this.get('phases')
      var lastPhase = phases[ phases.length - 1 ]

      var newPhase = {
        "name": this.get('phaseName'),
        "description": this.get('description'),
        "cost": Number( this.get('capital') ) + Number( this.get('operational') ),
        'resources' : resources,
        'impacts' : impacts,
      }

      console.log(newPhase)

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

    packageChildData: function (processProperties, layerType) {
      var resourcePen =  this.get(`resourcesHoldingPen${layerType}`)

      var selectedServiceModel = _.cloneDeep( this.get(`selectedServiceModel${layerType}`) )
      var selectedAttribute = _.cloneDeep( this.get(`selectedAttribute${layerType}`) )
      var selectedEntity = _.cloneDeep( this.get(`selectedEntity${layerType}`) )

      var resourceInfo = {
        processProperties : processProperties,
        selectedServiceModel : selectedServiceModel,
        selectedAttribute : selectedAttribute,
        selectedEntity : selectedEntity
      }

      resourcePen.push(resourceInfo)
      this.set(`resourcesHoldingPen${layerType}`, resourcePen)

      this.set(`selectedServiceModel${layerType}`, undefined)
      this.set(`selectedAttribute${layerType}`, undefined)
      this.set(`selectedEntity${layerType}`, undefined)


    },

    // updatePhase: function () {
    //   //this is needed for the timeline-track component, we might want to do something here anyway
    // },

    toggleChildLayer: function (layerType) {
      this.toggleBool(`show${layerType}Layer`);
    },
    toggleResourcesLayer: function () {
      this.toggleBool('showResourcesLayer');
    },
    toggleImpactsLayer: function () {
      this.toggleBool('showImpactsLayer');
    },

    nextChild: function (layerType) {
      let steps = this.get('steps'),
      index = steps.indexOf(this.get(`currentStep${layerType}`));
      this.set(`currentStep${layerType}`, steps[index + 1]);
    },
    previousChild: function (layerType) {
      let steps = this.get('steps'),
      index = steps.indexOf(this.get(`currentStep${layerType}`));
      this.set(`currentStep${layerType}`, steps.get(index - 1));
    },
    childSequenceComplete: function (layerType) {
      this.toggleBool(`show${layerType}Layer`)
      this.set(`currentStep${layerType}`, this.get('steps')[0])
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
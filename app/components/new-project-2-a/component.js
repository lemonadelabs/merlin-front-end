import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal'
import * as convertTime from '../../common/convert-time'

export default Ember.Component.extend({

  errors: {},

  showResourcesLayer: false,
  showImpactsLayer: false,

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

  init: function () {
    this._super()
    this.set('currentStepResources', this.get('steps')[0])
    this.set('currentStepImpacts', this.get('steps')[0])
    if ( this.get('editPhase') ) { this.populateFormWithPhase() }
  },

  validateCapitalization: function () {
    if ( Number( this.get('capitalization') ) <= 100 ) {
      this.set('errors.capitalization', undefined)
    } else {
      this.set('errors.capitalization', 'must be between 0 and 100')
    }

  }.observes('capitalization'),

  populateFormWithPhase: function () {
    var phaseToEdit = this.get('phases')[this.get('editPhase.index')]

    this.set('phaseName', phaseToEdit.name)
    this.set('description', phaseToEdit.description)
    this.set('capital', phaseToEdit.investment_cost)
    this.set('operational', phaseToEdit.service_cost)
    this.set('capitalization', phaseToEdit.capitalization)
    this.set('resourcesHoldingPenResources', _.cloneDeep( phaseToEdit.resources ) )
    this.set('resourcesHoldingPenImpacts', _.cloneDeep(phaseToEdit.impacts) )

  },

  resetNewPhaseForm: function () {
    this.set('phaseName', undefined)
    this.set('description', undefined)
    this.set('capital', undefined)
    this.set('operational', undefined)
    this.set('capitalization', undefined)
  },

  toggleBool: function (variablepath){
    let toggleBool = this.get(variablepath) ? false : true;
    this.set(variablepath, toggleBool);
  },

  addChangeAttributeToProcessProperties: function (opts) {
    var self = this
    var newProcessProperties = opts.newProcessProperties
    var entity = opts.entity

    _.forEach(newProcessProperties, function (newProcessProperty) {
      self.addChangeAttributeToProcessProperty({
        entity : entity,
        newProcessProperty : newProcessProperty
      })
    })
  },

  addChangeAttributeToProcessProperty: function (opts) {
    var newProcessProperty = opts.newProcessProperty
    var entity = opts.entity
    // get processProperties for the entity from the sim
    var processProperties = simTraverse.getProcessPropertiesFromEntity({ entity : entity })
    // find the matching processProperty from the entity from the simulation
    var processProperty = _.find( processProperties, function (property) { return property.id === newProcessProperty.id })
    var change = newProcessProperty.property_value - processProperty.property_value
    newProcessProperty.change = change
    if (change > 0.0) { newProcessProperty.sign = '+' }
  },

  actions: {

    removeThisLayer: function () {
      this.set('editPhase', undefined)
      this.sendAction('toggleChildLayer')
    },
    addNewPhase: function () {

      var resourcePen = this.get('resourcesHoldingPenResources')
      var impactPen = this.get('resourcesHoldingPenImpacts')

      var resources = _.cloneDeep( resourcePen )
      var impacts = _.cloneDeep( impactPen )

      resourcePen.length = 0
      impactPen.length = 0

      this.resourcesHoldingPenResources.arrayContentDidChange(0, resources.length, 0)
      this.resourcesHoldingPenImpacts.arrayContentDidChange(0, impacts.length, 0)

      var newPhase = {
        "name": this.get('phaseName'),
        "description": this.get('description'),
        "investment_cost" : this.get('capital'),
        "service_cost" : this.get('operational'),
        'capitalization' : this.get('capitalization'),
        'resources' : resources,
        'impacts' : impacts,
      }

      var phases = this.get('phases')

      if ( this.get('editPhase') ) {
        var editPhaseIdx = this.get('editPhase.index')
        var oldPhase = phases[ editPhaseIdx ]
        newPhase.start_date = oldPhase.start_date
        newPhase.end_date = oldPhase.end_date
        phases[ editPhaseIdx ] = newPhase
        this.set('phases', phases)
        this.phases.arrayContentDidChange(editPhaseIdx, 1, 1)
        this.set('editPhase', undefined)
      } else {
        var lastPhase = phases[ phases.length - 1 ]
        if (lastPhase) {
          newPhase.start_date = convertTime.incrementTimeBy1({ time : lastPhase.end_date })
          newPhase.end_date = convertTime.incrementTimeBy3({ time : newPhase.start_date })
        } else {
          newPhase.start_date = convertTime.toQuater(this.get('simulation').start_date)
          newPhase.end_date = convertTime.incrementTimeBy3({ time : newPhase.start_date })
        }

        phases.push(newPhase)
        this.set('phases', phases)
        this.phases.arrayContentDidChange(this.phases.length, 0, 1)
      }

      this.resetNewPhaseForm()
      this.sendAction('toggleChildLayer')
    },

    packageChildData: function (processProperties, layerType) {
      var resourcePen =  this.get(`resourcesHoldingPen${layerType}`)

      var selectedServiceModel = _.cloneDeep( this.get(`selectedServiceModel${layerType}`) )
      var selectedAttribute = _.cloneDeep( this.get(`selectedAttribute${layerType}`) )
      var selectedEntity = _.cloneDeep( this.get(`selectedEntity${layerType}`) )

      this.addChangeAttributeToProcessProperties({
        newProcessProperties : processProperties,
        entity : selectedEntity
      })

      var resourceInfo = {
        processProperties : processProperties,
        selectedServiceModel : selectedServiceModel,
        selectedAttribute : selectedAttribute,
        selectedEntity : selectedEntity
      }

      resourcePen.push(resourceInfo)
      this.set(`resourcesHoldingPen${layerType}`, resourcePen)
      this[`resourcesHoldingPen${layerType}`].arrayContentDidChange(resourcePen.length, 0, 1)

      this.set(`selectedServiceModel${layerType}`, undefined)
      this.set(`selectedAttribute${layerType}`, undefined)
      this.set(`selectedEntity${layerType}`, undefined)


    },

    removeImpactResource: function (properties, i) {
      delete properties[i].change
      delete properties[i].sign
      properties.arrayContentDidChange(i,1,1)
    },

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


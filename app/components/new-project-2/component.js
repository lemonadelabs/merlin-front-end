import Ember from 'ember';
// import * as simTraverse from '../../common/simulation-traversal'

export default Ember.Component.extend({
  timelineGridObjects: undefined,
  selectedServiceModel: undefined,
  showChildLayer: false,
  editPhase: undefined,

  checkForErrors: function () {
    var validated = true
    _.forEach(this.get('errors'), function ( error ) {
      if (error) {
        validated = false
        return
      }
    })
    this.set('validated', validated)
  }.observes('errors.priority','errors.name'), // list all error properties

  checkForRequiredFieleds: function () {
    if (this.get('newProjectData.name') && this.get('newProjectData.priority') ) {
      this.set('requiredFileds', true)
    } else {
      this.set('requiredFileds', false)
    }
  }.observes('newProjectData.name', 'newProjectData.priority' ), // list all required fields

  updateCanContinue: function () {
    if (this.get('requiredFileds') && this.get('validated') ) {
      this.set( 'canContinue', true )
    } else {
      this.set( 'canContinue', false )
    }
    console.log('can continue', this.get('canContinue'))
  }.observes('requiredFileds', 'validated'),


  timespan:{
    start:{
      year:2017
    },
    end:{
      year:2020
    },
    units:'quarters'
  },
  showNewModelModification:false,
  willInsertElement(){
    this.sendAction('setTitle', 'Add Investment Project - Add Phases')
  },
  toggleBool(variablepath){
    let toggleBool = this.get(variablepath) ? false : true;
    this.set(variablepath, toggleBool);
  },


  actions: {

    /**
    * opens the phase edit layer
    * @method onNoDragClick
    */
    onNoDragClick: function (timelineObject) {
      if ( this.get('editPhase') === undefined && this.get('showChildLayer') === true) { return }

      if (this.get('editPhase') === undefined) {
        var phases = this.get('newProjectData.phases')

        var phaseIndex
        _.forEach(phases, function (p, i) {
          if ( p.name === timelineObject.name &&
          _.isEqual(p.start_date, timelineObject.start) &&
          _.isEqual(p.end_date, timelineObject.end) &&
          p.investment_cost === timelineObject.capex &&
          p.service_cost === timelineObject.opex ) { phaseIndex = i }
          // 'descriptiodn', p.description, timelineObject.description
        })
        this.set('editPhase', { index : phaseIndex } )
        this.set('showChildLayer', true)
      } else {
        this.set('editPhase', undefined)
        this.set('showChildLayer', false)
      }
    },
    toggleChildLayer () {
      this.toggleBool('showChildLayer');
    },
    next () {
      this.set('submitted', true);
      this.sendAction('next');
    },
    back () {
      this.sendAction('back');
    },
    cancel () {
      this.sendAction('cancel');
    },
    addResources () {
      this.toggleBool('showNewModelModification');
    },
    addImpacts () {
      this.toggleBool('showNewModelModification');
    },
    cancelResources () {
      this.toggleBool('showNewModelModification');
    }
  }
});

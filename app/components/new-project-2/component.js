import Ember from 'ember';
// import * as simTraverse from '../../common/simulation-traversal'

export default Ember.Component.extend({
  // phaseName: undefined,
  // capital: undefined,
  // operational: undefined,
  // description: undefined,
  timelineGridObjects: undefined,
  selectedServiceModel: undefined,
  showChildLayer: false,
  editPhase: undefined,

  // newPhases: [] // new phaes is passed to the clild layer
  // should



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
      year:2016
    },
    end:{
      year:2019
    },
    units:'quarters'
  },
  showNewModelModification:false,
  didInsertElement(){
    this.sendAction('setTitle', 'Add Investment Project - Add Phases')
  },
  toggleBool(variablepath){
    let toggleBool = this.get(variablepath) ? false : true;
    this.set(variablepath, toggleBool);
  },


  actions: {

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


    // editPhase () {
    //   console.log('editPhase')
    // },
    toggleChildLayer () {
      this.toggleBool('showChildLayer');
    },
    updatePhase () {
      //this is needed for the timeline-track component, we might want to do something here anyway
    },
    next () {
      this.set('submitted', true);
      // do things regarding data, like validation
      this.sendAction('next');
    },
    back () {
      // this.set('submitted', true);
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

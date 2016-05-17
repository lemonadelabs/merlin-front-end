import Ember from 'ember';

export default Ember.Component.extend({
  phaseName: undefined,
  capital: undefined,
  operational: undefined,
  description: undefined,
  phases: [],
  // phasesArray: [],


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

  resetNewPhaseForm: function () {
    this.set('phaseName', undefined)
    this.set('description', undefined)
    this.set('capital', undefined)
    this.set('operational', undefined)
  },

  timespan:{
    start:{
      year:2016
    },
    end:{
      year:2019
    },
    units:'quarters'
  },
  showNewPhase:false,
  showNewModelModification:false,
  didInsertElement(){
    this.sendAction('setTitle', 'Add Investment Project - Add Phases')
  },
  toggleBool(variablepath){
    let toggleBool = this.get(variablepath) ? false : true;
    this.set(variablepath, toggleBool);
  },
  actions: {
    toggleNewPhase () {
      this.toggleBool('showNewPhase');
    },
    toggleNewModelModification () {
      this.toggleBool('showNewModelModification');
    },
    addNewPhase () {
      var phase = {
        "name": this.get('phaseName'),
        "description": this.get('description'),
        "cost": Number( this.get('capital') ) + Number( this.get('operational') ),
        start: {
          year : 2016,
          value : 1,
        },
        end : {
          year : 2019,
          value : 4
        }
      }
      this.get('phases').push(phase)
      this.phases.arrayContentDidChange(this.phases.length, 0, 1)
      this.resetNewPhaseForm()
      this.toggleBool('showNewPhase');
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

    },
    addImpacts () {

    }
  }
});

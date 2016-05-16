import Ember from 'ember';

export default Ember.Component.extend({
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
    addNewPhase () {
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
      this.toggleBool('showNewModelModification');
    },
    addImpacts () {
      this.toggleBool('showNewModelModification');
    }
  }
});

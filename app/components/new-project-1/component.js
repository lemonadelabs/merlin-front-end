import Ember from 'ember';

export default Ember.Component.extend({

  errors: {},
  // validated: false,
  // requiredFileds: false,
  // canContinue: false,

  didInsertElement(){
    this.sendAction('setTitle', 'Add Investment Project - Project Info')
  },

  validateName: function () {
    if ( this.get('newProjectData.name').length < 1 ) {
      this.set('errors.name', 'Name must not be blank')
    } else {
      this.set('errors.name', '')
    }
    console.log('validateName')
  }.observes('newProjectData.name'),

  validatePriority: function () {
    if ( this.get('newProjectData.priority').length < 1 ) {
      this.set('errors.priority', 'priority must not be blank')
    } else {
      var errors = this.get('errors')
      this.set('errors.priority', undefined)
    }
  }.observes('newProjectData.priority'),

  checkForErrors: function () {
    var validated = true
    _.forEach(this.get('errors'), function ( error ) {
      if (error) {
        validated = false
        return
      }
    })
    this.set('validation.validated', validated)
  }.observes('errors.priority','errors.name'), // list all error properties

  checkForRequiredFieleds: function () {
    if (this.get('newProjectData.name') && this.get('newProjectData.priority') ) {
      this.set('validation.requiredFileds', true)
    } else {
      this.set('validation.requiredFileds', false)
    }
  }.observes('newProjectData.name', 'newProjectData.priority' ), // list all required fields

  updateCanContinue: function () {
    if (this.get('validation.requiredFileds') && this.get('validation.validated') ) {
      this.set( 'validation.disableButton', false )
    } else {
      this.set( 'validation.disableButton', true )
    }
  }.observes('validation.requiredFileds', 'validation.validated'),


  actions: {
    next () {
      this.set('submitted', true);
      this.sendAction('next');
    },

    cancel () {
      this.sendAction('cancel');
    },
  }

});

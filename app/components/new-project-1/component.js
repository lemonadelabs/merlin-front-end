import Ember from 'ember';

export default Ember.Component.extend({

  errors: {},
  validated: false,
  requiredFileds: false,
  canContinue: false,

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
    this.set('validated', validated)
  }.observes('errors.priority','errors.name'), // list all potential error

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

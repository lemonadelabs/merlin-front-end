import Ember from 'ember';

export default Ember.Component.extend({

  errors: {},

  didInsertElement(){
    this.sendAction('setTitle', 'Add Investment Project - Project Info')
  },

  validateName: function () {
    var name = this.get('name')

    if ( name.length > 0 ) {
      this.set('newProjectData.name', name)
      this.set('errors.name', undefined)
    } else {
      this.set('newProjectData.name', undefined)
      this.set('errors.name', 'Name must not be blank')
    }
  }.observes('name'),

  actions: {
    next () {
      this.set('submitted', true);
      // do things regarding data, like validation
      this.sendAction('next');
    },

    cancel () {
      this.sendAction('cancel');
    },

  }

});

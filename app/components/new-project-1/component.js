import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement(){
    this.sendAction('setTitle', 'Add Investment Project - Project Info')
  },
  actions: {
    next () {
      this.set('submitted', true);
      // do things regarding data, like validation
      this.sendAction('next');
    },

    cancel () {
      this.sendAction('cancel');
    }
  }

});

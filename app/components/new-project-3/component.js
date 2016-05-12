import Ember from 'ember';

export default Ember.Component.extend({
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

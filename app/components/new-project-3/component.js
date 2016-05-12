import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement(){
    this.sendAction('setTitle', 'Add Investment Project - Dependancies')
  },
  actions: {
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
    }
  }
});

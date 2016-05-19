import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement(){
    this.sendAction('setTitle', 'Add Investment Project - Dependancies')
  },
  actions: {
    back: function () {
      this.sendAction('back');
    },
    persistProject: function () {
      this.sendAction('persistProject')
    },
  }
});

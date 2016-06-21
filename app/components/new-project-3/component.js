import Ember from 'ember';

export default Ember.Component.extend({
  willInsertElement(){
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

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
      console.log('persistProject, 3')
      this.sendAction('persistProject')
    },
  }
});

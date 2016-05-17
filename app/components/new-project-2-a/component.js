import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    removeThisLayer: function () {
      this.sendAction('toggleChildLayer')
    }
  }
});

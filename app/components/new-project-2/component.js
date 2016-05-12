import Ember from 'ember';

export default Ember.Component.extend({
  timespan:{
    start:{
      year:2016
    },
    end:{
      year:2019
    },
    units:'quarters'
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

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
  showNewPhase:false,
  showNewModelModification:false,
  didInsertElement(){
    this.sendAction('setTitle', 'Add Investment Project - Add Phases')
  },
  toggleBool(variablepath){
    let toggleBool = this.get(variablepath) ? false : true;
    this.set(variablepath, toggleBool);
  },
  actions: {
    toggleNewPhase () {
      this.toggleBool('showNewPhase');
    },
    toggleNewModelModification () {
      this.toggleBool('showNewModelModification');
    },
    addNewPhase () {
      this.toggleBool('showNewPhase');
    },
    updatePhase () {
      //this is needed for the timeline-track component, we might want to do something here anyway
    },
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

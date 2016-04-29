import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['time-input-container'],
  months: ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'],
  actions:{
    changeMonth: function(month){
      let months = this.get('months');
      let index = _.findIndex(months, function(o) {/*jshint eqeqeq: false*/ return o == month; });
      this.set('month', index+1);
    }
  }
});

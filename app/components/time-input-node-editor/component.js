import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['time-input-container'],
  months: [
    {
      name:'Jul',
      selected:true
    },
    {
      name:'Aug',
      selected:false
    },
    {
      name:'Sep',
      selected:false
    },
    {
      name:'Oct',
      selected:false
    },
    {
      name:'Nov',
      selected:false
    },
    {
      name:'Dec',
      selected:false
    },
    {
      name:'Jan',
      selected:false
    },
    {
      name:'Feb',
      selected:false
    },
    {
      name:'Mar',
      selected:false
    },
    {
      name:'Apr',
      selected:false
    },
    {
      name:'May',
      selected:false
    },
    {
      name:'Jun',
      selected:false
    }],
  actions:{
    changeMonth: function(month){
      let self = this;
      let months = this.get('months');
      let index = _.findIndex(months, function(o) {/*jshint eqeqeq: false*/ return o == month; });

      _.forEach(months,function(month, i){
        console.log(i,index);
        if(i === index){
          self.set(`months.${i}.selected`,true);
        }
        else{
          self.set(`months.${i}.selected`,false);
        }
      })

      this.set('month', index+1);
    }
  }
});

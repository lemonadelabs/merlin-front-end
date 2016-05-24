import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['time-input-container'],
  selectedYear: "2016/17",
  yearOffset:0,
  years: [
    {label:"2016 / 17", offset:0},
    {label:"2017 / 18", offset:12},
    {label:"2018 / 19", offset:24},
    {label:"2020 /21", offset:36}
  ],
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
    changeYear:function(label, offset){
      this.set('changeYear',false);
      this.set('yearOffset',offset)
      this.set('selectedYear',label)
      let month = this.get('month');
      let months = this.get('months');
      let index = _.findIndex(months, function(o) {/*jshint eqeqeq: false*/ return o == month; });
      this.set('month', offset+(index+1));
    },
    selectNewYear:function(){
      this.set('changeYear',true);
    },
    changeMonth: function(month){
      this.set('changeYear',false);
      let self = this;
      let months = this.get('months');
      let yearOffset = this.get('yearOffset');
      let index = _.findIndex(months, function(o) {/*jshint eqeqeq: false*/ return o == month; });

      _.forEach(months,function(month, i){
        if(i === index){
          self.set(`months.${i}.selected`,true);
        }
        else{
          self.set(`months.${i}.selected`,false);
        }
      })

      this.set('month', yearOffset+(index+1));
    }
  }
});

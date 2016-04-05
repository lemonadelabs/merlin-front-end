import Ember from 'ember';

export default Ember.Component.extend({
  years:[],
  timeUnits:[],
  useMonths:true,
  init: function(){
    this._super();
    var timespan = this.get('timespan');
    this.set('years', this.buildYearsArray(timespan) );
    this.set('timeUnits', this.buildTimeUnitsArray(timespan) );

  },
  didInsertElement: function(){
    this.set('timelineGridObjects', this.element.getElementsByClassName("timeline-grid"));
  },
  buildYearsArray: function(timespan){
    //TODO Merge timeUnits into this func
    var years = [];
    var numYears = timespan.end.year - timespan.start.year + 1;

    for(var i = 0; i < numYears; i++){
      years.push(timespan.start.year+i);

      if(i === 1){
        this.set('useMonths',false);
      }
    }
    return years;
  },
  buildTimeUnitsArray: function(timespan){
    var timeUnits = [];
    var numYears = timespan.end.year - timespan.start.year + 1;
    if( this.timespan.units = 'quarters'){
      for (var year = 0; year < numYears; year++) {
        for (var quarter = 1; quarter < 5; quarter++) {
          timeUnits.push({'title':'Q' + quarter,
                          'value': quarter,
                          'year': timespan.start.year+year
                         });
        }
      }
    }
    return timeUnits;
  }
});

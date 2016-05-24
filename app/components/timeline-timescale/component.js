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
    Ember.run.next(this, function(){
      this.set('timelineGridObjects', this.element.getElementsByClassName("timeline-grid"));
    });
  },
  buildYearsArray: function(timespan){
    //TODO Merge timeUnits into this func
    var years = [];
    var numYears = timespan.end.year - timespan.start.year + 1;

    for(var i = 0; i < numYears; i++){
      var year = timespan.start.year+i
      var financialYear = (timespan.start.year+i+1) - 2000;
      years.push(`${year}/${financialYear}`);

      if(i === 1){
        this.set('useMonths',false);
      }
    }
    return years;
  },
  buildTimeUnitsArray: function(timespan){
    var timeUnits = [];
    var numYears = timespan.end.year - timespan.start.year + 1;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    for (var year = 0; year < numYears; year++) {
      if( this.timespan.units === 'quarters'){
        for (var quarter = 1; quarter <= 4; quarter++) {
          timeUnits.push({'title':'Q' + quarter,
                          'value': quarter,
                          'year': timespan.start.year+year
                         });
        }
      }
      else {
        for (var month = 1; month <= 12; month++) {
          timeUnits.push({'title':months[month-1],
                          'value': month,
                          'year': timespan.start.year+year
                         });
        }
      }
    }

    return timeUnits;
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
  timeline:[],
  willInsertElement(){
    this.set('timeline',this.generateTimeline(10))
  },
  generateTimeline(timespan){
    const START_YEAR = 2016;
    let timelineArray = [];
    for (var i = 0; i <= timespan; i++) {
      let yearObject = {}
      let yearStart = START_YEAR+i
      let yearEnd = yearStart - 1999
      yearObject.label = `${yearStart}/${yearEnd}`
      yearObject.start = yearStart
      yearObject.containsErrors = false
      yearObject.errorsMessages = []
      timelineArray.push(yearObject)
    }
    return timelineArray;
  }
});

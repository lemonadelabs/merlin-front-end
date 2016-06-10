import Ember from 'ember';

export default Ember.Component.extend({
  timeline:[],
  willInsertElement(){
    this.set('timeline',this.generateTimeline(10))
  },
  didUpdateAttrs(){
    let errors = this.get('errors');
    if(errors.length){
      this.processErrors(errors)
    }
    else{
      this.clearErrors()
    }
  },
  processErrors(errors){
    let timeline = this.get('timeline')
    _.forEach(timeline,function(year){
      let errorsForYear = _.filter(errors,{'year':year.start});
      if (errorsForYear.length) {
        Ember.set(year,'containsErrors', true)
        Ember.set(year,'errorsMessages', errorsForYear[0].errors)

      }
      else {
        Ember.set(year,'containsErrors', false)
        Ember.set(year,'errorsMessages', [])
      }
    })
  },
  clearErrors(){
    let timeline = this.get('timeline')
    _.forEach(timeline, function(year){
      Ember.set(year,'containsErrors', false)
      Ember.set(year,'errorsMessages', [])
    })
  },
  generateTimeline(timespan){
    const START_YEAR = 2016;
    let timelineArray = [];
    for (var i = 0; i < timespan; i++) {
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

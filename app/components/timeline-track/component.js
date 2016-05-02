import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['timeline-track'],
  timelineObjects: undefined,
  init(){
    this._super();
    this.set('timelineObjects', []);
    let self = this;
    _.forEach(this.model,function(value, key){
        if(typeof value === 'object'){
          value.name = key
          self.timelineObjects.push(value)
        }
    })
  }
});

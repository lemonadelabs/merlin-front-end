import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['timeline-track'],
  // timelineObjects: undefined,
  init(){
    this._super();
    let self = this;
    if (!this.get('timelineObjects')) {
      this.set('timelineObjects', []);

      _.forEach(this.model,function(value, key){
        if(typeof value === 'object'){
          value.name = key
          self.timelineObjects.push(value)
        }
      })

    }
  },

});

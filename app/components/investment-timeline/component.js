import Ember from 'ember';
import processPlanData from './process-plan-data'

export default Ember.Component.extend({
  processPlanData: processPlanData,
  didInsertElement: function () {
    var model = this.get('model')
    var skeleton = this.processPlanData({
      metadata : model.metadata,
      timelineObjects : model.timelineObjects
    })

    // console.log(skeleton)
  }
});

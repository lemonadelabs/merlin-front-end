import Ember from 'ember';

export default Ember.Component.extend({
  timelineObjects:[{},{},{}],
  actions:{
    onInteractionEnd: function(){
      console.log('end yo!');
    }
  }
});

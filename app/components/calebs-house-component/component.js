import Ember from 'ember';

export default Ember.Component.extend({
  timelineObjects:[{},{},{}],
  timespan:{
    start:{
      year:2016
    },
    end:{
      year:2020
    },
    units:'quarters'
  },
  timelineGridObjects:undefined,
  didInsertElement(){
    console.log(this.get('timelineGridObjects'));
  },
  actions:{
    onInteractionEnd: function(){
      console.log('end yo!');
    }
  }
});

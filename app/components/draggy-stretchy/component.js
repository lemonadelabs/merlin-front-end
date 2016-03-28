import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement(){
    console.log(Ember.$('document').data('events'));
    Ember.$('document').mousemove(function(e){
      console.log(e);
    });
  }
});

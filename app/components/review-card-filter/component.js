import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['review-card-filter'],
  actions:{
    selectCatagory:function(catagory){
      this.sendAction('changeCategory',catagory)
    }
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
actions:{
  selectCatagory:function(catagory){
    this.sendAction('changeCategory',catagory)
  }
}
});

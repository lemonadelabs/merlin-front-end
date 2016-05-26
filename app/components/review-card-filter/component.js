import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['review-card-filter'],
  changeSelection(catagories, selectedCategory){
    let index = _.findIndex(catagories, function(o) {/*jshint eqeqeq: false*/ return o.label == selectedCategory; });
    let self = this;
    _.forEach(catagories,function(category, i){
      if(i === index){
        self.set(`categories.${i}.selected`,true);
      }
      else{
        self.set(`categories.${i}.selected`,false);
      }
    })
  },
  actions:{
    selectCatagory:function(catagory){
      let catagories = this.get('categories')
      this.sendAction('changeCategory',catagory)
      this.changeSelection(catagories, catagory)
    }
  }
});

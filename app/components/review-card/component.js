import Ember from 'ember';

export default Ember.Component.extend({
  selectedCategory:undefined,
  selectGraph:undefined,
  didReceiveAttrs(){
    Ember.run.next(this,this.setupGraphDataAndFilter)
  },
  setupGraphDataAndFilter(){
    let firstCategory = this.get('cardData.filterCategories.0.label');
    this.set('selectedCategory',firstCategory)
    let selectedGraph = this.get(`cardData.graphs.${firstCategory}`);
    this.set('selectedGraph', selectedGraph)
  },
  actions:{
    changeCategory: function(catagory){
      this.set('selectedCategory',catagory)
      let selectedGraph = this.get(`cardData.graphs.${catagory}`);
      this.set('selectedGraph', selectedGraph)
    }
  }
});

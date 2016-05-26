import Ember from 'ember';

export default Ember.Component.extend({
  percentageToSlash:10,
  revisedBudget:undefined,
  init(){
    this._super()
    this.slashByPercentage(this.percentageToSlash,10000)
  },
  slashByPercentage(percentage, budget){
    let ratio = percentage / 100,
        amountToCut = budget*ratio,
        slashedBudget = budget - amountToCut
    console.log(ratio,slashedBudget);
    this.set('revisedBudget',slashedBudget);
  },
  observePercentage:function(){
    let percentage = this.get('percentageToSlash')

    this.slashByPercentage(percentage,10000)
  }.observes('percentageToSlash')
});

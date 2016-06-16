import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['haircut-card'],
  servicePercentageToSlash:0.0,
  revisedBudget:undefined,
  totalServiceBudget:undefined,
  revisedSubBudgets:{},
  revisedSubBudgetTotal:undefined,
  updateSubBudgets:true,
  showBudgets:true,
  init(){
    this._super();
    let totalServiceBudget = this.findTotalServiceBudget()
    this.set('totalServiceBudget',totalServiceBudget);
    this.set('revisedBudget',totalServiceBudget);
  },
  findTotalServiceBudget(){
    let budgets = this.get('service.budgets'),
        totalServiceBudget = 0
    _.forEach(budgets,function(budget){
      totalServiceBudget += budget.processes[0].properties[0].property_value;
    })
    return(totalServiceBudget);
  },
  slashByPercentage(percentage, budget){
    let ratio = percentage / 100,
        amountToCut = budget*ratio,
        slashedBudget = budget - amountToCut
    this.set('revisedBudget',slashedBudget);
  },
  calculateRevisedTotalBudget(){
    let revisedSubBudgets = this.get('revisedSubBudgets');
    let revisedSubBudgetTotal = 0;
    _.forEach(revisedSubBudgets,function(budget){
      revisedSubBudgetTotal += budget.value||0;
    })
    return revisedSubBudgetTotal
  },
  addRound10Polyfill(){
    //this should be added as a proper polyfill later
    if (!Math.round10) {
      Math.round10 = function(value, exp) {
        return decimalAdjust('round', value, exp);
      };
    }
    function decimalAdjust(type, value, exp) {
      // If the exp is undefined or zero...
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
      }
      value = +value;
      exp = +exp;
      // If the value is not a number or the exp is not an integer...
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
      }
      // Shift
      value = value.toString().split('e');
      value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
      // Shift back
      value = value.toString().split('e');
      return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }
  },
  calculateNewPercentage(revisedBudget,totalBudget){
    this.addRound10Polyfill()
    let increase = revisedBudget - totalBudget;
    let newPercentage = increase / totalBudget * 100;
    let newPercentageAbs = Math.abs(newPercentage)
    let newPercentageRounded = Math.round10(newPercentageAbs,-1)
    return newPercentageRounded
  },
  mouseDown(){
    if(!this.get('updateSubBudgets')){
       this.set('updateSubBudgets',true)
    }
  },
  touchStart(){
    if(!this.get('updateSubBudgets')){
       this.set('updateSubBudgets',true)
    }
  },
  observePercentage:function(){
    let percentage = this.get('servicePercentageToSlash'),
        totalServiceBudget = this.get('totalServiceBudget')

    this.slashByPercentage(percentage, totalServiceBudget);
  }.observes('servicePercentageToSlash'),
  updateBudgetBasedOnServicePercentage(params){
    let revisedSubBudgets = this.get('revisedSubBudgets')
    this.sendAction("updateScenario", revisedSubBudgets)
    let newRevisedTotalBudget = this.calculateRevisedTotalBudget(),
        totalBudget = this.get('totalServiceBudget'),
        newPercentage = this.calculateNewPercentage(newRevisedTotalBudget, totalBudget)
    this.set('revisedBudget', newRevisedTotalBudget);
    if(params.subBudgetModified){
      this.set('updateSubBudgets', false)
      this.set('servicePercentageToSlash', newPercentage)
    }
  },
  actions:{
    updateServiceBudgetAndPercentage:function(params){
      this.set(`revisedSubBudgets.${params.budgetName}`, {'value':params.revisedBudget,'entity':params.budgetEntity})
      Ember.run.debounce(this,this.updateBudgetBasedOnServicePercentage,params,1)
    }
  }
});

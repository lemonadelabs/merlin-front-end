import Ember from 'ember';

export default Ember.Component.extend({
  oldServicePercentageToSlash:undefined,
  percentageToSlash:10.0,
  budgetName:undefined,
  revisedBudget:undefined,
  budgetAmmount:undefined,
  selected:undefined,
  didInsertElement(){
    this._super()
    let budgetAmmount = this.get('budget.processes.0.properties.0.property_value')
    let servicePercentageToSlash = this.get('servicePercentageToSlash')
    let process = this.get('budget.processes.0')
    let budgetName = process.name
    this.set('budgetName',budgetName)
    this.set('budgetAmmount',budgetAmmount)
    this.set('oldServicePercentageToSlash',servicePercentageToSlash)
    this.slashByPercentage(this.percentageToSlash,budgetAmmount)
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
  mouseDown(){
    console.log('m down', this.get('budgetName'));
    this.set('selected',true)
    console.log(this.get('selected'));
  },
  mouseUp(){
    console.log('m up', this.get('budgetName'));
    this.set('selected',false)
    console.log(this.get('selected'));

  },
  slashByPercentage(percentage, budget){
    let ratio = percentage / 100,
        amountToCut = budget*ratio,
        slashedBudget = budget - amountToCut,
        budgetName = this.get('budgetName')
    this.set('revisedBudget',slashedBudget);
    if(this.get('selected')){
      var subBudgetModified = true;
    }
    else {
      var subBudgetModified = false;
    }
    this.sendAction("updateServiceBudgetAndPercentage",{'revisedBudget':slashedBudget,'budgetName':budgetName,'subBudgetModified':subBudgetModified})

  },
  observePercentage:function(){
    let percentage = this.get('percentageToSlash'),
        budgetAmmount = this.get('budgetAmmount')
    this.slashByPercentage(percentage, budgetAmmount)
  }.observes('percentageToSlash'),
  observeServicePercentage:function(){
    this.addRound10Polyfill()
    let servicePercentageToSlash = this.get('servicePercentageToSlash')

    if(!this.get('updateSubBudgets')){
      this.set('oldServicePercentageToSlash', servicePercentageToSlash)
      return;
    }
    let servicePercentageDifference = servicePercentageToSlash - this.get('oldServicePercentageToSlash')
    let budgetPercentage = this.get('percentageToSlash')
    if(budgetPercentage+servicePercentageDifference >= 0 && budgetPercentage+servicePercentageDifference <= 20.0){
      let newPercentage = Math.round10(budgetPercentage+servicePercentageDifference,-1)
      this.set('percentageToSlash', newPercentage);
    }
    this.set('oldServicePercentageToSlash', servicePercentageToSlash)
    console.log(this.get('updateSubBudgets'));
  }.observes('servicePercentageToSlash')
});

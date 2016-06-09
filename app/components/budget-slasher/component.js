import Ember from 'ember';

export default Ember.Component.extend({
  oldServicePercentageToSlash:undefined,
  percentageToSlash:10.0,
  budgetName:undefined,
  revisedBudget:undefined,
  budgetAmmount:undefined,
  selected:undefined,
  init(){
    this._super()
    var boundDeselectFunc = this.deselect.bind(this);
    this.set('boundDeselect', boundDeselectFunc)
  },
  deselect(){
    this.set('selected',false)
    var boundDeselectFunc = this.get('boundDeselect')
    document.removeEventListener('mouseup',boundDeselectFunc)
  },
  didReceiveAttrs(){
    let budgetAmmount = this.get('budget.processes.0.properties.0.property_value')
    let servicePercentageToSlash = this.get('servicePercentageToSlash')
    let process = this.get('budget.processes.0')
    let budgetName = process.name
    this.set('budgetName',budgetName)
    this.set('budgetAmmount',budgetAmmount)
    this.set('oldServicePercentageToSlash',servicePercentageToSlash)
    this.slashByPercentage(this.percentageToSlash,budgetAmmount)
  },
  didUpdateAttrs(){
    this.updateBudgetBasedOnServicePercentage()
  },
  updateBudgetBasedOnServicePercentage(){
    this.addRound10Polyfill()
    let servicePercentageToSlash = this.get('servicePercentageToSlash')

    if(!this.get('updateSubBudgets')){
      this.set('oldServicePercentageToSlash', servicePercentageToSlash)
      return;
    }
    let servicePercentageDifference = servicePercentageToSlash - this.get('oldServicePercentageToSlash')
    let budgetPercentage = this.get('percentageToSlash')
    let newPercentage = budgetPercentage+servicePercentageDifference

    if(newPercentage <= 0 ){
      this.set('percentageToSlash', 0);
    }
    else if(newPercentage >= 20.0){

      this.set('percentageToSlash', 20.0);
    }
    else{
      let newPercentageRounded = Math.round10(newPercentage,-1)
      this.set('percentageToSlash', newPercentageRounded);
    }
    this.set('oldServicePercentageToSlash', servicePercentageToSlash)
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
    console.log(this.get('selected'));

    this.set('selected',true)
    var boundDeselectFunc = this.get('boundDeselect')
    document.addEventListener('mouseup',boundDeselectFunc)
  },
  slashByPercentage(percentage, budget){
    let ratio = percentage / 100,
        amountToCut = budget*ratio,
        slashedBudget = budget - amountToCut,
        budgetName = this.get('budgetName'),
        budgetEntity = this.get('budget'),
        subBudgetModified

    this.set('revisedBudget',slashedBudget);
    if(this.get('selected')){
      subBudgetModified = true;
    }
    else {
      subBudgetModified = false;
    }
    this.sendAction("updateServiceBudgetAndPercentage",{'revisedBudget':slashedBudget,'budgetName':budgetName,'budgetEntity':budgetEntity,'subBudgetModified':subBudgetModified})

  },
  observePercentage:function(){
    let percentage = this.get('percentageToSlash'),
        budgetAmmount = this.get('budgetAmmount')

    this.slashByPercentage(percentage, budgetAmmount);
  }.observes('percentageToSlash')
});

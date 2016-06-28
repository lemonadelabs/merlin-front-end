import Ember from 'ember';

export default Ember.Component.extend({
  oldServicePercentageToSlash:0,
  oldPercentageToSlash:0,
  percentageToSlash:0.0,
  budgetName:undefined,
  revisedBudget:undefined,
  budgetAmmount:undefined,
  selected:undefined,
  initialRender:true,
  init(){
    this._super()
    var boundDeselectFunc = this.deselect.bind(this);
    this.set('boundDeselect', boundDeselectFunc)
  },
  deselect(){
    this.set('selected',false)
    var boundDeselectFunc = this.get('boundDeselect')
    document.removeEventListener('mouseup',boundDeselectFunc)
    document.removeEventListener('touchend',boundDeselectFunc)
    document.removeEventListener('touchcancel',boundDeselectFunc)
  },
  didReceiveAttrs(){
    if(this.get('initialRender')){
      let budgetEntity = this.get('budget')
      this.setupComponent(budgetEntity)

      if(this.get('scenarios.haircut')){
        this.reloadPreviousHaircut(budgetEntity)
      }
      else{
        this.set('revisedBudget', budgetEntity.processes[0].properties[0].property_value)
      }
      this.set('initialRender',false)
    }
  },
  didUpdateAttrs(){
    this.updateBudgetBasedOnServicePercentage()
  },
  setupComponent(budgetEntity){
    let budgetAmmount = budgetEntity.processes[0].properties[0].property_value,
        budgetName = budgetEntity.processes[0].name;
    this.set('budgetName',budgetName)
    this.set('budgetAmmount',budgetAmmount)
  },
  reloadPreviousHaircut(budgetEntity){
    let budgetAmmount = budgetEntity.processes[0].properties[0].property_value,
        budgetName = budgetEntity.processes[0].name,
        scenario = this.get('scenarios.haircut'),
        actionsForEntity = this.findActionsForEntity(budgetEntity,scenario),
        budgetAmountChangedInScenario,
        percentageToSlash

    if(actionsForEntity.length){
      budgetAmountChangedInScenario = actionsForEntity[0].operand_2.params[1];
    }else{
      budgetAmountChangedInScenario = 0;
    }

    percentageToSlash = this.calculatePecentageChange(budgetAmmount, budgetAmmount+budgetAmountChangedInScenario)
    this.slashByPercentage(percentageToSlash, budgetAmmount, true)
    let revisedBudget = this.get('revisedBudget')
    this.sendAction("updateServiceBudgetAndPercentage",{'revisedBudget':revisedBudget,'budgetName':budgetName,'budgetEntity':budgetEntity,'subBudgetModified':true})
  },
  findActionsForEntity(entity,scenario){
    var actionArray =[]

    _.forEach(scenario.events,function(event){
      _.forEach(event.actions, function(action){
        if(entity.id === action.operand_1.params[0]){
          actionArray.push(action)
        }
      });
    })
    return actionArray

  },
  calculatePecentageChange(oldValue, newValue){
    this.addRound10Polyfill()

    let decrease = oldValue - newValue,
        percentage = decrease / oldValue * 100,
        percentageRounded = Math.round10(percentage,-1);

    return percentageRounded
  },
  updateBudgetBasedOnServicePercentage(){
    this.addRound10Polyfill()
    let servicePercentageToSlash = this.get('servicePercentageToSlash')
    let oldServicePercentageToSlash = this.get('oldServicePercentageToSlash')
    if(!this.get('updateSubBudgets')){
      this.set('oldServicePercentageToSlash', servicePercentageToSlash)
      return;
    }

    let servicePercentageDifference = servicePercentageToSlash - oldServicePercentageToSlash
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
    this.set('selected',true)
    var boundDeselectFunc = this.get('boundDeselect')
    document.addEventListener('mouseup',boundDeselectFunc)
  },
  touchStart(){
    this.set('selected',true)
    var boundDeselectFunc = this.get('boundDeselect')
    document.addEventListener('touchend',boundDeselectFunc)
    document.addEventListener('touchcancel',boundDeselectFunc)
  },
  slashByPercentage(percentage, budget){
    let ratio = percentage / 100,
        amountToCut = budget*ratio,
        slashedBudget = budget - amountToCut,
        budgetName = this.get('budgetName'),
        budgetEntity = this.get('budget');

    if(isNaN(percentage)){
      console.warn('percentage is NaN!')
      return
    }
    if(this.get('percentageToSlash') !== percentage){
      this.set('percentageToSlash', percentage)
    }
    this.set('revisedBudget', slashedBudget);

    return {'revisedBudget':slashedBudget,'budgetName':budgetName,'budgetEntity':budgetEntity}
  },
  changePercentage(){
    let percentage = this.get('percentageToSlash'),
        oldPercentageToSlash = this.get('oldPercentageToSlash'),
        budgetAmmount = this.get('budgetAmmount')

    if(oldPercentageToSlash !== percentage){
      this.set('oldPercentageToSlash', percentage)
      let slashData = this.slashByPercentage(percentage, budgetAmmount);
      if(this.get('selected')){
        slashData.subBudgetModified = true;
      }
      else {
        slashData.subBudgetModified = false;
      }
      this.sendAction("updateServiceBudgetAndPercentage", slashData)
    }
  },
  observePercentage:function(){
    if(isNaN(this.get('percentageToSlash'))){
      console.warn('percentage is NaN!')
      return
    }
    Ember.run.debounce(this, this.changePercentage,10 )
  }.observes('percentageToSlash')
});

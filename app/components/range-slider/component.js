import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['range-slider-container'],
  propertyBindings: ['value > element.value'],
  translateX:undefined,
  bubbleInlineStyle: Ember.computed('translateX', function(){
    var x = this.get('translateX');

    return Ember.String.htmlSafe(`transform:translate(${x}px);`);
  }),
  // attributeBindings: ['min', 'max', 'step', 'type', 'name', 'list'],
  didInsertElement(){
    this.calculateBubblePosition();
  },
  input: function() {
    this.updateValue();
    this.calculateBubblePosition();
  },
  updateValue: function(){
    let componentElement = this.get('element')
    let rangeElement = componentElement.querySelectorAll("input[type=range]")[0]
    this.set('value', Number(rangeElement.value).valueOf());
  },
  calculateBubblePosition(){
    //Derived from http://codepen.io/yannicvanveen/pen/HtvbI
    let componentElement = this.get('element'),
        rangeElement = componentElement.querySelectorAll("input[type=range]")[0],
        bubbleElement = componentElement.querySelectorAll(".range-value")[0],
        rangeWidth = rangeElement.offsetWidth,
        bubbleWidth = bubbleElement.offsetWidth,
        thumbWidth = 16,
        startValue = this.get('value'),
        maxValue = this.get('max');

    let startOffset = (((rangeWidth - thumbWidth) / maxValue) * startValue) - (bubbleWidth*0.5)+7;
    this.set('translateX', startOffset)
  }
});

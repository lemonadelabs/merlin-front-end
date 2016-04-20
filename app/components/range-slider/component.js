import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['range-slider-container'],
  propertyBindings: ['value > element.value'],
  translateX:undefined,
  rangeElement:undefined,
  bubbleElement:undefined,
  bubbleInlineStyle: Ember.computed('translateX', function(){
    var x = this.get('translateX');
    return Ember.String.htmlSafe(`transform:translate(${x}px);`);
  }),
  // attributeBindings: ['min', 'max', 'step', 'type', 'name', 'list'],
  didInsertElement(){
    Ember.run.next(this, this.calculateBubblePosition);
  },
  input() {
    this.updateValue();
    this.calculateBubblePosition();
  },
  updateValue(){
    let componentElement = this.get('element')
    let rangeElement = componentElement.querySelectorAll("input[type=range]")[0]
    this.set('value', Number(rangeElement.value).valueOf());
  },
  calculateBubblePosition(){
    //Derived from http://codepen.io/yannicvanveen/pen/HtvbI
    let {rangeElement, bubbleElement} = this.getRangeAndBubbleElements(),
        {rangeWidth, bubbleWidth} = this.getRangeAndBubbleWidths(rangeElement,bubbleElement),
        thumbWidth = 16,
        startValue = this.get('value'),
        maxValue = this.get('max');

    let startOffset = (((rangeWidth - thumbWidth) / maxValue) * startValue) - (bubbleWidth*0.5)+9;
    this.set('translateX', startOffset)
  },
  getRangeAndBubbleElements(){
    let componentElement = this.get('element'),
        rangeElement = this.get('rangeElement') || componentElement.getElementsByTagName("input")[0],
        bubbleElement = this.get('bubbleElement') || componentElement.getElementsByTagName("p")[0]

    if(!this.set('rangeElement')&&!this.set('bubbleElement')){
      this.set('rangeElement', rangeElement);
      this.set('bubbleElement', bubbleElement);
    }

    return {rangeElement, bubbleElement}

  },
  getRangeAndBubbleWidths(rangeElement, bubbleElement){
    let rangeWidth = rangeElement.offsetWidth,
        bubbleWidth = bubbleElement.offsetWidth

    return {rangeWidth, bubbleWidth}
  }
});

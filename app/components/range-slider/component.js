import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['range-slider-container'],
  propertyBindings: ['value > element.value'],
  translateX:undefined,
  rangeElement:undefined,
  bubbleElement:undefined,
  bubbleInlineStyle: Ember.computed('translateX', function(){
    let x =  this.get('translateX');
    /*Check to see if we have calculated a position for the bubble,
    if not hide it for now to avoid an awkward pop*/
    var style = x ? `transform:translate(${x}px);` : 'opacity:0;';
    return style
  }),
  didInsertElement(){
    let {rangeElement} = this.getRangeAndBubbleElements()
    rangeElement.value = this.get('value')
    Ember.run.next(this, this.calculateBubblePosition);
  },
  input() {
    this.updateValue();

  },
  updateValue(){
    let rangeElement = this.get('rangeElement')
    this.set('value', Number(rangeElement.value).valueOf());
  },
  calculateBubblePosition(){
    //Derived from http://codepen.io/yannicvanveen/pen/HtvbI
    let {rangeElement, bubbleElement} = this.getRangeAndBubbleElements(),
        {rangeWidth, bubbleWidth} = this.getRangeAndBubbleWidths(rangeElement,bubbleElement),
        thumbWidth = 16,
        value = this.get('value'),
        minValue = this.get('min'),
        maxValue = this.get('max'),
        iterationWidth = (rangeWidth - thumbWidth) / (maxValue - minValue);
    let startOffset = ( iterationWidth * value ) - iterationWidth - (bubbleWidth / 2 )+9;
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
    let rangeWidth = rangeElement.getBoundingClientRect().width,
        bubbleWidth = bubbleElement.getBoundingClientRect().width
    return {rangeWidth, bubbleWidth}
  },
  observesValue: function(){
    this.calculateBubblePosition();
  }.observes('value')
});

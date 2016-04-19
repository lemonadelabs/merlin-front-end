import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['range-slider-container'],
  propertyBindings: ['value > element.value'],
  bubbleInlineStyle: Ember.computed('left', 'marginLeft', function(){
    var x = this.get('left');
    return Ember.String.htmlSafe(`transform:translate(${x}px, 0px);`);
  }),
  // attributeBindings: ['min', 'max', 'step', 'type', 'name', 'list'],
  input: function() {
    this.updateValue();
    this.moveBubble();
  },
  updateValue: function(){
    let componentElement = this.get('element')
    let rangeElement = componentElement.querySelectorAll("input[type=range]")[0]
    this.set('value', Number(rangeElement.value).valueOf());
  },
  moveBubble: function(){
   // Cache this for efficiency
   let componentElement = this.get('element')
   let bubbleElement = componentElement.querySelectorAll(".range-value")[0]
   let rangeElement = componentElement.querySelectorAll("input[type=range]")[0]
   let width = rangeElement.getBoundingClientRect().width
   console.log(width);

   // Figure out placement percentage between left and right of input
   let newPoint = (this.get('value') - this.get('min')) / (this.get('max') - this.get('min'));

   // Janky value to get pointer to line up better
   let offset = -1.3;
   let newPlace;
   // Prevent bubble from going beyond left or right (unsupported browsers)
   if (newPoint < 0) { newPlace = 0; }
   else if (newPoint > 1) { newPlace = width; }
   else { newPlace = width * newPoint + offset; offset -= newPoint; }

   this.set('left',newPlace)
  }
});

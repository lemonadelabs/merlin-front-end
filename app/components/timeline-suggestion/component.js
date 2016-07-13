import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['timeline-suggestion'],
  attributeBindings: ['style'],
  x:undefined,
  width:undefined,
  style:Ember.computed('x','width', function(){
    let x = this.get('x'),
        width = this.get('width');
    return Ember.String.htmlSafe(`transform:translate(${x}px, 0px); width: ${width}px;`);
    // }
  }),
  didInsertElement(){
    window.addEventListener('resize', this.boundResizeFunc)
    this.findAndSetTrackOffset();

    if(this.get('timelineGridObjects')){
      this.setPositionFromGrid();
    }
  },
  findAndSetTrackOffset(){
    let trackOffset = this.get('parentView.element').getBoundingClientRect().left
    this.set('trackOffset',trackOffset);
  },
  handleResize: function () {
    Ember.run.debounce(this, this.setPositionFromGrid, 100);
    this.findAndSetTrackOffset();
  },
  willDestroyElement: function() {
    var clone = this.$().clone();
    this.$().parent().append(clone);
    // clone.fadeOut();
    console.log(clone);
    clone[0].style.animationName = "fade-out";
    Ember.run.later(this, this.removeElement, clone[0], 300);
    window.removeEventListener('resize', this.boundResizeFunc)
  },
  removeElement(element){
    element.parentNode.removeChild(element);
  },
  setPositionFromGrid: function(){
    var startPosInfo = this.searchForPositionFromTime(this.get('start'));
    this.set('x',startPosInfo.offsetLeft);
    var endPosInfo = this.searchForPositionFromTime(this.get('end'));
    this.set('width', (endPosInfo.offsetRight - startPosInfo.offsetLeft)+1);
  },
  searchForPositionFromTime:function(time){
    var grid = this.get('timelineGridObjects');
    var offsetLeft;
    var offsetWidth;

    _.forEach(grid, (item) =>{
      //jshint eqeqeq: false
      if(time.year == item.dataset.year && time.value == item.dataset.value){
        offsetLeft = item.offsetLeft;
        offsetWidth = item.offsetWidth;
      }
    });
    return({'offsetLeft':offsetLeft,'offsetRight':(offsetLeft+offsetWidth)});
  },
  between: function(x, min, max) {
    return x >= min && x <= max;
  }
});

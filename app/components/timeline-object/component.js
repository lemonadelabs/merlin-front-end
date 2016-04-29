import Ember from 'ember';

export default Ember.Component.extend({
  active:false,
  classNames: ['timeline-object'],
  classNameBindings:['active'],
  attributeBindings: ['style'],
  x:undefined,
  width:undefined,
  boundFinishManipulationFunc:undefined,
  boundResizeFunc:undefined,
  style:Ember.computed('x','width','active', function(){
    var x = this.get('x');
    var width = this.get('width');
    // if(this.get('active')){
    //   return Ember.String.htmlSafe(`transform:translate(${x}px, -5px); width: ${width}px;`);
    // }else{
    return Ember.String.htmlSafe(`transform:translate(${x}px, 0px); width: ${width}px;`);
    // }
  }),
  didInsertElement(){
    this.set('boundFinishManipulationFunc',this.finishManipulation.bind(this));
    this.set('boundResizeFunc',this.handleResize.bind(this));
    document.onmousemove = document.onmousemove || this.updateInputPosition;
    document.onmouseup = document.onmouseup || this.envokeCancelEvent;

    if(!document.touchMoveListener){
      document.addEventListener("touchmove", this.updateInputPosition);
      document.touchMoveListener = true;
    }
    if(!document.touchEndListener){
      document.addEventListener("touchend", this.envokeCancelEvent);
      document.touchEndListener = true;
    }
    window.addEventListener('resize', this.boundResizeFunc)

  },
  willDestroy(){
    document.onmousemove = null;
    document.removeEventListener('resize', this.boundResizeFunc)
  },
  handleResize: function () {
    Ember.run.debounce(this, this.setPositionFromGrid, 100);    
  },
  mouseDown(e){
    this.handleInputStart(e);
  },
  touchStart(e){
    this.handleInputStart(e);
  },
  handleInputStart:function(e){
    this.addCancelEventListener();
    if(e.type === 'touchstart'){
      this.updateInputPosition(e.originalEvent);
    }
    this.set('active',true);
    //fallback for older firefox that doesn't support offsetX & touch devices
    var offset = e.offsetX || (document.inputX - this.get('x'));
    var width = this.get('width');

    if(offset >= this.width - 20){
      Ember.run.next(this,this.updateMyWidthRight, {'offset':width-offset});
    }
    else if(offset <= 20){
      Ember.run.next(this,this.updateMyWidthLeft, {'offset':offset});
    }
    else{
      Ember.run.next(this,this.updateMyPosition, {'offset':offset});
    }
  },
  addCancelEventListener: function(){
    document.addEventListener("cancelManipulation", this.boundFinishManipulationFunc, false);
    document.cancelManipulationListener = true;
  },
  removeCancelEventListener: function(){
    document.removeEventListener("cancelManipulation", this.boundFinishManipulationFunc, false);
    document.cancelManipulationListener = false;
  },
  mouseUp(){
    //This will still work on IE
    this.finishManipulation();
  },
  finishManipulation: function(){
    this.set('active',false);
    var interActEndFunc = this.get('onInteractionEnd') || this.warnMissingAction;
    this.snapToGrid();
    var timeFromPosition = this.searchForTimeFromPosition(this.get('x'),this.get('width'));
    this.set('start',timeFromPosition.startTime);
    this.set('end',timeFromPosition.endTime);
    interActEndFunc();
    this.removeCancelEventListener();

  },
  snapToGrid: function(){
    var grid = this.get('timelineGridObjects');
    var left = this.get('x');
    var width = this.get('width');
    var right = left + width;
    var closestLeft = grid[0].offsetLeft;
    var closestRight = grid[0].offsetLeft+grid[0].offsetWidth;
    var startData;
    var endData;
    this.cancelInputUpdates();

    _.forEach(grid, function(item){
      var offsetRight = item.offsetLeft+item.offsetWidth;
      if(Math.abs(left-closestLeft) >= Math.abs(left-item.offsetLeft)){
        closestLeft=item.offsetLeft;
        startData=item.dataset;
      }
      if(Math.abs(right-closestRight) >= Math.abs(right-offsetRight)){
        closestRight=offsetRight;
        endData=item.dataset;
      }
    });

    if(this.get('updateMyPositionRunLoop') || this.get('updateMyWidthLeftRunLoop')){
      this.set('x',closestLeft);
    }
    if(this.get('updateMyWidthRightRunLoop')){
      this.set('width',closestRight-left);
    }
    if(this.get('updateMyWidthLeftRunLoop')){
      this.set('width',width+(left-closestLeft));
    }
    this.clearInputUpdates();
  },
  cancelInputUpdates:function(){
    Ember.run.cancel(this.get('updateMyWidthLeftRunLoop'));
    Ember.run.cancel(this.get('updateMyWidthRightRunLoop'));
    Ember.run.cancel(this.get('updateMyPositionRunLoop'));
  },
  clearInputUpdates:function(){
    this.set('updateMyWidthLeftRunLoop',undefined);
    this.set('updateMyWidthRightRunLoop',undefined);
    this.set('updateMyPositionRunLoop',undefined);
  },
  warnMissingAction: function(){
    console.warn("Missing action on interaction end");
  },
  updateMyWidthRight: function(args){
    var offset = args.offset;
    var x = this.get('x');

    var newWidth = document.inputX - x + offset;
    if(newWidth>0){
      this.set('width', newWidth);
    }

    if(this.get('active')){
      this.set('updateMyWidthRightRunLoop', Ember.run.next(this, this.updateMyWidthRight, {'offset':offset}) );
    }
  },
  updateMyWidthLeft: function(args){
    var offset = args.offset;
    var x = this.get('x');
    var width = this.get('width');

    if(x !== x+ (x - document.inputX)){
      this.set('x', x - (x - document.inputX + offset) );
      this.set('width', width + (x - document.inputX + offset) );
    }

    if(this.get('active')){
      this.set('updateMyWidthLeftRunLoop', Ember.run.next(this, this.updateMyWidthLeft, {'offset':offset}) );
    }

  },
  updateMyPosition: function(args){
    var offset = args.offset;
    this.set('x', document.inputX - offset);
    if(this.get('active')){
      this.set('updateMyPositionRunLoop' , Ember.run.next(this, this.updateMyPosition, {'offset':offset}) );
    }
  },
  updateInputPosition: function(e){
    if (typeof e.clientX){
      document.inputX = e.clientX;
      document.inputY = e.clientY;
    }
    else if(typeof e.touches[0].clientX){
      document.inputX = e.touches[0].clientX;
      document.inputY = e.touches[0].clientY;
    }
  },
  envokeCancelEvent: function(){
    /*TODO: this does not work on IE but works with Edge, we should look into a polyfill
    or a different aproach should the need for IE come up.*/
    var ev = new Event("cancelManipulation", {"bubbles":false, "cancelable":false});
    document.dispatchEvent(ev);
  },
  searchForPositionFromTime:function(time){
    var grid = this.get('timelineGridObjects');
    var offsetLeft;
    var offsetWidth;

    _.forEach(grid, function(item){
      //jshint eqeqeq: false
      if(time.year == item.dataset.year && time.value == item.dataset.value){
        offsetLeft = item.offsetLeft;
        offsetWidth = item.offsetWidth;
      }
    });
    return({'offsetLeft':offsetLeft,'offsetRight':(offsetLeft+offsetWidth)});
  },
  searchForTimeFromPosition:function(x,width){
    var self = this;
    var grid = this.get('timelineGridObjects');
    var startTime = {};
    var endTime = {};
    _.forEach(grid, function(item){
      var rightOffset = item.offsetLeft+item.offsetWidth;
      //jshint eqeqeq: false
      if(x == item.offsetLeft){
        startTime.year = parseInt(item.dataset.year,10);
        startTime.value = parseInt(item.dataset.value,10);
      }
      if(self.between(x+width,rightOffset-5,rightOffset+5)){
        endTime.year = parseInt(item.dataset.year,10);
        endTime.value = parseInt(item.dataset.value,10);
      }
    });
    return({'startTime':startTime,'endTime':endTime});
  },
  setPositionFromGrid: function(){
    var startPosInfo = this.searchForPositionFromTime(this.get('start'));
    this.set('x',startPosInfo.offsetLeft);
    var endPosInfo = this.searchForPositionFromTime(this.get('end'));
    this.set('width', (endPosInfo.offsetRight - startPosInfo.offsetLeft)+1);
  },
  onGridSetup: function (){
    this.setPositionFromGrid();
  }.observes('timelineGridObjects'),
  between: function(x, min, max) {
    return x >= min && x <= max;
  }
});

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
  trackOffset:0,
  showContextMenu: false,
  contextMenuOptions: [{label:'suggest',actionName:"getSuggestion"}],
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
    document.onmouseup = document.onmouseup || this.envokeCancelEvent.bind(this);
    if(!document.timelineObjectCount){
      document.timelineObjectCount = 0
    }

    document.timelineObjectCount++

    if(!document.touchMoveListener){
      document.addEventListener("touchmove", this.updateInputPosition);
      document.touchMoveListener = true;
    }
    if(!document.touchEndListener){
      document.addEventListener("touchend", this.envokeCancelEvent.bind(this));
      document.touchEndListener = true;
    }
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
  willDestroy(){
    document.timelineObjectCount--
    if(document.timelineObjectCount === 0){
      document.onmousemove = null;
    }
    window.removeEventListener('resize', this.boundResizeFunc)
    document.removeEventListener("touchmove", this.updateInputPosition);
    document.removeEventListener("touchend", this.envokeCancelEvent.bind(this));
  },
  handleResize: function () {
    Ember.run.debounce(this, this.setPositionFromGrid, 100);
    this.findAndSetTrackOffset();
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

    var oldStart = this.get('start')
    var oldEnd = this.get('end')

    if (_.isEqual(oldStart, timeFromPosition.startTime) && _.isEqual(oldEnd , timeFromPosition.endTime) ) {
      this.triggureOnNoDragClick()
    }
    this.set('start',timeFromPosition.startTime);
    this.set('end',timeFromPosition.endTime);
    if(interActEndFunc){
      interActEndFunc(this);
    }
    this.removeCancelEventListener();

  },
  triggureOnNoDragClick: function () {
    this.sendAction('onNoDragClick', this)
  },
  contextMenu(e) {
    e.preventDefault()
    this.set('showContextMenu', true)

    // console.log('..............')
    // console.log('this', this)
    // console.log('e', e)

    this.sendAction('onContextMenu', this)
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
    var offset = args.offset,
        x = this.get('x'),
        trackOffset = this.get('trackOffset'),
        relativeInputPosition = document.inputX - trackOffset

    var newWidth = relativeInputPosition - x + offset;
    if(newWidth>0){
      this.set('width', newWidth);
    }

    if(this.get('active')){
      this.set('updateMyWidthRightRunLoop', Ember.run.next(this, this.updateMyWidthRight, {'offset':offset}) );
    }
  },
  updateMyWidthLeft: function(args){
    var offset = args.offset,
        x = this.get('x'),
        width = this.get('width'),
        trackOffset = this.get('trackOffset'),
        relativeInputPosition = document.inputX - trackOffset


    if(x !== x+ (x - relativeInputPosition)){
      this.set('x', x - (x - relativeInputPosition + offset) );
      this.set('width', width + (x - relativeInputPosition + offset) );
    }

    if(this.get('active')){
      this.set('updateMyWidthLeftRunLoop', Ember.run.next(this, this.updateMyWidthLeft, {'offset':offset}) );
    }

  },
  updateMyPosition: function(args){
    var offset = args.offset,
        trackOffset = this.get('trackOffset'),
        relativeInputPosition = document.inputX - trackOffset

    this.set('x', relativeInputPosition - offset);
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
  },
  actions:{
    handleContextMenuAction: function(actionName){
      console.log("blah blah");
      if(actionName){
        this.sendAction('onContextMenuAction',actionName,this)
      }
    }
  }
});

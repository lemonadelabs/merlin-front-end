import Ember from 'ember';

export default Ember.Component.extend({
  active:false,
  classNames: ['timeline-object'],
  classNameBindings:['active'],
  attributeBindings: ['style'],
  x:0,
  width:100,
  boundFinishManipulationFunc:undefined,
  style:Ember.computed('x','width', function(){
    var x = this.get('x');
    var width = this.get('width');
    return Ember.String.htmlSafe(`transform:translate(${x}px); width: ${width}px;`);
  }),
  didInsertElement(){
    this.set('boundFinishManipulationFunc',this.finishManipulation.bind(this));
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
  },
  willDestroy(){
    document.onmousemove = null;
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
  finishManipulation:function(){
    this.set('active',false);
    this.removeCancelEventListener();
    var interActEndFunc = this.get('onMouseUp') || this.warnMissingAction;
    interActEndFunc();
  },
  warnMissingAction:function(){
    console.warn("Missing action on interaction end");
  },
  updateMyWidthRight:function(args){
    var offset = args.offset;
    var x = this.get('x');

    var newWidth = document.inputX - x + offset;
    if(newWidth>0){
      this.set('width', newWidth);
    }

    if(this.get('active')){
      Ember.run.next(this, this.updateMyWidthRight, {'offset':offset});
    }
  },
  updateMyWidthLeft:function(args){
    var offset = args.offset;
    var x = this.get('x');
    var width = this.get('width');

    if(x !== x+ (x - document.inputX)){
      this.set('x', x - (x - document.inputX + offset) );
      this.set('width', width + (x - document.inputX + offset) );
    }

    if(this.get('active')){
      Ember.run.next(this, this.updateMyWidthLeft, {'offset':offset});
    }
  },
  updateMyPosition:function(args){
    var offset = args.offset;
    this.set('x', document.inputX - offset);
    if(this.get('active')){
      Ember.run.next(this, this.updateMyPosition, {'offset':offset});
    }
  },
  updateInputPosition: function(e){
    document.inputX = e.clientX || e.touches[0].clientX;
    document.inputY = e.clientY || e.touches[0].clientY;
  },
  envokeCancelEvent: function(){
    /*TODO: this does not work on IE but works with Edge, we should look into a polyfill
    or a different aproach should the need for IE come up.*/
    var ev = new Event("cancelManipulation", {"bubbles":false, "cancelable":false});
    document.dispatchEvent(ev);
  }
});

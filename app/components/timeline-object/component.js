import Ember from 'ember';

export default Ember.Component.extend({
  active:false,
  classNames: ['timeline-object'],
  classNameBindings:['active'],
  attributeBindings: ['style'],
  x:0,
  width:100,
  style:Ember.computed('x','width', function(){
    var x = this.get('x');
    var width = this.get('width');
    return Ember.String.htmlSafe(`transform:translate(${x}px); width: ${width}px;`);
  }),
  didInsertElement(){
    document.onmousemove = document.onmousemove || this.updateInputPosition;
  },
  willDestroy(){
    document.onmousemove = null;
  },
  mouseDown(e){
    this.set('active',true);
    //fallback for older firefox that doesn't support offsetX
    var offset = e.offsetX || (document.inputX - this.get('x'));
    var width = this.get('width');

    if(offset > this.width - 20){
      Ember.run.next(this,this.updateMyWidthRight, {'offset':width-offset});
    }
    else if(offset < 20){
      Ember.run.next(this,this.updateMyWidthLeft, {'offset':offset});
    }
    else{
      Ember.run.next(this,this.updateMyPosition, {'offset':offset});
    }
  },
  mouseUp(){
    this.set('active',false);
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
      this.set('x', x - (x - document.inputX))
      this.set('width', width+(x - document.inputX))
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
    document.inputX = e.clientX;
    document.inputY = e.clientY;
  }

});

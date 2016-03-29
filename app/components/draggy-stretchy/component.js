import Ember from 'ember';

export default Ember.Component.extend({
  active:false,
  attributeBindings: ['style'],
  style:Ember.computed('x', function(){
    var x = this.get('x');
    return(`transform:translate(${x}px)`);
  }),
  x:0,
  didInsertElement(){
    document.onmousemove = document.onmousemove || this.updateInputPosition;
  },
  willDestroy(){
    document.onmousemove = null;
  },
  mouseDown(e){
    this.set('active',true);
    Ember.run.next(this,this.updateMyPosition,{'e':e});

  },
  mouseUp(){
    console.log('mouseMouseUp');
    this.set('active',false);
    this.get('onMouseUp');
  },
  updateMyPosition:function(args){
    var e = args.e;
    //fallback for old firefox that doesn't support offsetX
    var offset = e.offsetX || (document.inputX - this.get('x')) - 8;
    this.set('x', document.inputX - offset);
    if(this.get('active')){
      // Ember.run.next(this,this.updateMyPosition,{'e':e});
    }
  },
  updateInputPosition: function(e){
    // console.log(e);
    document.inputX = e.clientX;
    document.inputY = e.clientY;
  }

});

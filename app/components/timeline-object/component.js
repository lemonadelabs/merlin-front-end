import Ember from 'ember';
import commaSeperate from '../../common/commaSeperateNumber';
import simTraversal from '../../common/simulation-traversal';

export default Ember.Component.extend({
  active:false,
  classNames: ['timeline-object'],
  classNameBindings:['active','suggestion'],
  attributeBindings: ['style'],
  x:undefined,
  width:undefined,
  boundFinishManipulationFunc:undefined,
  boundResizeFunc:undefined,
  trackOffset:0,
  showContextMenu: false,
  hasSuggestion:false,
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
  addPopper(content){
    if(!content || this.get('showContextMenu')){
      return
    }

    var reference = this.get('element');

    var popper = new Popper(
        reference,
        {
            content: content,
            contentType: 'html',
            classNames:['timeline-object-popper']
        },
        {
             placement: 'top',
             removeOnDestroy: true,
        }
    );

    this.set('popper',popper)
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
    console.log(e);
    if(e.target.className === "timeline-object-context-menu-item"){
      return;
    }
    this.handleInputStart(e);
    this.removePopper();
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
  mouseEnter(){
    if (!this.get('active')) {
      this.addPopper(this.createPopperTemplate());
      // console.log(this);
    }
  },
  createPopperTemplate(){
    var self = this
    let name = this.get('name');
    let capex = commaSeperate(this.get('capex'));
    let opex = commaSeperate(this.get('opex'));

    var scenarioId = this.get('scenarioId')
    var scenario = _.find(this.get('scenarios'), function (scenario) {
      return scenario.id === scenarioId
    })

    var resourceInfo = {}
    var resourcesMessages = []
    var impactsMessages = []
    var events = scenario.events
    var entities = {}
    var processProperties = []

    _.forEach(events, function (event) {
      var time = Number(event.time)
      resourceInfo[ time ] = {}
      _.forEach(event.actions, function (action) {
        var entityId = action.operand_1.params[0];
        var entity = _.find(self.get('simulation.entities'), ['id', entityId]);
        entities[entityId] = entity
        var propertyId = action.operand_2.params[0]
        var amount = action.operand_2.params[1]

        if (!resourceInfo[time][propertyId]) { resourceInfo[time][propertyId] = [] }
        resourceInfo[time][propertyId].push(amount)
      })
    })

    _.forEach(entities,function(value){
      processProperties.push( ...simTraversal.getProcessPropertiesFromEntity({ entity : value }) )
    })
    var eventKeys = Object.keys(resourceInfo).sort(compareNumbers)
    function compareNumbers(a, b) { return a - b }

    var event1Data = resourceInfo[eventKeys[0]]
    var event2Data = resourceInfo[eventKeys[1]]

    _.forEach(event1Data, function (values, propertyId) {
      var event2PropertyData = event2Data[propertyId]
      _.forEach(values, function (value) {
        var indexOfReleaseValue = event2PropertyData.indexOf(value * -1)

        if (indexOfReleaseValue > -1) {
          event2PropertyData.splice(indexOfReleaseValue, 1)
        }
      })
    })
    _.forEach(event2Data, function(array, id) { // clean up
      if (array.length === 0) { delete event2Data[id] }
    })

    _.forEach(event1Data, function (values, propertyId) {
      resourcesMessages.push( createMessage( values, propertyId ) )
    })

    _.forEach(event2Data, function (values, propertyId) {
      impactsMessages.push( createMessage( values, propertyId ) )
    })

    function createMessage(values, propertyId) {
      var processProperty = _.find(processProperties, ['id', Number(propertyId)])
      var processPropertyName = processProperty ? processProperty.name : ""
      var value = values[0]
      var message = ''
      if (value > 0) { message +=  '+' }
      message += `${value} ${processPropertyName || ""}`
      return message
    }

    let template = `<h4>${name}</h4><hr/>`
    + `<p><b>Captial Input:</b> $${capex}</p>`
    + `<p><b>Opex Contribution:</b> $${opex}</p>`

    template+= resourcesMessages.length ? `<p><b>Required Resources:</b></p>` : ""
    _.forEach(resourcesMessages, function (message) {
      template += `<p>${message}</p>`
    })

    template+= impactsMessages.length ? `<p><b>Impacts:</b></p>` : ""
    _.forEach(impactsMessages, function (message) {
      template += `<p>${message}</p>`
    })

    return template;
  },

  mouseUp(){
    //This will still work on IE
    this.finishManipulation();
  },
  mouseLeave(){
    this.removePopper();
  },
  removePopper(){
    var popper = this.get('popper')
    if(popper){
      let popperElement = popper._popper
      popperElement.style.animationName = "fade-out";
      Ember.run.later(popper, popper.destroy, 300)
    }
  },
  finishManipulation: function(){
    this.set('active',false);
    var interActEndFunc = this.get('onInteractionEnd') || this.warnMissingAction;
    this.snapToGrid();
    var timeFromPosition = this.searchForTimeFromPosition(this.get('x'),this.get('width'));

    var oldStart = this.get('start')
    var oldEnd = this.get('end')

    if (_.isEqual(oldStart, timeFromPosition.startTime) && _.isEqual(oldEnd , timeFromPosition.endTime) ) {
      this.triggerOnNoDragClick()
    }

    if(this.get('hasSuggestion')){
      this.triggerHideSuggestion()
    }
    this.set('start',timeFromPosition.startTime);
    this.set('end',timeFromPosition.endTime);
    if(interActEndFunc){
      interActEndFunc(this);
    }
    this.removeCancelEventListener();

  },
  triggerOnNoDragClick: function () {
    this.sendAction('onNoDragClick', this)
  },
  triggerHideSuggestion: function () {
    this.sendAction('hideSuggestion', this)
  },
  contextMenu(e) {
    e.preventDefault()
    let toggleContexMenu = this.get('showContextMenu') ? false : true;
    this.set('showContextMenu', toggleContexMenu)
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
      this.set('showContextMenu', false)
      if(actionName==="getSuggestion"){
        this.set("hasSuggestion", true);
      }
      if(actionName){
        this.sendAction('onContextMenuAction',actionName,this)
      }
    }
  }
});

import Ember from 'ember';
import NodesGroup from './nodesGroup'
import initDraggable from '../../common/draggable'

export default Ember.Component.extend({
  draw: undefined,
  classNames: ['node-based-editor'],
  outputConnectorData: undefined,
  processPropertyData: undefined,
  outputData: undefined,
  inputConnectorData: undefined,
  transformX: 0,
  transformY: 0,
  entityComponents: {},
  outputComponents: {},
  updateCablesBound: Ember.computed( function() {
    return Ember.run.bind(this, this.updateCables)
  }),
  style:Ember.computed('transformX', 'transformY' , function () {
    var x = this.get('transformX')
    var y = this.get('transformY')
    return Ember.String.htmlSafe(`transform:translate(${x}px,${y}px);`);
  }),
  initDraggable: initDraggable,
  didInsertElement() {
    document.onmousemove = document.onmousemove || this.updateInputPosition;
    this.initSVGDocument()
    // this.initZooming()
    this.initPaning()
  },

  updateNodesGroupOffsetX: function () {
    this.nodesGroup.groupOffsetX = this.get('transformX')
  }.observes('transformX'),

  updateNodesGroupOffsetY: function () {
    this.nodesGroup.groupOffsetY = this.get('transformY')
  }.observes('transformY'),

  loadSimulation: function(){
    var self = this

    var sortedData = {
      'Output': {},
      'ProcessProperty': {},
      'InputConnector': {},
      'OutputConnector': {},
    }


    Ember.$.getJSON('api/simulation-run/1').then(function (result) {
      if (result[0].data.result) {
        var timeframe = result[0].data.result.length

        self.set('timeframe', timeframe)
        self.set('month', timeframe)
        _.forEach(result, function (item){
          sortedData[item.type][item.id] = item
        })

        self.set('outputConnectorData', sortedData['OutputConnector'])
        self.set('processPropertyData', sortedData['ProcessProperty'])
        self.set('outputData', sortedData['Output'])
        self.set('inputConnectorData', sortedData['InputConnector'])
      }
    })
  }.on('init'),

  initPaning: function() {
    this.initDraggable({
      context : this,
      element : document.getElementById('svg-container')
    })
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

  initSVGDocument: function () {
    var draw = SVG('svg-container').size(window.innerWidth * 10, window.innerHeight * 10)
    this.set('draw', draw)
  },

  buldSVGNodes: function () {

    var self = this

    if (Object.keys( this.entityComponents ).length + Object.keys( this.outputComponents ).length === this.model.entities.length + this.model.outputs.length ) {
      this.nodesGroup = new NodesGroup({
        draw : this.draw,
        entityModel : self.get('model').entities,
        outputModel : self.get('model').outputs,
        persistPosition : self.persistPosition
      })
      this.nodesGroup.buildNodes({
        entityComponents : this.entityComponents,
        outputComponents : this.outputComponents
      })
      this.nodesGroup.initCables()
      this.nodesGroup.terminalListners()


    } else {
      console.warn('the entity components haven\'t been built yet')
    }
  }.observes('draw'),

  initZooming: function() {
    //Lets not override scrolling till we have zoom working
    this.element.addEventListener('wheel', function (e) {
      // e.preventDefault()
    })

  },

  updateCables: function (opts) {
    this.nodesGroup.updateCablesForNode(opts)
  },

  // persistPosition: function (opts) {
  //   return // false return, to kill function

  //   var nodetype
  //   if ((_.includes(opts.nodeType, 'output'))) {
  //     nodetype = 'outputs'
  //   } else if ((_.includes(opts.nodeType, 'entity'))) {
  //     nodetype = 'entities'
  //   }

  //   var url = `${nodetype}/${opts.id}/`

  //   var unModified = Ember.$.getJSON(url)
  //   unModified.then(function (response) {
  //     response.display_pos_x = opts.x
  //     response.display_pos_y = opts.y

  //     Ember.$.ajax({
  //       url: url,
  //       type: 'PUT',
  //       data: response,
  //       success: function(result) {
  //         console.log(result)
  //       }
  //     });
  //   })
  // },

});

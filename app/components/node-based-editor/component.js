import Ember from 'ember';
import NodesGroup from './nodesGroup'
import initDraggable from './draggable'

export default Ember.Component.extend({
  draw: undefined,
  outputConnectorData: undefined,
  processPropertyData: undefined,
  outputData: undefined,
  inputConnectorData: undefined,
  entityComponents: [],
  outputComponents: [],
  updateCablesBound: Ember.computed( function() {
    return Ember.run.bind(this, this.updateCables)
  }),
  attributeBindings: ['style'],
  style:Ember.computed('transformX', 'transformY' , function () {
    var x = this.get('transformX')
    var y = this.get('transformY')
    return Ember.String.htmlSafe(`transform:translate(${x}px,${y}px);`);
  }),
  initDraggable: initDraggable,
  didInsertElement() {
    document.onmousemove = document.onmousemove || this.updateInputPosition;
    this.initSVGDocument()
    this.initZooming()
    // $(this.element).panzoom()
    this.initPaning()
  },

  loadSimulation: function(){
    var self = this

    var sortedData = {
      'Output': {},
      'ProcessProperty': {},
      'InputConnector': {},
      'OutputConnector': {},
    }


    Ember.$.getJSON('api/simulation-run/1').then(function (result) {
      _.forEach(result, function (item){
        sortedData[item.type][item.id] = item
      })
      // self.set('simulationData', sortedData)

      self.set('outputConnectorData', sortedData['OutputConnector'])
      self.set('processPropertyData', sortedData['ProcessProperty'])
      self.set('outputData', sortedData['Output'])
      self.set('inputConnectorData', sortedData['InputConnector'])
    })
  }.on('init'),

  initPaning: function() {
    // var nodeContainer = document.getElementById('node-based-editor-container')
    // $('#svg-container').on('mousedown', function (e) {
    //   console.log(e)
    // })

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
    var draw = SVG('svg-container').size(window.innerWidth * 5, window.innerHeight * 5)
    this.set('draw', draw)
  },

  buldSVGNodes: function () {
    var self = this

    if (this.entityComponents.length + this.outputComponents.length === this.model.entities.length + this.model.outputs.length ) {
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
    this.element.addEventListener('wheel', function (e) {
      e.preventDefault()
      // console.log(e)
    })

  },

  updateCables: function (opts) {
    this.nodesGroup.updateCablesForNode(opts)
  },

  persistPosition: function (opts) {
    return // false return, to kill function

    var nodetype
    if ((_.includes(opts.nodeType, 'output'))) {
      nodetype = 'outputs'
    } else if ((_.includes(opts.nodeType, 'entity'))) {
      nodetype = 'entities'
    }

    var url = `${nodetype}/${opts.id}/`

    var unModified = Ember.$.getJSON(url)
    unModified.then(function (response) {
      response.display_pos_x = opts.x
      response.display_pos_y = opts.y

      Ember.$.ajax({
        url: url,
        type: 'PUT',
        data: response,
        success: function(result) {
          console.log(result)
        }
      });
    })
  },

});

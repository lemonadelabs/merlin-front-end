import Ember from 'ember';
import NodesGroup from './nodesGroup'
import initDraggable from '../../common/draggable'
import postJSON from '../../common/post-json'

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

  loadBaseline: function () {
    var self = this
    var id = this.model.id
    var simSubstring = `api/simulations/${id}/`
    var name = 'baseline'
    Ember.$.getJSON("api/scenarios/").then(function (scenarios) {

      var baseline = _.find(scenarios, function (scenario) {
        return  ( _.includes(scenario.sim, simSubstring) && scenario.name === name)
      })

      if (baseline) {
        self.set('baseline', baseline)
      } else {
        var postData = {
          "name": "baseline",
          "sim": "http://127.0.0.1:8000/api/simulations/" + id + '/',
          "start_offset": 0
        }
        postJSON({
          data : postData,
          url : "api/scenarios/"
        }).then(function (baseline) {
          self.set('baseline', baseline)
        })
      }
    })

  }.on('init'),

  loadSimulation: function(){
    var self = this

    var baselineId = this.baseline.id

    var sortedData = {
      'Output': {},
      'ProcessProperty': {},
      'InputConnector': {},
      'OutputConnector': {},
    }

    var timeframe = 10

    Ember.$.getJSON(`api/simulation-run/1/?steps=${timeframe}&s0=${baselineId}`).then(function (result) {

      self.set('timeframe', timeframe)
      self.set('month', timeframe)
      _.forEach(result, function (nodeData){
        sortedData[nodeData.type][nodeData.id] = nodeData
      })

      self.set('outputConnectorData', sortedData['OutputConnector'])
      self.set('processPropertyData', sortedData['ProcessProperty'])
      self.set('outputData', sortedData['Output'])
      self.set('inputConnectorData', sortedData['InputConnector'])
    })
  }.observes('baseline'),

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

});

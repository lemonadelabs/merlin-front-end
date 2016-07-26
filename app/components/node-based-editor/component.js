import Ember from 'ember';
import NodesGroup from './nodesGroup'
import initDraggable from '../../common/draggable'
import postJSON from '../../common/post-json'
import putJSON from '../../common/put-json'
import deleteResource from '../../common/delete-resource'
import * as scenarioInteractions from '../../common/scenario-interactions'
import * as simTraversal from '../../common/simulation-traversal'

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
  selectedEntities: [],
  selectedOutputs: [],
  updateCablesBound: Ember.computed( function() {
    return Ember.run.bind(this, this.updateCables)
  }),
  updateBaselineBound: Ember.computed( function() {
    return Ember.run.bind(this, this.updateBaseline)
  }),
  style:Ember.computed('transformX', 'transformY', 'svgOpacity', function () {
    var style = ''
    var x = this.get('transformX')
    var y = this.get('transformY')
    style += `transform: translate(${x}px,${y}px);`
    style += `opacity: ${this.get('svgOpacity')}`
    return Ember.String.htmlSafe(style);
  }),
  initDraggable: initDraggable,
  init: function () {
    this._super()
  },

  didInsertElement() {
    Ember.run.next(this,function(){
      document.onmousemove = document.onmousemove || this.updateInputPosition;
      this.initSVGDocument()
      // this.initZooming()
      this.initPaning()
      this.initNodesGroup()
      this.filterEntities()
    })
  },

  initNodesGroup: function () {
    this.nodesGroup = new NodesGroup({
      draw : this.draw,
      entityModel : this.get('simulation.entities'),
      outputModel : this.get('simulation.outputs'),

      entityComponents : this.entityComponents,
      outputComponents : this.outputComponents,

      updateSVGOpacity : this.updateSVGOpacity.bind(this),
    })
  },

  updateSVGOpacity: function (opacity) {
    this.set('svgOpacity', opacity)
  },

  filterEntities: function () {

    var branchId = this.get('branch')
    var serviceId = this.get('service')
    var simulation = this.get('simulation')

    var entities

    if (!branchId && !serviceId) {
      // show the branches
      var branches = _.filter(simulation.entities, function (entity) {
        if ( entity.attributes[0] === 'branch' ) {
          entity.branch = true
          return true
        }
      })
      entities = branches
    } else if (branchId && !serviceId) {
      // show the services relating to the branch
      var branch = _.find(simulation.entities, function (entity) {
        return entity.id == branchId
      })
      var services = simTraversal.getChildrenOfEntity({
        entity : branch,
        simulation : simulation
      })
      _.forEach(services, function (s) { s.service = true })
      entities = services
    } else if (branchId && serviceId) {
      var service = _.find(simulation.entities, function (entity) {
        return entity.id == serviceId
      })
      var entities = simTraversal.getChildrenOfEntity({
        entity : service,
        simulation : simulation
      })
    }

    this.replaceArrayContent(this.selectedEntities, entities)

    var outputs = this.findOutputsFromEntities(entities)
    this.replaceArrayContent(this.selectedOutputs, outputs) // hack.

    Ember.run.next(this, this.resetNodesgroup)

  }.observes('branch','service'),

  findOutputsFromEntities: function (entities) {
    var outputs = this.get('simulation.outputs')
    var requiredOutputEndpoints = []
    _.forEach(entities, function (entity) {
      _.forEach(entity.outputs, function (output) {
        _.forEach(output.endpoints, function (endpoint) {
          if ( endpoint.sim_output ) {
            requiredOutputEndpoints.push(endpoint.sim_output)
          }
        })
      })
    })
    var selectedOutputs = []
    _.forEach(outputs, function (output) {
      _.forEach(output.inputs, function (input) {
        if ( _.includes(requiredOutputEndpoints, input.id) ) {
          selectedOutputs.push( output )
        }
      })
    })
    return _.uniqWith(selectedOutputs, _.isEqual)
  },

  resetNodesgroup: function () {
    var counter = 0

    this.reCentreDraggableBackground()

    if (Object.keys( this.entityComponents ).length + Object.keys( this.outputComponents ).length === this.selectedEntities.length + this.selectedOutputs.length ) {
      this.nodesGroup.clearNodesAndBuildNewNodes()
      this.nodesGroup.initCables()
      this.updateCablesForAllNodes()

    } else if ( counter < 100 ) {
      counter ++
      Ember.run.next(this, this.resetNodesgroup)
    }
  }.observes('entityComponents', 'outputComponents'),

  reCentreDraggableBackground: function () {
    this.set('transformX', 0)
    this.set('transformY', 0)
  },

  buildSVGNodes: function () {

    var self = this

    console.log(Object.keys( this.entityComponents ).length, Object.keys( this.outputComponents ).length, this.selectedEntities.length, this.selectedOutputs.length )
    if (Object.keys( this.entityComponents ).length + Object.keys( this.outputComponents ).length === this.selectedEntities.length + this.selectedOutputs.length ) {
      this.nodesGroup = new NodesGroup({
        draw : this.draw,
        entityModel : self.get('selectedEntities'),
        outputModel : self.get('selectedOutputs'),
        persistPosition : self.persistPosition
      })
      this.nodesGroup.buildNodes({
        entityComponents : this.entityComponents,
        outputComponents : this.outputComponents
      })
      // this.nodesGroup.initCables()
      // this.nodesGroup.terminalListners()
    } else {
      console.warn('the entity components haven\'t been built yet')
    }
  },

  replaceArrayContent: function (array, content) {
    var removedAmount = array.length
    var addedAmount = content.length
    array.length = 0
    array.push(...content)
    array.arrayContentDidChange(0, addedAmount, removedAmount)
  },

  updateNodesGroupOffsetX: function () {
    this.nodesGroup.groupOffsetX = this.get('transformX')
  }.observes('transformX'),

  updateNodesGroupOffsetY: function () {
    this.nodesGroup.groupOffsetY = this.get('transformY')
  }.observes('transformY'),

  updateBaseline: function (opts) {
    var self = this

    var propertyId = opts.propertyId
    var entityId = opts.entityId
    var value = opts.value
    var month = opts.month
    var baseline = this.get('baseline')

    var newAction = {
      "op": ":=",
      "operand_1": {
        "type": "Entity",
        "params": [ entityId ],
        "props": null
      },
      "operand_2": {
        "type": "Property",
        "params": [ propertyId, value ],
        "props": null
      }
    }

    // first, look in the baseline for an event that matches the month.
    var events = baseline.events
    // var events = _.cloneDeep(baseline.events)
    /*jshint eqeqeq: true */
    var foundEvents = _.filter(events, function (e) { return e.time == month } )

    if (foundEvents.length > 1) { this.warn(foundEvents.length, 'event') }

    var foundEvent = foundEvents[0]

    var event, request
    if (foundEvent) {
      event = foundEvent
      _.remove(event.actions, function (action) { // filter out any supurfelous actions
        /*jshint eqeqeq: true */
        return (action.operand_1.params[0] == newAction.operand_1.params[0] && action.operand_2.params[0] == newAction.operand_2.params[0])
      })

      event.actions.push(newAction)

      request = putJSON({
        data : event,
        url : `api/events/${event.id}/`
      })

    } else {
      // if event not exists, create new event with action
      event = {
        "scenario": "http://192.168.99.100:8000/api/scenarios/" + baseline.id + '/',
        "time": String(month),
        "actions": [ newAction ]
      }
      // do a post request
      request = postJSON({
        data : event,
        url : `api/events/`
      })
    }
    request.then(function () { self.loadBaseline() })
    return request
  },

  warn: function (amount, subject) { console.warn( `there are ${amount} ${subject}s returned in this case. There should only be 1.` ) },

  loadBaseline: function () {
    var self = this
    var id = this.simulation.id
    Ember.$.getJSON("api/scenarios/").then(function (scenarios) {

      var baseline = scenarioInteractions.findBaseline({
        scenarios : scenarios,
        simulationId : id
      })

      if (baseline) {
        self.set('baseline', baseline)
      } else {
        var postData = {
          "name": 'baseline',
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

  sortErrors: function (opts) {
    var self = this
    var errors = {
      outputs: {},
      entities: {}
    }

    _.forEach(opts.messages, function (message) {
      var processId = message.sender.id
      var type = (message.sender.type === "Output") ? 'outputs' : 'entities'
      var entities = self.get('simulation.entities')

      _.forEach(entities, function (entity) {
        _.forEach(entity.processes, function (process) {
          if (process.id === processId) {
            if ( !errors[type][message.time] ) { errors[type][message.time] = {} }
            if ( !errors[type][message.time][entity.id] ) { errors[type][message.time][entity.id] = {} }
            errors[type][message.time][entity.id][message.message_id] = message
          }
        })
      })
    })
    self.set('errors', errors)
  },

  runSimulation: function(){
    var self = this
    var baselineId = this.baseline.id
    var sortedData = {
      'Output': {},
      'ProcessProperty': {},
      'InputConnector': {},
      'OutputConnector': {},
    }

    var timeframe = 48
    var id = this.get('simulation').id

    Ember.$.getJSON(`api/simulation-run/${id}/?steps=${timeframe}&s0=${baselineId}`).then(function (result) {

      self.set('timeframe', timeframe)

      var messages
      if (result[result.length - 1].messages) {
        messages = result.pop().messages
      }
      self.sortErrors( { messages : messages } )

      _.forEach(result, function (nodeData){
        sortedData[nodeData.type][nodeData.id] = nodeData
      })

      self.set('outputConnectorData', sortedData['OutputConnector'])
      self.set('processPropertyData', sortedData['ProcessProperty'])
      self.set('outputData', sortedData['Output'])
      self.set('inputConnectorData', sortedData['InputConnector'])

      self.updateCablesForAllNodes()

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

  initZooming: function() {
    //Lets not override scrolling till we have zoom working
    // this.element.addEventListener('wheel', function (e) {
    //   e.preventDefault()
    // })

  },

  updateCablesForAllNodes: function () {
    var self = this
    var entities = this.get('entityComponents')
    _.forEach(entities, function (entity) {
      Ember.run.next(self, function () {
        self.updateCables({
          type : entity.get('node-type'),
          id : entity.get('id'),
          groupOffsetX : entity.groupOffsetX,
          groupOffsetY : entity.groupOffsetY
        })
      })
    })
  },

  updateCables: function (opts) {
    this.nodesGroup.updateCablesForNode(opts)
  },

  resetBaseline: function () {
    var self = this
    var baseline = this.get('baseline')
    var events = baseline.events
    var amountEvents = baseline.events.length
    var deleted = 0
    _.forEach(events, function (event) {
      var req = deleteResource(`api/events/${event.id}`)
      req.then(function () {
        deleted ++
        if (deleted === amountEvents) { self.loadBaseline() }
      })
    })
  },

  // updateSelectedEntitiesAndOutputs: function (opts) {
  //   var removed = this.selectedEntities.length
  //   this.selectedEntities.length = 0
  //   this.selectedEntities.push(...opts.entities)
  //   this.selectedEntities.arrayContentDidChange(0,this.selectedEntities.length, removed)

  //   removed = this.selectedOutputs.length
  //   this.selectedOutputs.length = 0
  //   this.selectedOutputs.push(...this.get('outputs'))
  //   this.selectedOutputs.arrayContentDidChange(0,this.selectedOutputs.length, removed)

  //   this.nodesGroup.clearNodesAndBuildNewNodes({
  //     entityComponents : this.entityComponents,
  //     outputComponents : this.outputComponents
  //   })
  // },

  actions: {
    // viewService: function (entity) {
    //   console.log(entity)
    //   var childEntities = simTraversal.getChildrenOfEntity({
    //     entity : entity,
    //     simulation : this.get('simulation')
    //   })
    //   this.updateSelectedEntitiesAndOutputs({
    //     entities : childEntities
    //   })
    // },
    resetDefaults: function () {
      this.resetBaseline()
    }
  },

});

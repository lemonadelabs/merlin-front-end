import Ember from 'ember';
import NodesGroup from './nodesGroup'
import initDraggable from '../../common/draggable'
import postJSON from '../../common/post-json'
import putJSON from '../../common/put-json'

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
  updateBaselineBound: Ember.computed( function() {
    return Ember.run.bind(this, this.updateBaseline)
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
    var foundEvents = _.filter(events, function (e) { return e.time == month } )

    if (foundEvents.length > 1) { this.warn(foundEvents.length, 'event') }

    var foundEvent = foundEvents[0]

    var event, request
    if (foundEvent) {
      event = foundEvent
      _.remove(event.actions, function (action) { // filter out any supurfelous actions

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
  },

  warn: function (amount, subject) { console.warn( `there are ${amount} ${subject}s returned in this case. There should only be 1.` ) },

  loadBaseline: function () {
    var self = this
    var id = this.model.id
    var simSubstring = `api/simulations/${id}/`
    Ember.$.getJSON("api/scenarios/").then(function (scenarios) {

      var baseline = _.find(scenarios, function (scenario) {
        return  ( _.includes(scenario.sim, simSubstring) && scenario.name === 'baseline')
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
    var errors = {}

    _.forEach(opts.messages, function (message) {
      var processId = message.sender.id
      var entities = self.get('model').entities

      _.forEach(entities, function (entity) {
        _.forEach(entity.processes, function (process) {
          if (process.id === processId) {
            if ( !errors[message.time] ) { errors[message.time] = {} }
            if ( !errors[message.time][entity.id] ) { errors[message.time][entity.id] = {} }
            errors[message.time][entity.id][message.message_id] = message
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
    var id = this.get('model').id

    Ember.$.getJSON(`api/simulation-run/${id}/?steps=${timeframe}&s0=${baselineId}/`).then(function (result) {

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
      // this.nodesGroup.terminalListners()
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

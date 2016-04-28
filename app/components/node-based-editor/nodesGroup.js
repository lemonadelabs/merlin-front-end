import Cable from './cable'
import Node from './node'

export default function NodesGroup (opts) {
  this.draw = opts.draw
  this.entityModel = opts.entityModel
  this.outputModel = opts.outputModel
  this.persistPosition = opts.persistPosition
  this.entityNodes = {}
  this.outputNodes = {}
  this.outputTerminals = {}
  this.inputTerminals = {}
  this.cableParent = this.draw.nested()
  this.zoom = {
    scale: 1,
    inverseScale: 1
  }
  this.colorHash = {
    "entity-capability" : "#03DEAD",
    "entity-budget" : "#7ED321",
    "entity-fixed_asset" : "#9013FE",
    "entity-asset" : "#9013FE",
    "output-node" : "#F5A623",
    "entity-external" : "#03DEAD",
    "entity-resource" : "#4A90E2",
    "entity-external-capability" : "#03DEAD",
  }
  this.flyingCable = undefined
}

NodesGroup.prototype.terminalListners = function() {
  var self = this

  _.forEach(this.outputTerminals, outputTerminalListners)
  _.forEach(this.inputTerminals, inputTerminalListners)

  _.forEach(this.outputNodes, function (outputNode) {
    _.forEach(outputNode.inputTerminals, inputTerminalListners)
  })

  function outputTerminalListners (terminal) {
    terminal.$domElement.on('mousedown', function () {
      self.flyingCable = new Cable({
        cableParent : self.cableParent,
        outputTerminal : terminal,
        color : self.colorHash[terminal.nodeType]
      })
    })

    terminal.$domElement.on('mouseup', function () {
      console.log('mouseup!!!')
      var cable = self.flyingCable
      self.flyingCable = undefined
      if (!cable.outputTerminal) {
        cable.outputTerminal = terminal
        cable.updatePosition() // add in group offset here
        self.referenceCableInTerminals({ cable : cable })
        var cableColor = self.colorHash[terminal.nodeType]
        cable.svg.attr({stroke : cableColor})
      } else {
        cable.svg.remove()
      }
    })
  }

  function inputTerminalListners (terminal) {
    terminal.$domElement.on('mousedown', function () {
      self.flyingCable = new Cable({
        cableParent : self.cableParent,
        inputTerminal : terminal,
        color : self.colorHash[terminal.nodeType]
      })
    })
    terminal.$domElement.on('mouseup', function () {
      console.log('mouseup!!!')
      var cable = self.flyingCable
      self.flyingCable = undefined
      if (!cable.inputTerminal) {
        cable.inputTerminal = terminal
        cable.updatePosition()
        self.referenceCableInTerminals({ cable : cable })
      } else {
        cable.svg.remove()
      }
    })
  }

  $(document).on('mousemove', function (e) {
    if (self.flyingCable) {
      var mouse = {
        x : e.clientX,
        y : e.clientY
      }
      self.flyingCable.flyTo({ mouse : mouse })
    }
  })

  $(document).on('mouseup', function (e) {
    if (!(_.includes(e.target.className, 'terminal')) && self.flyingCable) {
      self.flyingCable.svg.remove()
      self.flyingCable = undefined
    }
  })

};

NodesGroup.prototype.buildNodes = function(opts) {
  var self = this

  var entityComponents = opts.entityComponents
  _.forEach(entityComponents, buildNode)

  var outputComponents = opts.outputComponents
  _.forEach(outputComponents, buildNode)

  function buildNode(component, i) {
    var id = component.get('id')
    var nodeType = component.get('node-type')
    var positionX = component.get('positionX')
    var positionY = component.get('positionY')

    var nodeModel = (nodeType === 'output-node') ? _.find(self.outputModel, ['id', id]) : _.find(self.entityModel, ['id', id])

    var node = new Node({
      id : id,
      draw : self.draw,
      component : component,
      nodeModel : nodeModel,
      nodeType : nodeType,
      positionX : positionX,
      positionY : positionY,
      itterate : i
    })

    if (_.includes(nodeType, 'entity')) {
      self.entityNodes[id] = node

      _.forEach(node.outputTerminals, function (output, id) {
        self.outputTerminals[id] = output
      })
      _.forEach(node.inputTerminals, function (input, id) {
        self.inputTerminals[id] = input
      })
    } else if (_.includes(nodeType, 'output')) {
      self.outputNodes[id] = node
    }
  }
};

NodesGroup.prototype.initCables = function() {
  var self = this

  _.forEach(this.entityNodes, function (entityDrawGroup) { // build the cables

    var nodeType = entityDrawGroup.nodeType
    var cableColor = self.colorHash[nodeType]

    _.forEach(entityDrawGroup.outputTerminals, function (outputTerminal) {

      outputTerminal.$domElement.css('background-color', cableColor)

      var endpoints = outputTerminal.endpoints
      _.forEach(endpoints, function (endpoint) {
        var inputTerminal, cable
        if (endpoint.input) {

          inputTerminal = self.inputTerminals[endpoint.input]
          inputTerminal.$domElement.css('background-color', cableColor)

          cable = new Cable({
            cableParent : self.cableParent,
            outputTerminal : outputTerminal,
            inputTerminal : inputTerminal,
            color : cableColor
          })
          self.referenceCableInTerminals({ cable : cable })
        }

        if (endpoint.sim_output) {

          var simulationOutputId = endpoint.sim_output
          inputTerminal = self.outputNodes[simulationOutputId].inputTerminals[simulationOutputId]
          inputTerminal.$domElement.css('background-color', cableColor)

          cable = new Cable({
            cableParent : self.cableParent,
            outputTerminal : outputTerminal,
            inputTerminal : inputTerminal,
            color : cableColor
          })
          self.referenceCableInTerminals({ cable : cable })
        }
      })
    })
  })
};

NodesGroup.prototype.referenceCableInTerminals = function(opts) {
  var cable = opts.cable
  var inputTerminal = cable.inputTerminal
  var inputNode
  if (_.includes(inputTerminal.nodeType, 'entity')) {
    inputNode = this.entityNodes[inputTerminal.entityId]
  } else if (_.includes(inputTerminal.nodeType, 'output')) {
    inputNode = this.outputNodes[inputTerminal.entityId]
  }

  inputNode.cables.push(cable)

  var outputTerminal = cable.outputTerminal
  var outputEntity = this.entityNodes[outputTerminal.entityId]
  outputEntity.cables.push(cable)
};


NodesGroup.prototype.updateCablesForNode = function(opts) {
  var node = (opts.type === 'output-node') ? this.outputNodes[opts.id] : this.entityNodes[opts.id]
  node.updateCables(opts)
};
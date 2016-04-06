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
  this.colorHash = {
    "entity-capability" : "#03DEAD",
    "entity-budget" : "#7ED321",
    "entity-fixed_asset" : "#9013FE",
    "output-node" : "#F5A623"
    // "entity-staff" : "#4A90E2",
    // "entity-resource" : "#9013FE",
  }
  this.flyingCable = undefined
}

NodesGroup.prototype.terminalListners = function() {
  var self = this

  var allTerminals = {}
  _.forEach(this.outputTerminals, outputTerminalListners)
  _.forEach(this.inputTerminals, inputTerminalListners)

  _.forEach(this.outputNodes, function (outputNode) {
    _.forEach(outputNode.inputTerminals, inputTerminalListners)
  })

  function outputTerminalListners (terminal) {
    terminal.$domElement.on('mousedown', function (e) {
      self.flyingCable = new Cable({
        cableParent : self.cableParent,
        outputTerminal : terminal,
        color : self.colorHash[terminal.nodeType]
      })
    })

    terminal.$domElement.on('mouseup', function (e) {
      console.log('mouseup!!!')
      var cable = self.flyingCable
      self.flyingCable = undefined
      if (!cable.outputTerminal) {
        cable.outputTerminal = terminal
        cable.updatePosition()
        self.referenceCableInTerminals({ cable : cable })
        var cableColor = self.colorHash[terminal.nodeType]
        cable.svg.attr({stroke : cableColor})
      } else {
        cable.svg.remove()
      }
    })
  }

  function inputTerminalListners (terminal) {
    terminal.$domElement.on('mousedown', function (e) {
      self.flyingCable = new Cable({
        cableParent : self.cableParent,
        inputTerminal : terminal,
        color : self.colorHash[terminal.nodeType]
      })
    })
    terminal.$domElement.on('mouseup', function (e) {
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


    var nodeModel = (nodeType === 'output-node') ? _.find(self.outputModel, ['id', id]) : _.find(self.entityModel, ['id', id])
    var entityData = _.find(self.entityModel, ['id', id])

    var node = new Node({
      id : id,
      draw : self.draw,
      component : component,
      nodeModel : nodeModel,
      nodeType : nodeType
    })

    node.position({itterate : i}) // move this into Node once positioning is enabled

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


    _.forEach(entityDrawGroup.outputTerminals, function (outputTerminal, id) {

      outputTerminal.$domElement.css('background-color', cableColor)

      var endpoints = outputTerminal.endpoints
      _.forEach(endpoints, function (endpoint) {
        if (endpoint.input) {

          var inputTerminal = self.inputTerminals[endpoint.input]
          inputTerminal.$domElement.css('background-color', cableColor)

          var cable = new Cable({
            cableParent : self.cableParent,
            outputTerminal : outputTerminal,
            inputTerminal : inputTerminal,
            color : cableColor
          })
          self.referenceCableInTerminals({ cable : cable })
        }

        if (endpoint.sim_output) {

          var simulationOutputId = endpoint.sim_output
          var inputTerminal = self.outputNodes[simulationOutputId].inputTerminals[simulationOutputId]
          inputTerminal.$domElement.css('background-color', cableColor)

          var cable = new Cable({
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
  if (_.includes(inputTerminal.nodeType, 'entity')) {
    var inputNode = this.entityNodes[inputTerminal.entityId]
  } else if (_.includes(inputTerminal.nodeType, 'output')) {
    var inputNode = this.outputNodes[inputTerminal.entityId]
  }

  inputNode.cables.push(cable)

  var outputTerminal = cable.outputTerminal
  var outputEntity = this.entityNodes[outputTerminal.entityId]
  outputEntity.cables.push(cable)
};

NodesGroup.prototype.initDraggable = function() {
  var self = this
  _.forEach(this.entityNodes, addListners)
  _.forEach(this.outputNodes, addListners)

  function addListners(node) {
    var $entityComponent = node.$component
    var $dragBar = $entityComponent.find('.node-drag-bar')

    $dragBar.on('mouseenter', function () {
      node.group.draggable()
    })

    $dragBar.on('mouseleave', function () {
      node.group.draggable(false)
    })

    node.group.on('dragmove', function (e) {
      node.updateCables()
    })

    node.group.on('dragend', function (e) {
      var id = node.id
      var nodeType = node.nodeType
      var x = node.group.x()
      var y = node.group.y()
      self.persistPosition({
        x : x,
        y : y,
        nodeType : nodeType,
        id : id
      })
    })


  }
};
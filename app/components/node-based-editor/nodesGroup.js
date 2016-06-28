import Ember from 'ember';
import Cable from './cable'
import Node from './node'
import * as simTraverse from '../../common/simulation-traversal'

export default function NodesGroup (opts) {
  this.simulation = opts.simulation
  this.draw = opts.draw
  this.entityModel = opts.entityModel
  this.outputModel = opts.outputModel

  this.entityComponents = opts.entityComponents
  this.outputComponents = opts.outputComponents

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
        color : self.colorHash[terminal.nodeType],
        groupOffsetX : self.groupOffsetX,
        groupOffsetY : self.groupOffsetY
      })
    })

    terminal.$domElement.on('mouseup', function () {
      var cable = self.flyingCable
      self.flyingCable = undefined
      if (!cable.outputTerminal) {
        cable.outputTerminal = terminal
        cable.updatePosition({
          groupOffsetX : self.groupOffsetX,
          groupOffsetY : self.groupOffsetY
        })
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
        color : self.colorHash[terminal.nodeType],
        groupOffsetX : self.groupOffsetX,
        groupOffsetY : self.groupOffsetY
      })
    })

    terminal.$domElement.on('mouseup', function () {
      console.log('mouseup!!!')
      var cable = self.flyingCable
      self.flyingCable = undefined
      if (!cable.inputTerminal) {
        cable.inputTerminal = terminal

        cable.updatePosition({
          groupOffsetX : self.groupOffsetX,
          groupOffsetY : self.groupOffsetY
        })
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
      self.flyingCable.flyTo({
        mouse : mouse,
        groupOffsetX : self.groupOffsetX,
        groupOffsetY : self.groupOffsetY
      })
    }
  })

  $(document).on('mouseup', function (e) {
    if (!(_.includes(e.target.className, 'terminal')) && self.flyingCable) {
      self.flyingCable.svg.remove()
      self.flyingCable = undefined
    }
  })
};

NodesGroup.prototype.resetGroup = function() {
  this.hideCables()
  this.entityNodes = {}
  this.outputNodes = {}
  this.outputTerminals = {}
  this.inputTerminals = {}
  this.cableParent.clear()
};

NodesGroup.prototype.hideCables = function() {
  var svgContainer = document.getElementById('svg-container')
  var $svgContainer = $(svgContainer)
  $svgContainer.addClass('notransition'); // Disable transitions
  svgContainer.style.opacity = '0'
  $svgContainer[0].offsetHeight; // Trigger a reflow, flushing the CSS changes
  $svgContainer.removeClass('notransition'); // Re-enable transitions
};

NodesGroup.prototype.clearNodesAndBuildNewNodes = function(opts) {
  this.resetGroup()
  this.buildNodes(opts)
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

          var simoutputconnectorId = endpoint.sim_output

          var simOutput = simTraverse.findSimoutputFromSimoutputconnectorId({
            simoutputconnectorId : simoutputconnectorId,
            simOutputs : self.outputModel
          })

          inputTerminal = self.outputNodes[simOutput.id].inputTerminals[simOutput.id]
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
  if ( node ) { node.updateCables(opts) }

};

NodesGroup.prototype.buildNodes = function(opts) {
  var self = this

  var entityComponents = this.entityComponents
  var outputComponents = this.outputComponents

  var counter = 0

  _.forEach(entityComponents, function (component) {
    self.buildNode(component, counter)
    component.set('hidden', false)
    counter ++
  })

  _.forEach(outputComponents, function (component, id) {
    self.buildNode(component, counter)
    component.set('hidden', false)
    counter ++
  })

  Ember.run.later( this, function () { document.getElementById('svg-container').style.opacity = '1' }, 300 )

};

NodesGroup.prototype.buildNode = function(component, i) {
  var self = this
  var id = component.get('id')
  var nodeType = component.get('node-type')
  var positionX = component.get('positionX')
  var positionY = component.get('positionY')

  if ( !component.get('entity.display_pos_x') ) { component.set('transformX', 60 * i + 40) }
  if ( !component.get('entity.display_pos_y') ) { component.set('transformY', 40 * i + 40) }

  var nodeModel = (nodeType === 'output-node') ? _.find(this.outputModel, ['id', id]) : _.find(this.entityModel, ['id', id])

  var node = new Node({
    id : id,
    draw : this.draw,
    component : component,
    nodeModel : nodeModel,
    nodeType : nodeType,
  })

  if (_.includes(nodeType, 'entity')) {
    this.entityNodes[id] = node

    _.forEach(node.outputTerminals, function (output, id) {
      self.outputTerminals[id] = output
    })
    _.forEach(node.inputTerminals, function (input, id) {
      self.inputTerminals[id] = input
    })
  } else if (_.includes(nodeType, 'output')) {
    this.outputNodes[id] = node
  }

};
function buildNode(component, i) {
  var id = component.get('id')
  var nodeType = component.get('node-type')
  var positionX = component.get('positionX')
  var positionY = component.get('positionY')

  if ( !component.get('entity.display_pos_x') ) { component.set('transformX', 60 * i + 40) }
  if ( !component.get('entity.display_pos_y') ) { component.set('transformY', 40 * i + 40) }

  var nodeModel = (nodeType === 'output-node') ? _.find(self.outputModel, ['id', id]) : _.find(self.entityModel, ['id', id])

  var node = new Node({
    id : id,
    draw : self.draw,
    component : component,
    nodeModel : nodeModel,
    nodeType : nodeType,
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

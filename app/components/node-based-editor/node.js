/**
* @class Node
* @param {Object} opts
*   @param {Object} opts.id
*   @param {Object} opts.draw
*   @param {Object} opts.component
*   @param {Object} opts.nodeModel
*   @param {Object} opts.nodeType
*/

export default function Node (opts) {
  this.id = opts.id
  this.nodeType = opts.nodeType
  this.group = opts.draw.group()
  this.cables = []

  this.component = opts.component
  this.$component = Ember.$(opts.component.element)
  this.inputTerminals = this.findInputTerminals(opts)

  if (opts.nodeModel.outputs) { this.outputTerminals = this.findOutputTerminals( { outputs : opts.nodeModel.outputs} ) }
}

/**
* finds the input terminals for a node, and packages them in an object with the terminal id as the key
*
* @method findInputTerminals
* @param {Object} opts
*   @param {Number} opts.id
*   @param {Object} opts.draw
*   @param {Object} opts.component
*   @param {Object} opts.nodeModel
*   @param {string} opts.nodeType

* @return {Object} object of input terminal objects
*/
Node.prototype.findInputTerminals = function(opts) {
  var self = this
  var inputs = {}
  var inputsData = opts.nodeModel.inputs
  if (opts.nodeType === 'output-node') {
    var symOutputId = opts.id
    var $terminal = self.$component.find(`#${symOutputId}.terminal.input-terminal.sim-output-terminal`)
    inputs[opts.id] = {
      $domElement : $terminal,
      entityId : symOutputId,
      nodeType : self.nodeType,
      terminalType : 'input'
    }
  } else if (!_.isEmpty(inputsData)) {
    _.forEach(inputsData, function (input) {

      var $terminal = self.$component.find(`#${input.id}.terminal.input-terminal`)
      inputs[input.id] = {
        $domElement : $terminal,
        entityId : self.id,
        nodeType : self.nodeType,
        terminalType : 'input'
      }
    })
  }
  return inputs
}

/**
* finds the output terminals for a node, and packages them in an object with the terminal id as the key
*
* @method findOutputTerminals
* @param {Object} opts
*   @param {Array} opts.outputs
* @return {Object} object of output terminal objects
*/
Node.prototype.findOutputTerminals = function(opts) {
  var self = this
  var outputs = {}
  _.forEach(opts.outputs, function (output) {
    var $terminal = self.$component.find(`#${output.id}.terminal.output-terminal`)
    outputs[output.id] = {
      $domElement : $terminal,
      endpoints : output.endpoints,
      entityId : self.id,
      nodeType : self.nodeType,
      terminalType : 'output'
    }
  })
  return outputs
}

Node.prototype.updateCables = function(opts) {
  _.forEach(this.cables, function (cable) {
    cable.updatePosition(opts)
  })
};

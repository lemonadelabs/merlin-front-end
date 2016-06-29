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

Node.prototype.findInputTerminals = function(opts) {
  var self = this
  var inputs = {}
  var inputsData = opts.nodeModel.inputs
  _.forEach(inputsData, function (input) {
    var $terminal = self.$component.find(`#${input.id}.terminal.input-terminal`)
    inputs[input.id] = {
      $domElement : $terminal,
      entityId : self.id,
      nodeType : self.nodeType,
      terminalType : 'input'
    }
  })
  return inputs
}

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

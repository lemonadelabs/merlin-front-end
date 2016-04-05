
export default function Node (opts) {
  this.id = opts.id
  this.nodeType = opts.nodeType
  this.group = opts.draw.group()
  this.cables = []

  this.$component = Ember.$(opts.component.element)
  this.footprint = this.buildFoorprint()
  this.componentObject = this.appendComponent({component : opts.component})
  this.inputTerminals = this.findInputTerminals({ inputs : opts.entityData.inputs})
  this.outputTerminals = this.findOutputTerminals({ outputs : opts.entityData.outputs})
}


Node.prototype.buildFoorprint = function() {
  var width = 180
  // var width = $('.entity-node.2').width() + 20
  var height = 20
  // var height = $('.entity-node.2').height()
  var footprint = this.group.rect(width, height)
  return footprint
};

Node.prototype.findInputTerminals = function(opts) {
  if (!_.isEmpty(opts.inputs)) {
    var self = this
    var inputs = {}
    _.forEach(opts.inputs, function (input, type) { // todo: make these place themselves dynamicly
      var $terminal = self.$component.find(`#${input.id}.terminal.input-terminal`)
      inputs[input.id] = {
        $domElement : $terminal,
        type : type,
        entityId : self.id,
        nodeType : self.nodeType,
        terminalType : 'input'
      }
    })
    return inputs
  }
}

Node.prototype.findOutputTerminals = function(opts) {
  if (!_.isEmpty(opts.outputs)) {
    var self = this
    var outputs = {}
    _.forEach(opts.outputs, function (output, type) { // todo: make these place themselves dynamicly
      var $terminal = self.$component.find(`#${output.id}.terminal.output-terminal`)
      outputs[output.id] = {
        $domElement : $terminal,
        type : type,
        endpoints : output.endpoints,
        entityId : self.id,
        nodeType : self.nodeType,
        terminalType : 'output'
      }
    })
  }
  return outputs
}

Node.prototype.appendComponent = function(opts) {
  var foreignObj = this.group.foreignObject(200,1000).attr({id: 'component'}) // size hack to fix safari css bug
  foreignObj.appendChild(opts.component.element)
  return foreignObj
};

Node.prototype.position = function(opts) {
  this.group.translate( ((260 * opts.itterate) + 30 ), 0)
  // this.group.translate( ((-260 * opts.itterate) + 900 ), ((160 * opts.itterate) + 50 ))
};


Node.prototype.updateCables = function(opts) {
  _.forEach(this.cables, function (cable) {
    cable.updatePosition()
  })
};

import Cable from './cable'

export default function EntityDrawGroup (opts) {
  this.id = opts.id
  this.group = opts.draw.group()
  this.cables = []

  this.componentObject = this.appendComponent({component : opts.component})
  this.inputTerminals = this.findInputTerminals({ inputs : opts.entityData.inputs})
  this.outputTerminals = this.findOutputTerminals({ outputs : opts.entityData.outputs})
}


EntityDrawGroup.prototype.findInputTerminals = function(opts) {
  var self = this

  var inputs = {}
  if (!_.isEmpty(opts.inputs)) {
    var amountInputs = _.size(opts.inputs)
    var counter = 1
    _.forEach(opts.inputs, function (input, type) { // todo: make these place themselves dynamicly
      var terminal = self.group.rect(15, 15).attr({ fill: '#790AC7' }).translate(-15,40 * counter)
      var $terminal = Ember.$(`.terminal.input-terminal#${input.id}`)
      inputs[input.id] = {
        svg : terminal,
        domElement : $terminal,
        type : type,
        entityId : self.id
      }
      counter ++
    })
  }
  return inputs
}

EntityDrawGroup.prototype.findOutputTerminals = function(opts) {
  var self = this

  var outputs = {}
  if (!_.isEmpty(opts.outputs)) {
    var amountoutputs = _.size(opts.outputs)
    var counter = 1

    _.forEach(opts.outputs, function (output, type) { // todo: make these place themselves dynamicly
      var terminal = self.group.rect(15, 15).attr({ fill: '#790AC7' }).translate(160,40 * counter)
      outputs[output.id] = {
        svg : terminal,
        type : type,
        endpoints : output.endpoints,
        entityId : self.id
      }
      counter ++
    })
  }
  return outputs
}

EntityDrawGroup.prototype.appendComponent = function(opts) {
  var foreignObj = this.group.foreignObject(200,1000).attr({id: 'component'}) // size hack to fix safari css bug
  foreignObj.appendChild(opts.component.element)
  return foreignObj
};

EntityDrawGroup.prototype.position = function(opts) {
  this.group.translate( ((260 * opts.itterate) + 30 ), ((160 * opts.itterate) + 30 ))
};


EntityDrawGroup.prototype.updateCables = function(opts) {
  _.forEach(this.cables, function (cable) {
    cable.updatePosition()
  })
};

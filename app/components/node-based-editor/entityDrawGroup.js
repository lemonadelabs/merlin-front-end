import Cable from './cable'

export default function EntityDrawGroup (opts) {
  this.id = opts.id
  this.entityType = opts.entityType
  this.group = opts.draw.group()
  this.cables = []

  this.footprint = this.buildFoorprint()
  this.componentObject = this.appendComponent({component : opts.component})
  this.inputTerminals = this.findInputTerminals({ inputs : opts.entityData.inputs})
  this.outputTerminals = this.findOutputTerminals({ outputs : opts.entityData.outputs})
}


EntityDrawGroup.prototype.buildFoorprint = function() {
  var width = 180
  // var width = $('.entity-node.2').width() + 20
  var height = 20
  // var height = $('.entity-node.2').height()
  var footprint = this.group.rect(width, height)
  return footprint
};

EntityDrawGroup.prototype.findInputTerminals = function(opts) {
  var self = this

  var inputs = {}
  if (!_.isEmpty(opts.inputs)) {
    var amountInputs = _.size(opts.inputs)
    var counter = 1
    _.forEach(opts.inputs, function (input, type) { // todo: make these place themselves dynamicly
      var $terminal = Ember.$(`.terminal.input-terminal#${input.id}`)
      inputs[input.id] = {
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

      var $terminal = Ember.$(`.terminal.output-terminal#${output.id}`)
      outputs[output.id] = {
        domElement : $terminal,
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
  // this.group.translate( ((260 * opts.itterate) + 30 ), ((160 * opts.itterate) + 30 ))
  this.group.translate( ((-260 * opts.itterate) + 900 ), ((160 * opts.itterate) + 50 ))
};


EntityDrawGroup.prototype.updateCables = function(opts) {
  _.forEach(this.cables, function (cable) {
    cable.updatePosition()
  })
};

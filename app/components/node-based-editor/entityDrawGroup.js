export default function EntityDrawGroup (opts) {
  this.id = opts.id
  this.group = opts.draw.group()
  this.cables = []

  this.footprint = this.group.rect(160, 120).attr({ fill: '#ddd' })
  this.dragRect = this.buildDraggableRect()
  this.addDragListners()
  this.componentObject = this.appendComponent({component : opts.component})
  this.inputTerminals = this.buildInputTerminals({ inputs : opts.entityData.inputs})
  this.outputTerminals = this.buildOutputTerminals({ outputs : opts.entityData.outputs})
}


EntityDrawGroup.prototype.buildInputTerminals = function(opts) {
  var self = this

  var inputs = {}
  if (!_.isEmpty(opts.inputs)) {
    var amountInputs = _.size(opts.inputs)
    var counter = 1
    _.forEach(opts.inputs, function (input, type) { // todo: make these place themselves dynamicly
      var terminal = self.group.rect(15, 15).attr({ fill: '#790AC7' }).translate(-15,40 * counter)
      inputs[input.id] = {
        svg : terminal,
        type : type,
        entityId: self.id
      }
      counter ++
    })
  }
  return inputs
}

EntityDrawGroup.prototype.buildOutputTerminals = function(opts) {
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
        endpoints: output.endpoints
      }
      counter ++
    })
  }
  return outputs
}

EntityDrawGroup.prototype.appendComponent = function(opts) {
  var foreignObj = this.group.foreignObject().attr({id: 'component'})
  foreignObj.translate(0,20)
  foreignObj.appendChild(opts.component.element)
  return foreignObj
};

EntityDrawGroup.prototype.buildDraggableRect = function() {
  return this.group.rect(160, 20).attr({ fill: '#999' })
};

EntityDrawGroup.prototype.addDragListners = function() {
  var self = this

  $(this.dragRect.node).on('mouseenter', function () {
    self.group.draggable()
  })

  Ember.$(this.dragRect.node).on('mouseleave', function () {
    self.group.draggable(false)
  })

};
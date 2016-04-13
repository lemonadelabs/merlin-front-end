
export default function Node (opts) {
  var self = this
  this.id = opts.id
  this.nodeType = opts.nodeType
  this.group = opts.draw.group()
  this.cables = []

  this.$component = Ember.$(opts.component.element)
  this.position( { itterate : opts.itterate } )
  // this.footprint = this.buildFoorprint()
  // this.componentObject = this.appendComponent({component : opts.component})
  // setTimeout(function () {
  this.inputTerminals = this.findInputTerminals(opts)
  // }, 1000)

  if (opts.nodeModel.outputs) { this.outputTerminals = this.findOutputTerminals( { outputs : opts.nodeModel.outputs} ) }
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

Node.prototype.findOutputTerminals = function(opts) {
  // if (!_.isEmpty(opts.outputs)) {
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
  // }
  return outputs
}

// Node.prototype.appendComponent = function(opts) {
//   var foreignObj = this.group.foreignObject(200,1000).attr({id: 'component'}) // size hack to fix safari css bug
//   foreignObj.appendChild(opts.component.element)
//   return foreignObj
// };

Node.prototype.position = function(opts) {
  // this.group.translate( ((260 * opts.itterate) + 30 ), 0)
  this.$component.css({
    'transform' : `translateX(${ 400 * opts.itterate  + 40}px)`
  })

};


Node.prototype.updateCables = function(opts) {
  _.forEach(this.cables, function (cable) {
    cable.updatePosition()
  })
};

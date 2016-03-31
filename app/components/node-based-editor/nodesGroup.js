import Cable from './cable'
import EntityDrawGroup from './entityDrawGroup'

export default function NodesGroup (opts) {
  this.draw = opts.draw
  this.entityModel = opts.entityModel
  this.entityDrawGroups = {}
  this.outputTerminals = {}
  this.inputTerminals = {}
  this.cableParent = this.draw.nested()
  this.colorHash = {
    "entity-budget" : "#7ED321",
    "entity-staff" : "#4A90E2",
    "entity-resource" : "#9013FE"
  }
  this.flyingCable = undefined
}

NodesGroup.prototype.outputTerminalListners = function() {
  var self = this

  var allTerminals = {}
  _.forEach(this.outputTerminals, collectTerminals)
  _.forEach(this.inputTerminals, collectTerminals)
  function collectTerminals (terminal, id) {
    allTerminals[id] = terminal
  }

  _.forEach( allTerminals, function (terminal) {
    terminal.$domElement.on('mousedown', function (e) {
      self.flyingCable = new Cable({
        cableParent : self.cableParent,
        outputTerminal : terminal,
        color : "#4A90E2"
      })
    })

    terminal.$domElement.on('mouseup', function (e) {
      console.log('mouseup!!!')
      var cable = self.flyingCable
      self.flyingCable = undefined
      cable.inputTerminal = terminal
      cable.updatePosition()
      self.referenceCableInTerminals({ cable : cable })
    })

  })

  $(document).on('mousemove', function (e) {
    if (self.flyingCable) {
      var end = {
        x : e.clientX,
        y : e.clientY
      }
      self.flyingCable.flyTo({ end : end })
    }
  })

  $(document).on('mouseup', function (e) {
    if (!(_.includes(e.target.className, 'terminal'))) {
      console.log(e.target.className)
      self.flyingCable.svg.remove()
      self.flyingCable = undefined
    }
  })



};

NodesGroup.prototype.buildNodes = function(opts) {
  var self = this
  var components = opts.components

  _.forEach(components, function (component, i) {
    var id = component.get('id')
    var entityType = component.get('entity-type')

    var entityDrawGroup = new EntityDrawGroup({
      id : id,
      draw : self.draw,
      component : component,
      entityData : _.find(self.entityModel, ['id', id] ),
      entityType : entityType
    })
    self.entityDrawGroups[id] = entityDrawGroup

    entityDrawGroup.position({itterate : i})

    _.forEach(entityDrawGroup.outputTerminals, function (output, id) {
      self.outputTerminals[id] = output
    })
    _.forEach(entityDrawGroup.inputTerminals, function (input, id) {
      self.inputTerminals[id] = input
    })
  })
};

NodesGroup.prototype.initCables = function() {
  var self = this

  // var entityDrawGroup = this.entityDrawGroups[2]
  _.forEach(this.entityDrawGroups, function (entityDrawGroup) { // build the cables

    var entityType = entityDrawGroup.entityType
    var cableColor = self.colorHash[entityType]

    _.forEach(entityDrawGroup.outputTerminals, function (outputTerminal, id) {

      outputTerminal.$domElement.css('background-color', cableColor)

      var endpoints = outputTerminal.endpoints
      _.forEach(endpoints, function (endpoint) {

        var inputTerminal = self.inputTerminals[endpoint.id]

        if (inputTerminal) {
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
  var inputEntity = this.entityDrawGroups[inputTerminal.entityId]
  inputEntity.cables.push(cable)

  var outputTerminal = cable.outputTerminal
  var outputEntity = this.entityDrawGroups[outputTerminal.entityId]
  outputEntity.cables.push(cable)

};

NodesGroup.prototype.initDraggable = function() {
  var self = this
  _.forEach(this.entityDrawGroups, function (entityDrawGroup) {

    var $dragBar = Ember.$(entityDrawGroup.componentObject.node).find('.entity-drag-bar')

    $dragBar.on('mouseenter', function () {
      entityDrawGroup.group.draggable()
    })

    $dragBar.on('mouseleave', function () {
      entityDrawGroup.group.draggable(false)
    })

    entityDrawGroup.group.on('dragmove', function (e) {
      entityDrawGroup.updateCables()
    })

  })
};
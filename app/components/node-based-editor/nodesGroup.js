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
}

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

      outputTerminal.domElement.css('background-color', cableColor)

      var endpoints = outputTerminal.endpoints
      _.forEach(endpoints, function (endpoint) {

        var inputTerminal = self.inputTerminals[endpoint.id]

        if (inputTerminal) {
          inputTerminal.domElement.css('background-color', cableColor)

          var cable = new Cable({
            cableParent : self.cableParent,
            draw : self.draw,
            outputTerminal : outputTerminal,
            inputTerminal : inputTerminal,
            color : cableColor
          })

          entityDrawGroup.cables.push(cable)

          var inputEntityGroup = self.entityDrawGroups[inputTerminal.entityId]
          inputEntityGroup.cables.push(cable)
        }
      })
    })
  })
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
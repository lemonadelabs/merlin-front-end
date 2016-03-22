import EntityDrawGroup from './entityDrawGroup'

export default function NodesGroup (opts) {
  this.draw = opts.draw
  this.entityModel = opts.entityModel
  this.entityDrawGroups = {}
  this.outputTerminals = {}
  this.inputTerminals = {}
}

NodesGroup.prototype.buildNodes = function(opts) {
  var self = this
  var components = opts.components

  _.forEach(components, function (component, i) {
    var id = component.get('id')

    var entityDrawGroup = new EntityDrawGroup({
      id : id,
      draw : self.draw,
      component : component,
      entityData : _.find(self.entityModel, ['id', id] )
    })
    self.entityDrawGroups[id] = entityDrawGroup

    entityDrawGroup.group.translate( ((260 * i) + 30 ), ((160 * i) + 30 ))

    _.forEach(entityDrawGroup.outputTerminals, function (output, id) {
      self.outputTerminals[id] = output
    })
    _.forEach(entityDrawGroup.inputTerminals, function (input, id) {
      self.inputTerminals[id] = input
    })
  })
};

NodesGroup.prototype.buildCabes = function(first_argument) {

};
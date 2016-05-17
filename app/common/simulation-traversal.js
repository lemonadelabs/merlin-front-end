export function getServiceModelsFromSimulation (opts) {
  var simulation = opts.simulation
  var parentEntity = getParentEntity({ simulation : simulation})
  var serviceModels = getServiceModels({
    simulation : simulation,
    parentEntity : parentEntity
  })
  return serviceModels
}

export function getChildAttributesFromServiceModel (opts) {
  var serviceModel = opts.serviceModel
  var simulation = opts.simulation
  var children = getChildrenForServiceModel({
    simulation : simulation,
    serviceModel : serviceModel
  })
  var attributes = getAttributesFromEntities({ entities : children })
  return attributes
}

function getChildrenForServiceModel (opts) {
  var simulation = opts.simulation
  var serviceModel = opts.serviceModel
  var childrenUrls = serviceModel.children
  var ids = _.map(childrenUrls, getIdFromUrl)
  var childEntities = _.filter(simulation.entities, function (entity) {
    return _.includes(ids, String(entity.id))
  })
  return childEntities
}

function getAttributesFromEntities (opts) {
  var entities = opts.entities
  var attributes = []
  _.forEach(entities, function (entity) {
    attributes.push(entity.attributes)
  })
  attributes = _.uniq( ( _.flatten( attributes ) ) )
  return attributes
}

export function filterEntitiesByAttribute (opts) {
  var attribute = opts.attribute
  var entities = opts.entities

  var filteredEntities = _.filter( entities, function (entity) {
    return _.includes(entity.attributes, attribute)
  })
  return filteredEntities
}

export function getProcessPropertiesFromEntity (opts) {
  var entity = opts.entity
  var processProperties = _.map(entity.processes, function (process) {
    return process.properties
  })
  processProperties = _.flatten(processProperties)
  return processProperties
}

function getParentEntity (opts) {
  var simulation = opts.simulation
  var parentEntity = _.find(simulation.entities, function (entity) {
    return entity.parent === null
  })
  return parentEntity
}

function getServiceModels (opts) {
  var simulation = opts.simulation
  var parentEntity = opts.parentEntity

  var serviceModels = []
  _.forEach(parentEntity.children, function (childUrl) {
    var childId = getIdFromUrl(childUrl)
    var serviceModel = _.find(simulation.entities, function (entity) {
      return entity.id == childId
    })
    serviceModels.push(serviceModel)
  })
  return serviceModels
}


function getIdFromUrl(url) {
  var slashless = url.slice(0, -1)
  var id = slashless.substring(slashless.lastIndexOf('/') + 1, slashless.length)
  return id
}
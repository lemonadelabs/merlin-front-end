/////////////////////////////////////////////////////////////////////////
////////////////////////////////// API //////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/**
* for extracting information from merlin simulations
* @module simulation-traversal
*/


/**
* @method getChildrenOfEntity
* @param {Object} opts
*   @param {Object} opts.entity
*   @param {Object} opts.simulation
* @return {Array} array of entities
*/
export function getChildrenOfEntity (opts) {
  var entity = opts.entity
  var simulation = opts.simulation
  var entities = simulation.entities
  var childIds = getIdsFromChildUrls(entity.children)
  return _.filter(entities, function (entity) {
    return _.includes(childIds, entity.id)
  })

}

/**
* @method findSimoutputFromSimoutputconnectorId
* @param {Object} opts
*   @param {Number} opts.simoutputconnectorId
*   @param {Array} opts.simOutputs
* @return {Object} simulation output entity
*/
export function findSimoutputFromSimoutputconnectorId (opts) {
  var simoutputconnectorId = opts.simoutputconnectorId
  var simOutputs = opts.simOutputs

  var matchedSimoutput
  _.forEach(simOutputs, function (simOutput) {
    _.forEach(simOutput.inputs, function (input) {
      if ( input.id === simoutputconnectorId ) { matchedSimoutput = simOutput }
    })
  })
  return matchedSimoutput
}

/**
* @method getServiceModelsFromSimulation
* @param {Object} opts
*   @param {Object} opts.simulation
* @return {Array} serviceModel entities
*/
export function getServiceModelsFromSimulation (opts) { // used in 2-a-i
  var simulation = opts.simulation
  var parentEntity = getParentEntity({ simulation : simulation})
  var serviceModels = getServiceModels({
    simulation : simulation,
    parentEntity : parentEntity
  })
  return serviceModels
}

/**
* returns attributes of the children of the service model
* @method getChildAttributesFromServiceModel
* @param {Object} opts
*   @param {Object} opts.serviceModel
*   @param {Object} opts.simulation
* @return {Array}
*/
export function getChildAttributesFromServiceModel (opts) { // used in 2-a-ii
  var serviceModel = opts.serviceModel
  var simulation = opts.simulation
  var children = getChildrenForServiceModel({
    simulation : simulation,
    serviceModel : serviceModel
  })
  var attributes = getAttributesFromEntities({ entities : children })
  return attributes
}

/**
* @method getChildEntitiesByAttribute
* @param {Object} opts
*   @param {Object} opts.simulation
*   @param {Object} opts.serviceModel
*   @param {String} opts.attribute
* @return {Array} Entities
*/
export function getChildEntitiesByAttribute(opts){ //used by haircut
  var simulation = opts.simulation
  var serviceModel = opts.serviceModel
  var attribute = opts.attribute
  var childEntities = getChildrenForServiceModel(
    {
      'simulation':simulation,
      'serviceModel':serviceModel}
    )
  var filteredEntities = filterEntitiesByAttribute({'entities':childEntities,'attribute':attribute})
  return filteredEntities
}

/**
* @method filterEntitiesByAttribute
* @param {Object} opts
*   @param {String} opts.attribute
*   @param {Array} opts.entities
* @return {Array} entities
*/
export function filterEntitiesByAttribute (opts) {  // used in 2-a-iii
  var attribute = opts.attribute
  var entities = opts.entities

  var filteredEntities = _.filter( entities, function (entity) {
    return _.includes(entity.attributes, attribute)
  })
  return filteredEntities
}

/**
* @method getProcessPropertiesFromEntity
* @param {Object} opts
*   @param {Object} opts.entity
* @return {Array}
*/
export function getProcessPropertiesFromEntity (opts) {  // used in 2-a-iiii
  var entity = opts.entity
  var processProperties = _.map(entity.processes, function (process) {
    return process.properties
  })
  processProperties = _.flatten(processProperties)
  return processProperties
}

/**
* @method getIdFromUrl
* @param {String} url
* @return {String}
*/
export function getIdFromUrl(url) {
  var slashless = url.slice(0, -1)
  var id = slashless.substring(slashless.lastIndexOf('/') + 1, slashless.length)
  return id
}


/////////////////////////////////////////////////////////////////////////
//////////////////////////////// PRIVATE ////////////////////////////////
/////////////////////////////////////////////////////////////////////////

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
      /*jshint eqeqeq: true */
      return entity.id == childId
    })
    serviceModels.push(serviceModel)
  })
  return serviceModels
}

function getIdsFromChildUrls(urls) {
  return _.map(urls, function (url) {
    return Number( url.replace(/.*entities\//, '').slice(0, -1) )
  })
}
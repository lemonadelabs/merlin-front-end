import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal';
import * as merlinUtils from '../../common/merlin-utils';
import * as scenarioInteractions from '../../common/scenario-interactions'
import * as projectsTraversal from '../../common/projects-traversal'
import postJSON from '../../common/post-json'
import putJSON from '../../common/put-json'

export default Ember.Component.extend({
  classNames:['haircut-component'],
  servicesPool:[],
  scenarios:{},
  simulationData:{},
  usePlannedScenarios:true,
  scenarioOffset:0,
  didInsertElement(){
    this._super()
    Ember.run.next(this,this.setup)
  },
  setup(){
    let self = this,
        simulation = this.get('model.simulation'),
        serviceModels = simTraverse.getServiceModelsFromSimulation({simulation : simulation}),
        servicesPool = this.get('servicesPool')

    if(servicesPool.length > 0){
      servicesPool = []
    }

    _.forEach(serviceModels,function(serviceModel){
      let budgetsForService = simTraverse.getChildEntitiesByAttribute({'simulation':simulation,'serviceModel':serviceModel,'attribute':'budget'}),
          servicesPoolObject = {};

      servicesPoolObject['service'] = serviceModel;
      servicesPoolObject['budgets'] = budgetsForService;
      servicesPool.push(servicesPoolObject)
    })
    this.servicesPool.arrayContentDidChange(0, servicesPool.length, 0)
    this.loadSenario('haircut')
    .then(
      function(){
        let usePlannedScenarios = self.get('usePlannedScenarios')
        self.runSimulationWithSenario('haircut', usePlannedScenarios)
      }
    )
  },
  loadSenario: function (scenarioName) {
    var self = this
    var id = this.model.simulation.id
    var simSubstring = `api/simulations/${id}/`
    return Ember.$.getJSON("api/scenarios/").then(function (scenarios) {

      var scenario = _.find(scenarios, function (scenario) {
        return  ( _.includes(scenario.sim, simSubstring) && scenario.name === scenarioName)
      })

      if (scenario) {
        self.set(`scenarios.${scenarioName}`, scenario)
      } else {
        var postData = {
          "name": scenarioName,
          "sim": "http://127.0.0.1:8000/api/simulations/" + id + '/',
          "start_offset": 0
        }
        postJSON({
          data : postData,
          url : "api/scenarios/"
        }).then(function (scenario) {
          self.set(`scenarios.${scenarioName}`, scenario)
        })
      }
    })
  },
  runSimulationWithSenario(scenario, includeProjects){
    var self = this
    let scenarioData = this.get(`scenarios.${scenario}`)
    var projectScenarioIds = []
    if(includeProjects){
      let projects = this.get('model.projects')
      projectScenarioIds = projectsTraversal.getScenarioIds(projects)
    }
    let scenarioIds = _.concat([ scenarioData.id ], projectScenarioIds)
    let simulation_id = this.get(`model.simulation.id`)

    var url = merlinUtils.simulationRunUrl({
      scenarioIds : scenarioIds,
      simulationId : simulation_id,
      timeframe : 120
    })
    return Ember.$.getJSON(url).then(
      function(simData){
        self.set(`simulationData.${scenario}`,simData)
        self.checkForAndProcessErrors(simData);
      }
    )
  },
  checkForAndProcessErrors(simData){
    const START_YEAR = 2016
    let errors = simData[simData.length-1].messages
    let errorsByYear = {}
    let errorsByYearArray = []
    _.forEach(errors,function(error){
      let year = Math.floor(error.time/12)
       if(!errorsByYear[year]){
         errorsByYear[year] = {}
       }
      errorsByYear[year][error.message_id] = error
    })

    _.forEach(errorsByYear,function(errorForYear,key){
      let errorYearObject = {}
      errorYearObject.year = START_YEAR + Number(key);
      errorYearObject.errors = []
      _.forEach(errorForYear,function(error){
        errorYearObject.errors.push(error)
      })
      errorsByYearArray.push(errorYearObject)
    })
    this.set(`errors`,errorsByYearArray)
    // console.log(errorsByYearArray);
  },
  createCuttingEvent(scenario){
    return merlinUtils.newEventObject({"scenarioId":scenario.id, "time":1})
  },
  persistChanges(newBudgets){
    let scenario = this.get('scenarios.haircut')
    var self = this
    if(!scenario){
      return
    }
    let actions = []
    _.forEach(newBudgets,function(budget,key){
      let action = merlinUtils.createModifyProcessAction({
        entityId:budget.entity.id,
        processPropertyId: budget.entity.processes[0].properties[0].id,
        newValue:budget.value,
        oldValue:budget.entity.processes[0].properties[0].property_value,
      })
      actions.push(action)
    })

    let event = scenario.events[0]
    if(event){
      event.actions = actions
      // event put request
      putJSON({url:`api/events/${event.id}/`,data:event})
      .then(function(){
        let usePlannedScenarios = self.get('usePlannedScenarios')
        self.runSimulationWithSenario(scenario.name, usePlannedScenarios)
      })
    } else {
      event = this.createCuttingEvent(scenario)
      event.actions = actions
      // event post request
      postJSON({url:'api/events/',data:event})
      .then(function(){
        let usePlannedScenarios = self.get('usePlannedScenarios')
        self.runSimulationWithSenario(scenario.name, usePlannedScenarios)
      })
    }
  },
  updateScenarioOffset:function(offset,scenario){
    let updateScenarioObject = {
      "name": scenario.name,
      "sim": scenario.sim,
      "start_offset": offset
    },
    self = this

    putJSON({url:`api/scenarios/${scenario.id}/`,data: updateScenarioObject})
    .then(function(data){
      let usePlannedScenarios = self.get('usePlannedScenarios')
      self.runSimulationWithSenario(scenario.name, usePlannedScenarios)
    })

  },
  actions:{
    updateScenario:function(newBudgets){
      Ember.run.debounce(this,this.persistChanges,newBudgets,200)
    },
    updateScenarioOffset:function(){
      let year = this.get('yearOffset')
      let month = this.get('monthOffset')
      let scenario = this.get('scenarios.haircut')
      this.updateScenarioOffset(year+month, scenario)
    }
  },
  obvserveusePlannedScenarios: function(){
    let usePlannedScenarios = this.get('usePlannedScenarios')
    this.runSimulationWithSenario('haircut', usePlannedScenarios)
  }.observes('usePlannedScenarios')
});

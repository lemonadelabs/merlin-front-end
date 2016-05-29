import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal';
import postJSON from '../../common/post-json'
import putJSON from '../../common/put-json'

export default Ember.Component.extend({
  classNames:['haircut-component'],
  servicesPool:[],
  senarios:{},
  simulationData:{},
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
      this.set('servicesPool', [])
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
        self.runSimulationWithSenario('haircut')
      }
    )
  },
  loadSenario: function (senarioName) {
    var self = this
    var id = this.model.simulation.id
    var simSubstring = `api/simulations/${id}/`
    return Ember.$.getJSON("api/scenarios/").then(function (scenarios) {

      var senario = _.find(scenarios, function (scenario) {
        return  ( _.includes(scenario.sim, simSubstring) && scenario.name === senarioName)
      })

      if (senario) {
        self.set(`senarios.${senarioName}`, senario)
      } else {
        var postData = {
          "name": senarioName,
          "sim": "http://127.0.0.1:8000/api/simulations/" + id + '/',
          "start_offset": 0
        }
        postJSON({
          data : postData,
          url : "api/scenarios/"
        }).then(function (senario) {
          self.set(`senarios.${senarioName}`, senario)
        })
      }
    })
  },
  runSimulationWithSenario(senario){
    var self = this
    console.log(this.get(`senarios`));
    let senarioData = this.get(`senarios.${senario}`)
    let simulation_id = this.get(`model.simulation.id`)
    return Ember.$.getJSON(`api/simulation-run/${simulation_id}/?steps=120&s0=${senarioData.id}/`).then(
      function(simData){
        self.set(`simulationData.${senario}`,simData)
      }
    )
  },
});

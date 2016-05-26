import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal';

export default Ember.Component.extend({
  servicesPool:[],
  didInsertElement(){
    Ember.run.next(this,this.setup)
  },
  setup(){
    let self = this,
        simulation = this.get('simulation'),
        serviceModels = simTraverse.getServiceModelsFromSimulation({simulation : simulation}),
        servicesPool = this.get('servicesPool')
    if(servicesPool.length > 0){
      this.set('servicesPool', [])
    }

    console.log(serviceModels);

    _.forEach(serviceModels,function(serviceModel){
      console.log(serviceModel);
      let budgetsForService = simTraverse.getChildEntitiesByAttribute({'simulation':simulation,'serviceModel':serviceModel,'attribute':'budget'}),
          servicesPoolObject = {};

      servicesPoolObject['service'] = serviceModel;
      servicesPoolObject['budget'] = budgetsForService;
      servicesPool.push(servicesPoolObject)
      console.log(budgetsForService);
    })
  console.log(servicesPool);
  }
});

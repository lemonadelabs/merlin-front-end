import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal';

export default Ember.Component.extend({
  services:undefined,

  didInsertElement(){
    Ember.run.next(this,this.setup)
  },
  setup(){
    let self = this,
        simulation = this.get('simulation'),
        serviceModels = simTraverse.getServiceModelsFromSimulation({simulation : simulation})
    this.set('services', serviceModels)

    console.log(serviceModels);
    _.forEach(serviceModels,function(serviceModel){
      console.log(serviceModel);
      let budgetsForService = simTraverse.getChildEntitiesByAttribute({'simulation':simulation,'serviceModel':serviceModel,'attribute':'budget'})
      console.log(budgetsForService);
    })
  }
});

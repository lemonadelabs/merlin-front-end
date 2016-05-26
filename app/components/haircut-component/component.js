import Ember from 'ember';
import * as simTraverse from '../../common/simulation-traversal';

export default Ember.Component.extend({
  classNames:['haircut-component'],
  servicesPool:[],
  init(){
    this._super()
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

    _.forEach(serviceModels,function(serviceModel){
      let budgetsForService = simTraverse.getChildEntitiesByAttribute({'simulation':simulation,'serviceModel':serviceModel,'attribute':'budget'}),
          servicesPoolObject = {};

      servicesPoolObject['service'] = serviceModel;
      servicesPoolObject['budgets'] = budgetsForService;
      servicesPool.push(servicesPoolObject)
    })
    this.servicesPool.arrayContentDidChange(0, servicesPool.length, 0)
  }
});

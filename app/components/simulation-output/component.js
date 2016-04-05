import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['node'],
  classNameBindings:['id',"node-type"],
  id: undefined,
  "node-type": "output-node",

  didInsertElement: function () {
    this.outputNodes.push(this)
    this.outputNodes.arrayContentDidChange(this.outputNodes.length, 0, 1)
    this.set('id', this.simulationOutput.id);
  }
});

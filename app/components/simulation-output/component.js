import Ember from 'ember';
import initDraggable from '../node-based-editor/draggable'

export default Ember.Component.extend({
  classNames:['node'],
  classNameBindings:['id',"node-type"],
  attributeBindings: ['style'],
  style:Ember.computed('transformX', 'transformY' , function () {
    var x = this.get('transformX')
    var y = this.get('transformY')
    return Ember.String.htmlSafe(`transform:translate(${x}px,${y}px);`);
  }),
  initDraggable: initDraggable,
  id: undefined,
  "node-type": "output-node",
  zoom: {
    scale: 1,
    inverseScale: 1
  },

  didInsertElement: function () {
    this.outputNodes.push(this)
    this.outputNodes.arrayContentDidChange(this.outputNodes.length, 0, 1)
    this.set('id', this.simulationOutput.id);
    this.initDraggable({context : this})
  }
});

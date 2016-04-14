import Ember from 'ember';
import initDraggable from '../node-based-editor/draggable'

export default Ember.Component.extend({
  classNames:['node'],
  classNameBindings:['id',"node-type"],
  id: undefined,
  initialPosition: undefined,
  "node-type":undefined,
  zoom: {
    scale: 1,
    inverseScale: 1
  },
  initDraggable: initDraggable,

  didInsertElement: function () {
    this.nodes.push(this)
    this.nodes.arrayContentDidChange(this.nodes.length, 0, 1)
    this.set('id', this.entity.id);
    var entityType = this.entity.attributes[0] || 'unknown'
    this.set('node-type',`entity-${entityType}`);
    this.initDraggable(this)


  },

});

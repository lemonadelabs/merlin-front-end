import Ember from 'ember';
import initDraggable from '../node-based-editor/draggable'

export default Ember.Component.extend({
  classNames:['node'],
  classNameBindings:['id',"node-type"],
  attributeBindings:['style'],
  style:Ember.computed('transformX', 'transformY' , function () {
    var x = this.get('transformX')
    var y = this.get('transformY')
    return Ember.String.htmlSafe(`transform:translate(${x}px,${y}px);`);
  }),
  id: undefined,
  initialPosition: undefined,
  "node-type":undefined,
  initDraggable: initDraggable,

  didInsertElement: function () {
    this.nodes.push(this)
    this.nodes.arrayContentDidChange(this.nodes.length, 0, 1)
    this.set('id', this.entity.id);
    var entityType = this.entity.attributes[0] || 'unknown'
    this.set('node-type',`entity-${entityType}`);
    this.initDraggable({context : this})
  },

});

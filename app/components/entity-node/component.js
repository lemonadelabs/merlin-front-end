import Ember from 'ember';
import initDraggable from '../node-based-editor/draggable'
import persistPosition from '../../common/persist-position'

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
  persistPosition: persistPosition,

  didInsertElement: function () {
    this.nodes.push(this)
    this.nodes.arrayContentDidChange(this.nodes.length, 0, 1)
    this.set('id', this.entity.id);
    this.set('positionX', this.entity.display_pos_x)
    this.set('positionY', this.entity.display_pos_y)
    var entityType = this.entity.attributes[0] || 'unknown'
    this.set('node-type',`entity-${entityType}`);
    this.initDraggable({
      context : this,
      persistPosition : this.persistPosition.bind(this)
    })
  }
});

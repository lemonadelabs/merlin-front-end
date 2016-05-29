import Ember from 'ember';
import initDraggable from '../../common/draggable'
import persistPosition from '../../common/persist-position'

export default Ember.Component.extend({
  classNames:['node'],
  error:undefined,
  errorsForNode:undefined,
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
    var id = this.entity.id
    this.set('id', id);
    this.nodes[id] = this
    this.set('positionX', this.entity.display_pos_x)
    this.set('positionY', this.entity.display_pos_y)
    var entityType = this.entity.attributes[0] || 'unknown'
    if (entityType) {entityType = entityType.replace(' ', '-')}
    this.set('node-type',`entity-${entityType}`);
    this.initDraggable({
      context : this,
      persistPosition : this.persistPosition.bind(this)
    })
  },
  didDestroyElement: function () {
    var nodes = this.get('nodes')
    var id = this.get('id')
    delete nodes[id]
    this.set('nodes', nodes)
  },
  checkForErrors: function() {
    var id = this.get('id')
    var month = this.get('month')
    if (this.errors[month] && this.errors[month][id]){
      this.set('errorsForNode',this.errors[month][id])
    } else {
      this.set('errorsForNode',undefined)
    }
  }.observes('errors','month')
});

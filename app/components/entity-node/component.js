import Ember from 'ember';
import initDraggable from '../../common/draggable'
import persistPosition from '../../common/persist-position'

export default Ember.Component.extend({
  classNames:['node'],
  error:undefined,
  errorsForNode:undefined,
  classNameBindings:['id',"node-type"],
  attributeBindings:['style'],
  style:Ember.computed('transformX', 'transformY', 'hidden', function () {
    var style = ''
    var x = this.get('transformX') || this.get('entity.display_pos_x')
    var y = this.get('transformY') || this.get('entity.display_pos_y')
    style += `transform:translate(${x}px,${y}px);`;
    if (this.get('hidden')) {
      style += 'opacity: 0;'
    }
    return Ember.String.htmlSafe( style )
  }),
  hidden: true,
  id: undefined,
  initialPosition: undefined,
  "node-type":undefined,
  initDraggable: initDraggable,
  persistPosition: persistPosition,

  willInsertElement: function () {
    Ember.run.next(this,this.setupNode)
  },
  setupNode: function(){
    var id = this.get('entity.id')
    this.set('id', id);
    this.nodes[id] = this
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
  }.observes('errors','month'),

  actions: {
    updateBranch: function (entity) {
      this.set('branch', entity.id)
    },

    updateService: function (entity) {
      this.set('service', entity.id)
    },

    // viewService: function (entity) {
    //   this.sendAction('viewService', entity)
    // }
  }
});

import Ember from 'ember';
import initDraggable from '../../common/draggable'
import persistPosition from '../../common/persist-position'

export default Ember.Component.extend({
  classNames:['node'],
  classNameBindings:['id',"node-type"],
  attributeBindings: ['style'],
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
  initDraggable: initDraggable,
  persistPosition: persistPosition,
  errorsForSimOut:undefined,
  id: undefined,
  "node-type": "output-node",
  willInsertElement: function () {
    Ember.run.next(this,this.setupNode)
  },
  setupNode: function(){
    var id = this.simulationOutput.id
    this.set('id', id);
    this.outputNodes[id] = this
    this.set('positionX', this.simulationOutput.display_pos_x)
    this.set('positionY', this.simulationOutput.display_pos_y)
    this.initDraggable({
      context : this,
      persistPosition : this.persistPosition.bind(this)
    })
  },
  didDestroyElement: function () {
    var outputNodes = this.get('outputNodes')
    var id = this.get('id')
    delete outputNodes[id]
    this.set('outputNodes', outputNodes)
  },

  checkForErrors: function() {
    var id = this.get('id')
    var month = this.get('month')
    if (this.errors[month] && this.errors[month][id]){
      this.set('errorsForSimOut',this.errors[month][id])
    } else {
      this.set('errorsForSimOut',undefined)
    }
  }.observes('errors','month'),

});

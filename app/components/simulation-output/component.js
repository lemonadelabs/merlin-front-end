import Ember from 'ember';
import initDraggable from '../../common/persist-position'
import persistPosition from '../../common/persist-position'

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
  persistPosition: persistPosition,
  id: undefined,
  "node-type": "output-node",
  didInsertElement: function () {
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
});

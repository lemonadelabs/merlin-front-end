import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['entity-node'],
  classNameBindings:['id',"entity-type"],
  id: undefined,
  "entity-type":undefined,

  didInsertElement: function () {
    this.nodes.push(this)
    this.nodes.arrayContentDidChange(this.nodes.length, 0, 1)
    this.set('id',this.entity.id);
    this.set('entity-type',`entity-${this.entity.attributes[0]}`);
  }

});

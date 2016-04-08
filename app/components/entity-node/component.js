import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['node'],
  classNameBindings:['id',"node-type"],
  id: undefined,
  "node-type":undefined,

  didInsertElement: function () {
    this.nodes.push(this)
    this.nodes.arrayContentDidChange(this.nodes.length, 0, 1)
    this.set('id', this.entity.id);
    var entityType = this.entity.attributes[0] || 'unknown'
    this.set('node-type',`entity-${entityType}`);
  }

});

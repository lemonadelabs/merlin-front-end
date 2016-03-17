import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['entity-node'],
  classNameBindings:['id'],
  id: undefined,

  didInsertElement: function () {
    this.nodes.push(this)
    console.log(this)
    this.nodes.arrayContentDidChange(this.nodes.length, 0, 1)
    this.set('id',this.entity.id);
  }

});

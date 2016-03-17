import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function () {
    this.drawNode()
  },

  drawNode: function () {
    var id = this.entity.id
    // var domElement = Ember.$(`.entityy-node.${id}`)
    console.log(domElement)
  }.observes('draw')

});



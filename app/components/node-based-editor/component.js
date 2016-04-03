import Ember from 'ember';
import EntityDrawGroup from './entityDrawGroup'
import NodesGroup from './nodesGroup'

export default Ember.Component.extend({
  draw: undefined,
  entityComponents: [],
  didInsertElement() {
    this.initSVGDocument()
  },

  initSVGDocument: function () {
    var draw = SVG('svg-container').size(window.innerWidth, window.innerHeight)
    this.set('draw', draw)
  },

  buldSVGNodes: function () {
    var self = this

    if (this.entityComponents.length === this.model.entities.length) {
      this.nodesGroup = new NodesGroup({
        draw : this.draw,
        entityModel : self.get('model').entities
      })
      this.nodesGroup.buildNodes({ components : this.entityComponents})
      this.nodesGroup.initDraggable()
      this.nodesGroup.initCables()
      this.nodesGroup.outputTerminalListners()
    } else {
      console.warn('the entity components haven\'t been built yet')
    }
  }.observes('draw'),


});

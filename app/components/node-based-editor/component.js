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
      this.nodesGroup.initCables()
      this.nodesGroup.initDraggable()
    }
  }.observes('draw'),

  createBezierCurve: function (opts) {
    var curveString = this.buildBezierCurveString({start : opts.startPosition, end : opts.endPosition})
    var cable = this.draw.path( curveString ).fill('none').stroke({ width: 1 })
    cable.startPosition = opts.startPosition
    cable.endPosition = opts.endPosition
    return cable
  },

  updateBezierCurve: function (opts) {

  },

  buildBezierCurveString: function (opts) {
    var start = opts.start
    var end = opts.end
    if (start.top) {
      start.x = start.left
      start.y = start.top
      end.x = end.left
      end.y = end.top
    }
    var controlPt1 = {}
    controlPt1.x = (end.x - start.x) / 2  + start.x
    controlPt1.y = start.y

    var controlPt2 = {}
    controlPt2.x = (end.x - start.x) / 2 + start.x
    controlPt2.y = end.y

    return `M ${start.x} ${start.y} C ${controlPt1.x} ${controlPt1.y} ${controlPt2.x} ${controlPt2.y} ${end.x} ${end.y}`
  },


});

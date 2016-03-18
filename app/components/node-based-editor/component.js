import Ember from 'ember';

export default Ember.Component.extend({
  draw: undefined,
  entityComponents: [],
  entitySvgNodes: {},
  didInsertElement() {
    this.initSVGDocument()
  },

  initSVGDocument: function () {
    var draw = SVG('svg-container').size(window.innerWidth, window.innerHeight)
    this.set('draw', draw)
  },

  buldSVGNode: function () {
    var self = this
    var nodeGroups = {}

      if (self.entityComponents.length === self.model.entities.length) {

        _.forEach(self.entityComponents, function (component, i) {

          var id = component.get('id')

          var group = self.buildDrawgroup({id : id})
          group.translate(30, ((130 * i) + 30 ))

          group.footprint = group.rect(160, 120).attr({ fill: '#ddd' })
          group.dragRect = group.rect(16  0, 20).attr({ fill: '#ffffff' })

          var dragRect = group.dragRect
          Ember.$(dragRect.node).on('mouseenter', function () {
            group.draggable()
          })

          Ember.$(dragRect.node).on('mouseleave', function () {
            group.draggable(false)
          })

          group.foreignObj = group.foreignObject().attr({id: 'component'})
          group.foreignObj.translate(0,20)

          group.foreignObj.appendChild(component.element)


          var start = {
            x: 500,
            y: 500
          }
          var end = {
            x: 1100,
            y: 1100
          }

          var line = self.createBezierCurve({
            start : start,
            end : end
          })


          Ember.$(document).on('mousemove', function (e) {
            end.x = e.clientX
            end.y = e.clientY
            line.plot( self.buildBezierCurveString({ start : start, end : end }) )
          })




        })
      }
  }.observes('draw'),

  createBezierCurve: function (opts) {
    var curveString = this.buildBezierCurveString({start : opts.start, end : opts.end})
    return this.draw.path( curveString ).fill('none').stroke({ width: 1 })
  },

  updateBezierCurve: function (opts) {

  },

  buildBezierCurveString: function (opts) {
    var start = opts.start
    var end = opts.end
    var controlPt1 = {}
    controlPt1.x = (end.x - start.x) / 2  + start.x
    controlPt1.y = start.y

    var controlPt2 = {}
    controlPt2.x = (end.x - start.x) / 2 + start.x
    controlPt2.y = end.y

    return `M ${start.x} ${start.y} C ${controlPt1.x} ${controlPt1.y} ${controlPt2.x} ${controlPt2.y} ${end.x} ${end.y}`
  },

  buildDrawgroup: function (opts) {
    return this.entitySvgNodes[opts.id] = this.draw.group()
  },


});

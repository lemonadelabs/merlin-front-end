import Ember from 'ember';
import EntityDrawGroup from './entityDrawGroup'

export default Ember.Component.extend({
  draw: undefined,
  entityComponents: [],
  entitySvgNodes: {},
  entityDrawGroups: {},
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

      console.log('qwerqwer')

      if (self.entityComponents.length === self.model.entities.length) {

          // var start = {
          //   x: 0,
          //   y: 0
          // }
          // var end = {
          //   x: 0,
          //   y: 0
          // }

        _.forEach(self.entityComponents, function (component, i) {

          var id = component.get('id')

          self.entityDrawGroups[id] = new EntityDrawGroup({
            id : id,
            draw : self.draw,
            component : component
          })



          self.entityDrawGroups[id].translate(30, ((130 * i) + 30 ))

        //   group.footprint = group.rect(160, 120).attr({ fill: '#ddd' })
        //   group.dragRect = group.rect(160, 20).attr({ fill: '#999' })

        //   var dragRect = group.dragRect
        //   Ember.$(dragRect.node).on('mouseenter', function () {
        //     group.draggable()
        //   })

        //   Ember.$(dragRect.node).on('mouseleave', function () {
        //     group.draggable(false)
        //   })

        //   group.foreignObj = group.foreignObject().attr({id: 'component'})
        //   group.foreignObj.translate(0,20)

        //   group.foreignObj.appendChild(component.element)

        //   group.outputs = {}

        //   group.outputs[1] = group.rect(15, 15).attr({ fill: '#790AC7' }).translate(-15,40)
        //   group.outputs[1].connected = false
        //   group.outputs[2] = group.rect(15, 15).attr({ fill: '#790AC7' }).translate(-15,80)
        //   group.outputs[2].connected = false
        //   group.outputs[3] = group.rect(15, 15).attr({ fill: '#790AC7' }).translate(160,40)
        //   group.outputs[3].connected = false
        //   group.outputs[4] = group.rect(15, 15).attr({ fill: '#790AC7' }).translate(160,80)
        //   group.outputs[4].connected = false

        //   _.forEach(group.outputs, function (output) {

        //     Ember.$(output.node).on('mousedown', function (e) {
        //       onConnectorMouseDown({ output : output, e : e })
        //     })

        //     Ember.$(output.node).on('mouseup', function (e) {
        //       onConnectorMouseUp({ output : output, e : e })
        //     })

        //   })

        //   function onConnectorMouseDown(opts) {

        //     var line = self.createBezierCurve({
        //       start : start,
        //       end : end
        //     })

        //     var output = opts.output
        //     var e = opts.e
        //   //   give the start position to the connector clicked on
        //     var position = $(output.node).position()
        //     start.x = end.x = position.left
        //     start.y = end.y = position.top
        //     line.plot( self.buildBezierCurveString({ start : start, end : end }) )

        //     Ember.$(document).on('mousemove', followMouse )
        //     function followMouse(e) {
        //       end.x = e.clientX
        //       end.y = e.clientY
        //       line.plot( self.buildBezierCurveString({ start : start, end : end }) )
        //     }

        //     Ember.$(document).on('mouseup', unbind )
        //     function unbind() {
        //       Ember.$(document).unbind('mousemove', followMouse )
        //       Ember.$(document).unbind('mouseup', unbind )
        //     }

        //   }

        //   function onConnectorMouseUp(opts) {
        //     var position = $(output.node).position()
        //     end.x = position.left
        //     end.y = position.top
        //     line.plot( self.buildBezierCurveString({ start : start, end : end }) )
        //   }

        //   function onConnectorClick(output) {
        //     var position = $(output.node).position()
        //     start.x = position.left
        //     start.y = position.top
        //     line.plot( self.buildBezierCurveString({ start : start, end : end }) )
        //   }
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

  // buildDrawgroup: function (opts) {
  //   return this.entitySvgNodes[opts.id] = this.draw.group()
  // },


});
